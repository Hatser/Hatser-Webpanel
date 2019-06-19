<template>
  <div>
  <v-card>
    <v-card-title>
      관리자 목록
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
        v-bind:items="adminData"
        v-bind:search="search"
        hide-actions
        id="admin-table"
      >
      <template slot="items" slot-scope="{ item }">
        <tr class="md-table-row" :class="stateClass(item.personastate, item.gameid)" @contextmenu.prevent="showCtxMenu($event, item)">
            <td class="text-xs-left"><div class="admin-avatar-container"><img v-bind:src="item.avatar" class="user-image"></div></td>
            <td class="text-xs-left admin-name-container"><span v-text="item.personaname"></span><span class="admin-name-alias" v-if="item.admindata.alias && item.admindata.alias !== ''" v-text="'('+item.admindata.alias+')'"></span></td>
            <td class="text-xs-center md-table-cell-servers">
                <span v-for="perms in item.admindata.permissions" :key="'loop_'+perms.server">
                    <template v-if="perms.flags !== ''">
                        <template v-if="perms.server == 0">
                            <template v-for="server in serverData">
                                <v-tooltip top :key="'tooltip_'+server.id">
                                  <!-- TODO: 주소 바꾸기 -->
                                    <img v-if="server.icon.icon_type == 'image'" slot="activator" :id="server.id" :src="'/api/images/servers/icons/'+server.icon.icon_content" :key="'icon_'+server.id"/>
                                    <v-icon v-if="server.icon.icon_type == 'font'" slot="activator"  :id="server.id" :key="'icon_'+server.id" v-text="server.icon.icon_content"></v-icon>
                                    <span v-text="server.displayname"></span>
                                </v-tooltip>
                            </template>
                        </template>
                        <template v-else-if="!(item.admindata.permissions[0] && item.admindata.permissions[0].flags !== '')">
                          <v-tooltip top :key="'tooltip_'+perms.server">
                            <!-- TODO: 주소 바꾸기 -->
                              <img v-if="serverData[perms.server].icon.icon_type == 'image'" slot="activator" :id="perms.server" :src="'/api/images/servers/icons/'+serverData[perms.server].icon.icon_content" :key="'icon_'+perms.server"/>
                              <v-icon v-if="serverData[perms.server].icon.icon_type == 'font'" slot="activator"  :id="perms.server" :key="'icon_'+perms.server" v-text="serverData[perms.server].icon.icon_content"></v-icon>
                              <span v-text="serverData[perms.server].displayname"></span>
                          </v-tooltip>
                        </template>
                    </template>
                </span>
            </td>
            <td class="text-xs-center">{{ item.personastate === 0 ? timeSince(item.lastlogoff*1000) : 'Online' }}</td>
            <!--
            <td class="text-xs-right">
            <v-edit-dialog
                @open="tmp = props.item.iron"
                @save="props.item.iron = tmp || props.item.iron"
                large
                lazy
            >
                <div>{{ props.item.iron }}</div>
                <div slot="input" class="mt-3 title">Update Iron</div>
                <v-text-field
                slot="input"
                label="Edit"
                v-model="tmp"
                single-line
                counter
                autofocus
                :rules="[max25chars]"
                ></v-text-field>
            </v-edit-dialog>
            </td>-->
        </tr>
      </template>
    </v-data-table>
  </v-card>
  <v-dialog v-if="$store.getters['auth/user'] && $store.getters['auth/user'].user.webPermissions && $store.getters['auth/user'].user.webPermissions.includes('WEB_ADM_PERM_GAME_SERVER_ADMIN')" v-model="regDialog" scrollable persistent max-width="700px">
    <page-admin-register @close-dialog="regDialog = false" @action-finish="activeSnackbar" :serverData="serverData" ref="registerDialog"></page-admin-register>
  </v-dialog>
  <v-dialog v-if="$store.getters['auth/user'] && $store.getters['auth/user'].user.webPermissions && $store.getters['auth/user'].user.webPermissions.includes('WEB_ADM_PERM_GAME_SERVER_ADMIN')" v-model="delDialog" persistent  max-width="700px">
    <confirm-box @close-dialog="delDialog = false" @action-finish="activeSnackbar" :type="'admin'" ref="deleteDialog"></confirm-box>
  </v-dialog>
  <v-tooltip top v-if="$store.getters['auth/user'] && $store.getters['auth/user'].user.webPermissions && $store.getters['auth/user'].user.webPermissions.includes('WEB_ADM_PERM_GAME_SERVER_ADMIN')">
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
    <span>관리자 추가</span>
  </v-tooltip>

  <v-menu offset-y v-model="ctxMenu" :position-x="ctxX" :position-y="ctxY" absolute transition="scale-transition" full-width>
    <v-list class="ctx-menu">
      <v-list-tile :href="ctxMenuData?'https://steamcommunity.com/profiles/'+ctxMenuData.steamid:null" target="_blank">
        <v-list-tile-action>
            <v-icon>insert_link</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Profile Link</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <div v-if="$store.getters['auth/user'] && $store.getters['auth/user'].user.webPermissions && $store.getters['auth/user'].user.webPermissions.includes('WEB_ADM_PERM_GAME_SERVER_ADMIN')">
        <v-divider></v-divider>
        <v-list-tile @click="onContextClick($event, ctxMenuData, 'edit')">
          <v-list-tile-action>
              <v-icon>edit</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Edit Admin</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="onContextClick($event, ctxMenuData, 'delete')">
          <v-list-tile-action>
              <v-icon>delete</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Delete Admin</v-list-tile-title>
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
const toLower = text => {
    return text.toString().toLowerCase()
}

