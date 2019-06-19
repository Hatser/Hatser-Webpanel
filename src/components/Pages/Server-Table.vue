<template>
  <div>
  <v-card>
    <v-card-title>
      서버 목록
      <v-spacer></v-spacer>
      <v-text-field
        append-icon="search"
        label="Search"
        hide-details
        v-model="search"
      ></v-text-field>
    </v-card-title>
    <v-data-table
        v-bind:headers="headers"
        v-bind:items="serverData"
        v-bind:search="search"
        hide-actions
        id="server-table"
      >
      <template slot="items" slot-scope="props">
        <tr class="md-table-row" :class="{'online':props.item.online, 'offline':!props.item.online}" @contextmenu.prevent="showCtxMenu($event, props.item)" @click="props.item.online?props.expanded = !props.expanded:null">
            <td class="text-xs-left cell-server-icon">
              <img v-if="props.item.icon.icon_type == 'image'" :src="'/api/images/servers/icons/'+props.item.icon.icon_content"/>
              <v-icon v-if="props.item.icon.icon_type == 'font'" v-text="props.item.icon.icon_content"></v-icon>
            </td>
            <!-- TODO: 주소 바꾸기 -->
            <td class="text-xs-center"><img v-if="props.item.game" :src="'/api/images/games/icons/'+props.item.game" height="35px"/></td>
            <td class="text-xs-center cell-vac-icon"><span v-show="props.item.online"><v-icon v-show="props.item.vac">fas fa-shield-alt</v-icon> <v-icon v-show="!props.item.vac">far fa-times-circle</v-icon></span></td>
            <td class="text-xs-center cell-password-icon"><span v-show="props.item.online"><v-icon v-show="!props.item.password">fas fa-unlock-alt</v-icon><v-icon v-show="props.item.password">fas fa-lock</v-icon></span></td>
            <td class="text-xs-left server-name-container"><span v-text="props.item.displayname"></span><span class="server-name-alias" v-if="props.item.alias && props.item.alias !== '' && props.item.online" v-text="'('+props.item.alias+')'"></span></td>
            <td class="text-xs-center"><v-chip v-show="!props.item.online" color="red" text-color="white">Offline</v-chip><span v-show="props.item.online" v-text="props.item.players + '/' + props.item.maxplayers"></span></td>
					  <td class="text-xs-center"><span v-text="props.item.address + ':' + props.item.port"></span></td>
        </tr>
      </template>

      <template slot="expand" slot-scope="props">
        <v-card flat>
          <v-card-title class="server-detail-title">
            <v-spacer></v-spacer>
            <span class="server-detail-title-servername" v-text="props.item.displayname"></span>
            <v-spacer></v-spacer>
            <div class="server-detail-title-serverinfo">
              <span v-text="props.item.map"></span><br>
              <span v-text="props.item.players+' / '+props.item.maxplayers"></span>
            </div>
          </v-card-title>
          <!-- 소켓이 연결되었을 때 테이블 표시 -->
          <v-card-text v-if="props.item.socketConnected">
            <v-layout row wrap>
              <v-flex xs12 sm6 v-for="n in 2" class="server-detail-player-container" :class="'team'+n" :key="'table_team'+n">
                <div class="table__overflow" :key="'team'+n" style="position: relative;overflow-x: hidden;">
                  <table class="datatable table">
                    <thead>
                      <tr class="server-detail-teamname"><th colspan="9" v-text="props.item.team['teamname'+n]+' ('+orderedPlayerInfo[props.item.id]['team'+n].length+')'"></th></tr>
                      <tr>
                        <th role="columnheader" scope="col" aria-sort="none" class="column text-xs-left"></th>
                        <th role="columnheader" scope="col" aria-sort="none" tabindex="0" class="column text-xs-center">
                          Name
                        </th>
                        <th role="columnheader" scope="col" aria-sort="none" tabindex="0" class="column text-xs-center">
                          Kills
                        </th>
                        <th role="columnheader" scope="col" aria-sort="none" tabindex="0" class="column text-xs-center">
                          Deaths
                        </th>
                        <th role="columnheader" scope="col" aria-sort="descending" tabindex="0" class="column sortable active desc text-xs-center">
                          <i aria-hidden="true" class="material-icons icon">arrow_upward</i>Score
                        </th>
                      </tr>
                      <tr class="datatable__progress"><th colspan="100%" class="column"></th></tr>
                    </thead>
                    <!--
                      <transition-group tag="tbody" name="table-player-row" enter-active-class="animated" :enter-active-class="n<=1?'bounceInLeft':'bounceRight'"
                                                                          leave-active-class="animated" :leave-active-class="n<=1?'bounceOutLeft':'bounceOutRight'">
                     -->
                    <transition-group tag="tbody" name="table-player-row">
                      <tr v-for="player in orderedPlayerInfo[props.item.id]['team'+n]" :key="'row'+player.authid">
                        <td :key="'avatar_'+player.authid">
                          <v-tooltip top v-if="player.bot">
                            <v-icon slot="activator">memory</v-icon>
                            <span>봇</span>
                          </v-tooltip>
                          <img v-else :src="player.avatar">
                        </td>
                        <td class="text-xs-left" :key="'name_'+player.authid">
                          <v-tooltip top v-if="player.admin && player.permission">
                            <span v-text="player.name" slot="activator" class="user-name" :class="{'root-admin': player.permission.flags==='z', 'general-admin': player.permission.flags!==''}"></span>
                            <span v-text="player.permission.flags==='z' ? '최고 관리자':'일반 관리자'"></span>
                          </v-tooltip>
                          <span v-else v-text="player.name" slot="activator" class="user-name"></span>
                        </td>
                        <td class="text-xs-right" :key="'kills_'+player.authid"><span v-text="player.kills"></span></td>
                        <td class="text-xs-right" :key="'deaths_'+player.authid"><span v-text="player.deaths"></span></td>
                        <td class="text-xs-right" :key="'score_'+player.authid"><span v-text="player.score"></span></td>
                      </tr>
                    </transition-group>
                  </table>
                </div>
              </v-flex>
            </v-layout>
          </v-card-text>
          <!-- 소켓이 연결되지 않았을 때 테이블 표시 -->
          <v-card-text v-else>
            <v-layout row wrap>
              <v-flex xs12 class="server-detail-player-container all-players">
                <div class="table__overflow" style="position: relative;overflow-x: hidden;">
                  <table class="datatable table">
                    <thead>
                      <tr class="server-detail-teamname"><th colspan="9" v-text="'플레이어'+' ('+orderedPlayerInfo[props.item.id].allPlayers.length+')'"></th></tr>
                      <tr>
                        <th role="columnheader" scope="col" aria-sort="none" tabindex="0" class="column text-xs-center" style="padding:0px;width:30px;"></th>
                        <th role="columnheader" scope="col" aria-sort="none" tabindex="0" class="column text-xs-center">
                          Name
                        </th>
                        <th role="columnheader" scope="col" aria-sort="descending" tabindex="0" class="column sortable active desc text-xs-center">
                          <i aria-hidden="true" class="material-icons icon">arrow_upward</i>Score
                        </th>
                        <th role="columnheader" scope="col" aria-sort="descending" tabindex="0" class="column sortable active desc text-xs-center">
                          Play Time
                        </th>
                      </tr>
                      <tr class="datatable__progress"><th colspan="100%" class="column"></th></tr>
                    </thead>
                    <!--
                      <transition-group tag="tbody" name="table-player-row" enter-active-class="animated" :enter-active-class="n<=1?'bounceInLeft':'bounceRight'"
                                                                          leave-active-class="animated" :leave-active-class="n<=1?'bounceOutLeft':'bounceOutRight'">
                     -->
                    <transition-group tag="tbody" name="table-player-row">
                      <tr v-for="player in orderedPlayerInfo[props.item.id].allPlayers" :key="'row'+player.name">
                        <td class="text-xs-center" :key="'specific_'+player.name">
                          <v-tooltip top v-if="player.bot">
                            <v-icon slot="activator">memory</v-icon>
                            <span>봇</span>
                          </v-tooltip>
                        </td>
                        <td class="text-xs-center" :key="'name_'+player.name"><span v-text="player.name"></span></td>
                        <td class="text-xs-center" :key="'score_'+player.name"><span v-text="player.score"></span></td>
                        <td class="text-xs-center" :key="'time_'+player.name"><span v-text="formatSecondTime(player.time)"></span></td>
                      </tr>
                    </transition-group>
                  </table>
                </div>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </template>
    </v-data-table>
  </v-card>
  <v-dialog v-if="$store.getters['auth/user'] && $store.getters['auth/user'].user.webPermissions && $store.getters['auth/user'].user.webPermissions.includes('WEB_ADM_PERM_GAME_SERVER')" v-model="regDialog" scrollable persistent max-width="700px">
    <page-server-register @close-dialog="regDialog = false" @action-finish="activeSnackbar" :serverData="serverData" ref="registerDialog"></page-server-register>
  </v-dialog>
  <v-dialog v-if="$store.getters['auth/user'] && $store.getters['auth/user'].user.webPermissions && $store.getters['auth/user'].user.webPermissions.includes('WEB_ADM_PERM_GAME_SERVER')" v-model="delDialog" persistent  max-width="700px">
    <confirm-box @close-dialog="delDialog = false" @action-finish="activeSnackbar" :type="'server'" ref="deleteDialog"></confirm-box>
  </v-dialog>
  <v-tooltip top v-if="$store.getters['auth/user'] && $store.getters['auth/user'].user.webPermissions && $store.getters['auth/user'].user.webPermissions.includes('WEB_ADM_PERM_GAME_SERVER')">
    <v-btn
      fixed
      dark
      fab
      bottom
      right
      color="primary"
      @click.native="openDialog"
      slot="activator"
    >
      <v-icon>add</v-icon>
    </v-btn>
    <span>서버 추가</span>
  </v-tooltip>

  <v-menu offset-y v-model="ctxMenu" :position-x="ctxX" :position-y="ctxY" absolute transition="scale-transition" full-width>
    <v-list class="ctx-menu">
      <v-list-tile :href="ctxMenuData?'https://steamcommunity.com/profiles/'+ctxMenuData.steamid:null" target="_blank">
        <v-list-tile-action>
            <v-icon>insert_link</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>서버 접속</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <div v-if="$store.getters['auth/user'] && $store.getters['auth/user'].user.webPermissions && $store.getters['auth/user'].user.webPermissions.includes('WEB_ADM_PERM_GAME_SERVER')">
        <v-divider></v-divider>
        <v-list-tile @click="onContextClick($event, ctxMenuData, 'edit')">
          <v-list-tile-action>
              <v-icon>edit</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>서버 수정</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="onContextClick($event, ctxMenuData, 'delete')">
          <v-list-tile-action>
              <v-icon>delete</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>서버 삭제</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </div>
    </v-list>
  </v-menu>

  <v-snackbar
      :timeout="5000"
      bottom
      right
      :color="snackbarAction"
      v-model="snackbar"
      ref="snackbar"
    >
      {{ snackbarText }}
      <v-btn flat dark @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>

