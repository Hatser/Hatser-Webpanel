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
        id="web-admin-table"
      >
      <template slot="items" slot-scope="{ item }">
        <tr class="md-table-row" @contextmenu.prevent="showCtxMenu($event, item)">
          <td class="text-xs-left"><img v-bind:src="item.avatar" class="user-image"></td>
          <td class="text-xs-left admin-name-container"><span v-text="item.personaname"></span><span class="admin-name-alias" v-if="item.alias && item.alias !== ''" v-text="'('+item.alias+')'"></span></td>
          <td class="text-xs-center md-table-cell-servers">
            <v-chip v-for="role in item.roles" :key="role" v-text="roleList[role].name" disabled class="role-chip"></v-chip>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
  <v-dialog v-if="$store.getters['auth/user'] && $store.getters['auth/user'].user.webPermissions && $store.getters['auth/user'].user.webPermissions.includes('WEB_ADM_PERM_WEB_ADMIN')" v-model="regDialog" scrollable persistent max-width="700px">
    <page-web-admin-register @close-dialog="regDialog = false" @action-finish="activeSnackbar" :adminData="adminData" ref="registerDialog"></page-web-admin-register>
  </v-dialog>
  <v-dialog v-if="$store.getters['auth/user'] && $store.getters['auth/user'].user.webPermissions && $store.getters['auth/user'].user.webPermissions.includes('WEB_ADM_PERM_WEB_ADMIN')" v-model="delDialog" persistent  max-width="700px">
    <confirm-box @close-dialog="delDialog = false" @action-finish="activeSnackbar" :type="'admin'" ref="deleteDialog"></confirm-box>
  </v-dialog>
  <v-tooltip top v-if="$store.getters['auth/user'] && $store.getters['auth/user'].user.webPermissions && $store.getters['auth/user'].user.webPermissions.includes('WEB_ADM_PERM_WEB_ADMIN')">
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

import WebAdminRegister from './Web-Admin-Register';
import ConfirmBox from './Confirm';
export default {
    name: 'web-admin-table',
    components: { 'page-web-admin-register': WebAdminRegister,
                  'confirm-box': ConfirmBox },
    data () {
        return {
            search: '',
            searched: [],
            roleList: [],
            permissionList: [],
            adminData: [],
            currentSort: 'personaname',
            currentSortOrder: 'asc',
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
                { text: 'Roles', align: 'center', value: 'admindata.permServerCount' },
            ],
        }
    },
    methods: {
        loadData: function () {
            if(!this.regDialog) {
                // TODO: 주소 바꾸기
                this.$http.get('/api/web/admin/list')
                .then((response) => {
                  this.roleList = response.data.roleList;
                  this.permissionList = response.data.permissionList;
                  this.adminData = response.data.adminData;
                  if(!this.search || this.search === '') {
                      this.searched = this.adminData;
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
            this.searched = searchByName(this.adminData, this.search);
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
        getAdminPermissionList: function(roles) {
          var permissions = [];
          roles.forEach((role) => {
            this.roleList[role].permissions.forEach((e) => {
              if(!permissions.includes(e)) {
                permissions.push(e);
              }
            });
          });

          return permissions;
        }
    },
    mounted: function () {
        this.loadData()
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

#web-admin-table .user-image {
  vertical-align: middle;
}

#web-admin-table .admin-name-alias{
  font-size: 0.75em;
  color:#888;
  margin-left:5px;
}


#web-admin-table .role-chip{
  padding:4px;
}

.ctx-menu .list__tile__title{
  font-size: 1em;
  font-weight: 400;
}

.ctx-menu.list {
  padding:0px;
}
</style>