const searchByName = (items, term) => {
    if (term) {
        return items.filter(item => toLower(item.personaname).includes(toLower(term)))
    }

    return items
}

import AdminRegister from './Admin-Register';
import ConfirmBox from './Confirm';
export default {
    name: 'admin-table',
    components: { 'page-admin-register': AdminRegister,
                  'confirm-box': ConfirmBox },
    data () {
        return {
            search: '',
            searched: [],
            adminData: [],
            serverData: {},
            currentSort: 'personaname',
            currentSortOrder: 'asc',
            interval: null,
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
                {
                    text: '',
                    align: 'left',
                    sortable: false,
                    value: 'avatar'
                },
                { text: 'Name', align: 'center', value: 'personaname' },
                { text: 'Managing Servers', align: 'center', value: 'admindata.permServerCount' },
                { text: 'Last Logoff', align: 'center',
                    sortable: false,
                    value: 'lastlogoff' }
            ],
        }
    },
    methods: {
        loadData: function () {
            if(!this.regDialog) {
                // TODO: 주소 바꾸기
                this.$http.get('/api/admin/list')
                .then((response) => {
                    this.adminData = response.data.adminData;
                    this.serverData = response.data.serverData;
                    if(!this.search || this.search === '') {
                        this.searched = this.adminData;
                    }

                    console.log(this.adminData);
                    console.log(this.serverData);
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
            this.searched = searchByName(this.adminData, this.search);
        },
        stateClass: function(state, gameid) {
            if(gameid && gameid > 0) {
                return 'playing';
            }
            return 'state'+state;
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
              this.$refs.registerDialog.editAction = true
              this.$refs.registerDialog.steamId = data.steamid
              this.$refs.registerDialog.searchSteamUser()
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
        timeSince: function(date, reversed = false) {
            var seconds;
            if(!reversed)
                seconds = Math.floor((new Date() - date) / 1000);
            else
                seconds = Math.floor((date - new Date()) / 1000);

            var interval = Math.floor(seconds / 31536000);
            // 2년 후부터 년단위로 표시한다.
            if (interval > 1) {
            //    return t('web.time.years', {value: interval});
                return interval + ' years ago';
            }
            interval = Math.floor(seconds / 2592000);
            // 2개월 후부터 월단위로 표시한다.
            if (interval > 1) {
            //    return t('web.time.months', {value: interval});
                return interval + ' months ago';
            }
            interval = Math.floor(seconds / 86400);
            // 2일 후부터 일단위로 표시한다.
            if (interval > 1) {
            //    return t('web.time.days', {value: interval});
                return interval + ' days ago';
            }
            interval = Math.floor(seconds / 3600);
            // 2시간 후부터 시간단위로 표시한다.
            if (interval > 1) {
            //    return t('web.time.hours', {value: interval});
                return interval + ' hours ago';
            }
            interval = Math.floor(seconds / 60);
            // 2분 후부터 분단위로 표시한다.
            if (interval > 1) {
            //    return t('web.time.minutes', {value: interval});
                return interval + ' minutes ago';
            }
            //return t('web.time.seconds', {value: Math.floor(seconds)});
            return interval + ' seconds ago';
        }
    },
    created: function () {

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
#admin-table .md-table-row > td:nth-child(1) {
    box-sizing: border-box;
    border-left-width: 10px;
    border-left-style: solid;
}

/* offline */
#admin-table .md-table-row.state0 > td:nth-child(1){
    border-left-color: #898989;
}

#admin-table .md-table-row.state0 .admin-avatar-container {
	background: -webkit-linear-gradient( top, rgba(106,106,106,1) 5%, rgba(85,85,85,1) 95%);background: linear-gradient( to bottom, rgba(106,106,106,1) 5%, rgba(85,85,85,1) 95%);	/* IE <= 9 doesn't support rounded corners and gradient.  The gradient isn't too noticable so just disable the filter in IE9 */
	filter: none;
}

#admin-table .md-table-row.state0 .admin-avatar-container > img {
	background: -webkit-linear-gradient( top, #515151 5%, #474747 95%);background: linear-gradient( to bottom, #515151 5%, #474747 95%);
  vertical-align: middle;
}

/* away */
#admin-table .md-table-row.state2 > td:nth-child(1),
#admin-table .md-table-row.state3 > td:nth-child(1),
#admin-table .md-table-row.state4 > td:nth-child(1) {
	border-left-color: #e4ca63;
}

#admin-table .md-table-row.state2 .admin-avatar-container,
#admin-table .md-table-row.state3 .admin-avatar-container,
#admin-table .md-table-row.state4 .admin-avatar-container {
	background-color: #e4ca63;
	background: -webkit-linear-gradient( 145deg, #d5bf6a 10%,#ffe2a9 40%,#ba995c 52%,#ba995c 61%,#d5bf6a 85%);
	background: linear-gradient( 145deg, #d5bf6a 10%,#ffe2a9 40%,#ba995c 52%,#ba995c 61%,#d5bf6a 85%);
}
#admin-table .md-table-row.state2 .admin-avatar-container > img,
#admin-table .md-table-row.state3 .admin-avatar-container > img,
#admin-table .md-table-row.state4 .admin-avatar-container > img {
	background-color: #e4ca63;
	background: -webkit-linear-gradient( 145deg, #d5bf6a 10%,#ffe2a9 40%,#ba995c 52%,#ba995c 61%,#d5bf6a 85%);
	background: linear-gradient( 145deg, #d5bf6a 10%,#ffe2a9 40%,#ba995c 52%,#ba995c 61%,#d5bf6a 85%);
}

/* online */
#admin-table .md-table-row.state1 > td:nth-child(1),
#admin-table .md-table-row.state5 > td:nth-child(1),
#admin-table .md-table-row.state6 > td:nth-child(1) {
	border-left-color: #57cbde;
}

#admin-table .md-table-row.state1 .admin-avatar-container,
#admin-table .md-table-row.state5 .admin-avatar-container,
#admin-table .md-table-row.state6 .admin-avatar-container {
	background-color: #57cbde;
	background: -webkit-linear-gradient( top, rgba(83,164,196,1) 5%, rgba(69,128,151,1) 95%);background: linear-gradient( to bottom, rgba(83,164,196,1) 5%, rgba(69,128,151,1) 95%);	/* IE <= 9 doesn't support rounded corners and gradient.  The gradient isn't too noticable so just disable the filter in IE9 */
	filter: none;
}

#admin-table .md-table-row.state1 .admin-avatar-container > img,
#admin-table .md-table-row.state5 .admin-avatar-container > img,
#admin-table .md-table-row.state6 .admin-avatar-container > img {
	background: -webkit-linear-gradient( top, #41778f 5%, #3d697b 95%);background: linear-gradient( to bottom, #41778f 5%, #3d697b 95%);
}

#admin-table .md-table-row.playing > td:nth-child(1) {
	border-left-color:#90ba3c;
}