import _ from 'lodash'

const toLower = text => {
    return text.toString().toLowerCase()
}

const searchByName = (items, term) => {
    if (term) {
        return items.filter(item => toLower(item.personaname).includes(toLower(term)))
    }

    return items
}

import AdminRegister from './Server-Register';
import ConfirmBox from './Confirm';
export default {
    name: 'server-table',
    components: { 'page-server-register': AdminRegister,
                  'confirm-box': ConfirmBox },
    data () {
        return {
            search: '',
            searched: [],
            serverData: [],
            currentSort: 'displayname',
            currentSortOrder: 'asc',
            interval: null,
            menuData: {},
            regDialog: false,
            delDialog: false,
            snackbar: false,
            snackbarAction:'',
            snackbarText: '',
            ctxMenu: false,
            ctxMenuData: null,
            ctxX:0,
            ctxY:0,

            headers: [
                { text: '', align: 'left', sortable: false, value: 'avatar' },
                { text: 'Game', align: 'center', sortable: false, value: 'game' },
                { text: 'VAC', align: 'center', sortable: false, value: 'vac' },
                { text: 'Private', align: 'center', sortable: false, value: 'password' },
                { text: 'Server Name', align: 'center', value: 'displayname' },
                { text: 'Players', align: 'center', value: 'players' },
                { text: 'Address', align: 'center', sortable: false, value: 'address' },
            ]
        }
    },
    methods: {
        loadData: function () {
            if(!this.regDialog) {
                this.$http.get('/api/server/list')
                .then((response) => {
                    this.serverData = response.data.serverInfo;
                    if(!this.search || this.search === '') {
                        this.searched = this.serverData;
                    }
                }).catch((err) => console.log(err));
            }
        },
        customSort: function (value) {
            return value.sort((a, b) => {
                const sortBy = this.currentSort.split('.');

                for ( let i = 0; i < sortBy.length; i++ ) {
                    a = a[sortBy[i]];
                    b = b[sortBy[i]];
                }

                if (this.currentSortOrder === 'desc') {
                    return a.localeCompare(b);
                }

                return b.localeCompare(a);
            });
        },
        searchOnTable: function () {
            this.searched = searchByName(this.serverData, this.search);
        },
        showCtxMenu (e,item) {
          this.ctxMenu = false
          this.ctxX = e.clientX
          this.ctxY = e.clientY
          this.ctxMenuData = item;
          this.$nextTick(() => {
            this.ctxMenu = true
          })
        },
        onContextClick: function(e, data, action) {
            if(action === 'edit'){
              this.$refs.registerDialog.editAction = data.id;
              this.$refs.registerDialog.port = data.port
              this.$refs.registerDialog.alias = data.alias

              if(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test(data.address)) {
                this.$refs.registerDialog.ipAddress = data.address
                this.$refs.registerDialog.activeAddressTab = 'tab-address-ip'
              } else if(/^([a-z\d](-*[a-z\d])*)(\.([a-z\d](-*[a-z\d])*))*$/i.test(data.address)) {
                this.$refs.registerDialog.domainAddress = data.address
                this.$refs.registerDialog.activeAddressTab = 'tab-address-domain'
              }

              if(data.icon.icon_type === 'image') {
                this.$refs.registerDialog.activeIconTab = 'tab-icon-image'
                this.$refs.registerDialog.imgTempPath = '/api/images/servers/icons/'+data.icon.icon_content
                this.$refs.registerDialog.currentStatus = 1
              } else if(data.icon.icon_type === 'font'){
                this.$refs.registerDialog.activeIconTab = 'tab-icon-font'
                this.$refs.registerDialog.iconFont = data.icon.icon_content
              }
              this.regDialog = true

            } else if(action === 'delete') {
              this.$refs.deleteDialog.target = data
              this.$refs.deleteDialog.countdown(3)()
              this.delDialog = true
            }
        },
        activeSnackbar: function(msg, color){
          this.snackbarText = msg
          this.snackbarAction = color
          this.snackbar = true
          if(color==='success') {
            this.loadData()
          }
        },
        openDialog: function() {
          this.$refs.registerDialog.editAction = false
          this.regDialog = true
        },
        formatSecondTime: function(time) {
          if(time >= 60) {
            time = Math.floor(time / 60); // 분
            if(time >= 60) {
              time = Math.floor(time / 60); // 시간
              if(time >= 24) {
                time = Math.floor(time / 24); // 일
                return time + ' 일'
              } else {
                return time+' 시간'
              }
            } else {
              return time+' 분'
            }
          } else {
            return time+' 초'
          }
        }
    },
    computed: {
      orderedPlayerInfo: function() {
        let result = {};
        this.serverData.forEach(function(e, i, a){
          if(e.playerInfo) {
            result[e.id] = e.playerInfo
            if(e.socketConnected) {
              result[e.id].team1 = _.orderBy(result[e.id].team1, ['score'], ['desc']);
              result[e.id].team2 = _.orderBy(result[e.id].team2, ['score'], ['desc']);
            } else {
              result[e.id].allPlayers = _.orderBy(result[e.id].allPlayers, ['score'], ['desc']);
            }
          }
        });
        return result;
      }
    },
    mounted: function () {
        this.loadData()
        this.interval = setInterval(this.loadData, 30000)
    },
    beforeDestroy: function(){
        clearInterval(this.interval);
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
#server-table .md-table-row > td:nth-child(1) {
    box-sizing: border-box;
    border-left-width: 10px;
    border-left-style: solid;
}

/* offline */
#server-table .md-table-row.offline > td:nth-child(1){
    border-left-color: #FF5252;
}

#server-table .md-table-row.online > td:nth-child(1) {
	border-left-color:#90ba3c;
}

#server-table .cell-server-icon img {
    height: 48px;
}

#server-table > table > tbody > tr > td.cell-server-icon > span > i.icon,
#server-table > table > tbody > tr > td.cell-vac-icon > span > i.icon,
#server-table > table > tbody > tr > td.cell-password-icon > span > i.icon {
    font-size: 20px;
}

#server-table > table > tbody > tr > td.cell-vac-icon > span > i.icon.fa-shield-alt{
    color: #90ba3c;
}
#server-table > table > tbody > tr > td.cell-vac-icon > span > i.icon.fa-times-circle{
    color: #ea6153;
}
#server-table > table > tbody > tr > td.cell-password-icon > span > i.icon.fa-unlock-alt {
    color: #295;
}
#server-table > table > tbody > tr > td.cell-password-icon > span > i.icon.fa-lock {
    color: #e98b39;
}

#server-table .server-name-container {
  font-size:16px;
}

#server-table .server-name-alias{
  font-size: 0.75em;
  color:#888;
  margin-left:5px;
}

#server-table table.table tbody td:first-child,
#server-table table.table tbody td:not(:first-child),
#server-table table.table tbody th:first-child,
#server-table table.table tbody th:not(:first-child),
#server-table table.table thead td:first-child,
#server-table table.table thead td:not(:first-child),
#server-table table.table thead th:first-child,
#server-table table.table thead th:not(:first-child) {
    padding: 0px 16px;
}