#admin-table .md-table-row.playing .admin-avatar-container {
	background-color: #90ba3c;
	background: -webkit-linear-gradient( top, rgba(143,185,59,1) 5%, rgba(110,140,49,1) 95%);background: linear-gradient( to bottom, rgba(143,185,59,1) 5%, rgba(110,140,49,1) 95%);	/* IE <= 9 doesn't support rounded corners and gradient.  The gradient isn't too noticable so just disable the filter in IE9 */
	filter: none;
}

#admin-table .md-table-row.playing .admin-avatar-container > img {
	background: -webkit-linear-gradient( top, #66812e 5%, #59702b 95%);background: linear-gradient( to bottom, #66812e 5%, #59702b 95%);
}

/* 관리자 아바타 */
#admin-table .md-table-row .admin-avatar-container {
	display: inline-block;
    text-align: center;
    width: 36px;
    height: 36px;
    position: relative;
    border-radius: 0;
    padding: 2px 0px;
}

#admin-table .md-table-row .admin-avatar-container > img {
	width: 32px;
    height: 32px;
    padding: 0px;
    border-radius: 2px;
    border: none;
}


/* 서버 아이콘 */
#admin-table .md-table-row > .md-table-cell-servers i.fa {
	font-size:20px;
}
/* 서버 이미지 */
#admin-table .md-table-row > .md-table-cell-servers img {
	width: 24px;
}

#admin-table .admin-name-container {
  font-size:16px;
}

#admin-table .admin-name-alias{
  font-size: 0.75em;
  color:#888;
  margin-left:5px;
}

.ctx-menu .list__tile__title{
  font-size: 1em;
  font-weight: 400;
}

.ctx-menu.list {
  padding:0px;
}
</style>