#server-table .server-detail-title {
  font-size: 1.5em;
}

#server-table .server-detail-title-serverinfo {
  position: absolute;
  right: 15px;
  text-align: right;
  font-size:0.85em;
}

#server-table .server-detail-player-container .table > * > tr > *:nth-child(1) {
  padding:0px;
  width:32px;
  padding-left: 5px;
  padding-right: 0px;
}
#server-table .server-detail-player-container .table > * > tr > *:nth-child(2) {
  width:50%;
}
#server-table .server-detail-player-container .table > * > tr > *:nth-child(3),
#server-table .server-detail-player-container .table > * > tr > *:nth-child(4),
#server-table .server-detail-player-container .table > * > tr > *:nth-child(5){
  width:15%;
}
#server-table .server-detail-player-container.all-players .table > * > tr > *:nth-child(1){
  width:30px;
}
#server-table .server-detail-player-container.all-players .table > * > tr > *:nth-child(2){
  width:70%;
}
#server-table .server-detail-player-container.all-players .table > * > tr > *:nth-child(3){
  width:30%;
}

#server-table .table-player-row-move {
  transition: all 1s;
}

#server-table .server-detail-player-container .table thead th {
    color: rgba(255,255,255,.87);
}
#server-table .server-detail-player-container.team1 .table thead th {
    background-color: #319cf2;
    border-color: #2d90e0;
}

#server-table .server-detail-player-container.team2 .table thead th {
    background-color: rgb(195, 81, 47);
    border-color: rgb(179, 74, 42);
}
#server-table .server-detail-player-container .table thead th.sortable {
    color: rgba(255,255,255,.98);
}

#server-table .server-detail-player-container.all-players .table thead th {
    background-color: #777;
    border-color: #666;
}

#server-table .server-detail-player-container.team1 .table-player-row-enter, #server-table .server-detail-player-container.team1 .table-player-row-leave-to
{
  opacity: 0;
  transform: translateX(-50%);
}
#server-table .server-detail-player-container.team2 .table-player-row-enter, #server-table .server-detail-player-container.team2 .table-player-row-leave-to
{
  opacity: 0;
  transform: translateX(50%);
}

#server-table .server-detail-player-container .server-detail-teamname {
  border:none;
  height: 30px;
}

#server-table .server-detail-player-container .server-detail-teamname > th {
  padding:0px;
  height: 30px;
  color:#ffffff !important;
  font-size: 1.23em;
}

#server-table .server-detail-player-container .user-name.general-admin {
  color: rgb(46, 204, 113);
  font-weight:bold;
}
#server-table .server-detail-player-container .user-name.general-admin.root-admin {
  color: rgb(231, 76, 60);
}


#server-table .table-player-row-enter-active, #server-table .table-player-row-leave-active {
  transition: all 1s cubic-bezier(0.68, -1, 0.265, 1.55);
}

#server-table .table-player-row-leave-active {
  position:absolute;
  width: 100%;
}

.ctx-menu .list__tile__title{
  font-size: 1em;
  font-weight: 400;
}

.ctx-menu.list {
  padding:0px;
}
</style>
