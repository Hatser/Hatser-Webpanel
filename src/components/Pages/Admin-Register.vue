<template>
  <div class="admin-register-form">
    <v-card>
      <v-card-title>
        <span class="headline">Register Administrator</span>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text style="height: 70vh;overflow-y:auto;">
        <v-layout row wrap>
          <v-flex xs12 md3>
            <v-subheader>STEAM ID</v-subheader>
          </v-flex>
          <v-flex xs12 md9 id="search-steamid">
            <v-text-field
              name="admin-steamid"
              label="Steam unique ID or profile link"
              :hint="steamIdWarningMsg"
              v-model="steamId"
              :class="{'md-invalid':isSteamIdInvalid,
                      'md-valid-not-correct':isSteamIdValidButNeedMore,
                      'md-valid':isSteamIdValid,
                      'user-found':userInfo.steamid}"
              @input="verifySteamIdFormat" @keyup.13="searchSteamUser"
              :append-icon="editAction ? null:userInfo.steamid?'clear':'search'"
              :append-icon-cb="editAction ? null : userInfo.steamid?clearUserData:searchSteamUser"
              :disabled="!!userInfo.steamid || editAction"
            ></v-text-field>
            <transition name="slide-fade">
              <div id="admin-user-info" v-show="userInfo.steamid">
                <img :src="userInfo.avatar" id="user-image" alt="User Image">
                <a id="user-profile-link" target="_blank" :href="'https://steamcommunity.com/profiles/'+userInfo.steamid"><span id="user-nickname" v-text="userInfo.personaname"></span></a>
              </div>
            </transition>
          </v-flex>

          <v-flex xs12 md3>
            <v-subheader>Alias</v-subheader>
          </v-flex>
          <v-flex xs12 md9 id="admin-alias">
            <v-text-field
              name="admin-alias"
              label="Admin alias"
              v-model="alias"
              :disabled="!userInfo.steamid"
            ></v-text-field>
          </v-flex>

          <v-flex xs12 md3>
            <v-subheader>Server</v-subheader>
          </v-flex>
          <v-flex xs12 md9 id="admin-server">
            <v-select
              label="Select"
              v-bind:items="serverList"
              v-model="selectedServer"
              single-line
              :disabled="!userInfo.steamid"
              hint="text!"
              persistent-hint
              :class="{'hint-all-server-assigned':isAllServerOverrideAssigned}"
            >
              <template slot="selection" slot-scope="data">
                <v-avatar tile>
                  <template v-if="data.item.id === 0">
                    <i class="material-icons" aria-hidden style="font-size:43px">select_all</i>
                  </template>
                  <template v-else>
                    <!-- TODO: 주소 바꾸기 -->
                    <img v-if="data.item.icon.icon_type == 'image'" :src="'/api/images/servers/icons/'+data.item.icon.icon_content"/>
                    <v-icon v-if="data.item.icon.icon_type == 'font'" v-text="data.item.icon.icon_content"></v-icon>
                  </template>
                </v-avatar>
                <span v-text="data.item.displayname"></span>
              </template>
              <template slot="item" slot-scope="data">
                <v-list-tile-avatar tile class="admin-server-list-select-item">
                  <template v-if="data.item.id === 0">
                    <i class="material-icons" aria-hidden style="font-size:50px">select_all</i>
                  </template>
                  <template v-else>
                    <!-- TODO: 주소 바꾸기 -->
                    <img v-if="data.item.icon.icon_type == 'image'" :src="'/api/images/servers/icons/'+data.item.icon.icon_content"/>
                    <v-icon v-if="data.item.icon.icon_type == 'font'" v-text="data.item.icon.icon_content"></v-icon>
                  </template>
                </v-list-tile-avatar>
                <v-list-tile-content class="admin-server-list-select-item">
                  <v-list-tile-title v-text="data.item.displayname"></v-list-tile-title>
                </v-list-tile-content>
                <v-list-tile-action v-show="selectedServer && selectedServer.id === data.item.id?flags.length>0:permissions?permissions[data.item.id].flags!=='':false">
                    <v-icon color="error">priority_high</v-icon>
                </v-list-tile-action>
              </template>
            </v-select>
          </v-flex>
          <v-flex xs12 md3>
            <v-subheader>Flags</v-subheader>
          </v-flex>
          <v-flex xs12 md9>
            <v-layout row wrap id="admin-permissions-flags">
              <v-flex xs12 sm6>
                <v-checkbox label="Root" v-model="flags" value="z" @change="onRootFlagChange" :disabled="!selectedServer"></v-checkbox>
              </v-flex>

              <v-flex xs12 sm6>
                <v-checkbox label="Reservation" v-model="flags" value="a" :disabled="checkShouldDisableFlagBoxes"></v-checkbox>
              </v-flex>

              <v-flex xs12 sm6>
                <v-checkbox label="Generic" v-model="flags" value="b" :disabled="checkShouldDisableFlagBoxes"></v-checkbox>
              </v-flex>

              <v-flex xs12 sm6>
                <v-checkbox label="Kick" v-model="flags" value="c" :disabled="checkShouldDisableFlagBoxes"></v-checkbox>
              </v-flex>

              <v-flex xs12 sm6>
                <v-checkbox label="Ban" v-model="flags" value="d" :disabled="checkShouldDisableFlagBoxes"></v-checkbox>
              </v-flex>

              <v-flex xs12 sm6>
                <v-checkbox label="Unban" v-model="flags" value="e" :disabled="checkShouldDisableFlagBoxes"></v-checkbox>
              </v-flex>

              <v-flex xs12 sm6>
                <v-checkbox label="Slay" v-model="flags" value="f" :disabled="checkShouldDisableFlagBoxes"></v-checkbox>
              </v-flex>

              <v-flex xs12 sm6>
                <v-checkbox label="Change Map" v-model="flags" value="g" :disabled="checkShouldDisableFlagBoxes"></v-checkbox>
              </v-flex>

              <v-flex xs12 sm6>
                <v-checkbox label="Convar" v-model="flags" value="h" :disabled="checkShouldDisableFlagBoxes"></v-checkbox>
              </v-flex>

              <v-flex xs12 sm6>
                <v-checkbox label="Config" v-model="flags" value="i" :disabled="checkShouldDisableFlagBoxes"></v-checkbox>
              </v-flex>

              <v-flex xs12 sm6>
                <v-checkbox label="Chat" v-model="flags" value="j" :disabled="checkShouldDisableFlagBoxes"></v-checkbox>
              </v-flex>

              <v-flex xs12 sm6>
                <v-checkbox label="Vote" v-model="flags" value="k" :disabled="checkShouldDisableFlagBoxes"></v-checkbox>
              </v-flex>

              <v-flex xs12 sm6>
                <v-checkbox label="Password" v-model="flags" value="l" :disabled="checkShouldDisableFlagBoxes"></v-checkbox>
              </v-flex>

              <v-flex xs12 sm6>
                <v-checkbox label="Rcon" v-model="flags" value="m" :disabled="checkShouldDisableFlagBoxes"></v-checkbox>
              </v-flex>

              <v-flex xs12 sm12>
                <v-checkbox label="Cheats" v-model="flags" value="n" :disabled="checkShouldDisableFlagBoxes"></v-checkbox>
              </v-flex>

              <v-flex xs12 sm6>
                <v-checkbox label="Custom 1" v-model="flags" value="o" :disabled="checkShouldDisableFlagBoxes"></v-checkbox>
              </v-flex>

              <v-flex xs12 sm6>
                <v-checkbox label="Custom 2" v-model="flags" value="p" :disabled="checkShouldDisableFlagBoxes"></v-checkbox>
              </v-flex>

              <v-flex xs12 sm6>
                <v-checkbox label="Custom 3" v-model="flags" value="q" :disabled="checkShouldDisableFlagBoxes"></v-checkbox>
              </v-flex>

              <v-flex xs12 sm6>
                <v-checkbox label="Custom 4" v-model="flags" value="r" :disabled="checkShouldDisableFlagBoxes"></v-checkbox>
              </v-flex>

              <v-flex xs12 sm6>
                <v-checkbox label="Custom 5" v-model="flags" value="s" :disabled="checkShouldDisableFlagBoxes"></v-checkbox>
              </v-flex>

              <v-flex xs12 sm6>
                <v-checkbox label="Custom 6" v-model="flags" value="t" :disabled="checkShouldDisableFlagBoxes"></v-checkbox>
              </v-flex>
            </v-layout>
          </v-flex>

            <v-flex xs12 md2>
              <v-subheader>Immunity</v-subheader>
            </v-flex>
            <v-flex xs11 md9 id="admin-immunity">
              <v-slider :min="0" :max="99" v-model="immunity" :disabled="!selectedServer" hint="text!" persistent-hint :class="{'no-flag-assigned':flags.length <= 0 && immunity > 0}"></v-slider>
            </v-flex>
            <v-flex xs1 md1>
              <v-text-field :min="0" :max="99" type="number" v-model="immunity" :disabled="!selectedServer"></v-text-field>
            </v-flex>
           <!-- </div>
          </div> -->
        </v-layout>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="error" @click.native="closeDialog">Close</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click.native="applyAdminData" :disabled="!userInfo.steamid || !selectedServer">Save</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'admin-register',
  props: ['serverData'],
  data () {
    return {
      steamId: '',
      alias: '',
      userInfo: {avatar:''},
      isSteamIdInvalid: false,
      isSteamIdValidButNeedMore:false,
      isSteamIdValid:false,
      steamIdWarningMsg: '',
      flags: [],
      immunity: 0,
      permissions: null,
      selectedServer: null,
      editAction: false
    }
  },
  methods: {
    searchSteamUser: function(){
        // 공백을 제거한다
        this.steamId = this.steamId.replace(/\s/g, '');
        // 주소 등을 입력하였을 때 아이디 부분만 얻어내기 위함
        if(checkSteamCommunityUrl(this.steamId)) {
          var regexResult;
          regexResult = this.steamId.match(/\/(profiles|id)\/[a-zA-Z0-9]+/);
          if(regexResult){
            this.steamId = regexResult[0].split('/')[2];
          }
        }
        // TODO: 주소 바꾸기
        this.$http.get('/api/user/search/' + this.steamId)
            .then((response) => {
              if(!response.data.error) {
                this.userInfo = response.data
                this.alias = this.userInfo.admindata.alias
                for(let server in this.permissions) {
                  if(this.userInfo.admindata.permissions && this.userInfo.admindata.permissions[server]) { // 이미 적용된 서버가 있다면
                    this.permissions[server] = this.userInfo.admindata.permissions[server];
                  }
                }
                this.setSearchBarSuccess('user found!'/*tMsg[0].user_found_hint*/)
              } else {
                this.setSearchBarError(response.data.error/*tMsg[0].steamid_check_hint2*/);
              }
            }).catch((err) => {
                this.setSearchBarError('error!'/*tMsg[0].steamid_check_hint2*/);
            })
    },
    applyAdminData: function() {
      if(this.userInfo.steamid) {
        if(this.flags.includes('z')){
          this.permissions[this.selectedServer.id].flags = 'z'
        } else {
          this.permissions[this.selectedServer.id].flags = this.flags.sort().join('')
        }
        this.permissions[this.selectedServer.id].immunity = this.immunity

        this.flags = []
        this.immunity = 0
        this.$http.post('/api/admin/user/register/'+this.userInfo.steamid, {
          alias: this.alias,
          permissions: this.permissions
        })
        .then( response => {
          this.$emit('action-finish', response.data.message, response.data.error?'error':'success')
          this.$emit('close-dialog')
        })
        .catch( response => { console.log(response) } );
      }
    },
    verifySteamIdFormat: function() {
      if(this.steamId == '') {
        this.resetSearchBarState();
      } else {
        var result;
        if(    !(result = checkSteamId2(this.steamId))){
          if(  !(result = checkSteamId3(this.steamId))){
            if(!(result = checkSteamId64(this.steamId))){
              if(result = checkSteamCommunityUrl(this.steamId)){
                result.level = 2;
              }
            }
          }
        }
        if(result){
          if(result.level == 2){ // 정확히 규칙과 일치하는 경우
            this.setSearchBarSuccess('correct!'/*tMsg[0].steamid_check_hint2*/);
          }
          else if(result.level == 1) { // 일부만 맞을 경우
            this.setSearchBarWarning('correct a bit!'/*tMsg[0].steamid_check_hint1*/);
          }
        }
      }
    },
    clearUserData: function() {
      this.steamId = '';
      this.userInfo = {avatar:''}
      this.alias = ''
      this.initPermissions()
      this.selectedServer = null
      this.resetSearchBarState()
    },
    resetSearchBarState: function(){
      this.isSteamIdInvalid = false
      this.isSteamIdValidButNeedMore = false
      this.isSteamIdValid = false
      this.steamIdWarningMsg = ''
    },
    setSearchBarSuccess: function(msg){
      this.isSteamIdInvalid = false
      this.isSteamIdValidButNeedMore = false
      this.isSteamIdValid = true
      this.steamIdWarningMsg = msg
    },
    setSearchBarWarning: function(msg){
      this.isSteamIdInvalid = false
      this.isSteamIdValidButNeedMore = true
      this.isSteamIdValid = false
      this.steamIdWarningMsg = msg
    },
    setSearchBarError: function(msg){
      this.isSteamIdInvalid = true
      this.isSteamIdValidButNeedMore = false
      this.isSteamIdValid = false
      this.steamIdWarningMsg = msg
    },
    closeDialog: function(){
      this.clearUserData()
      this.$emit('close-dialog')
    },
    initPermissions: function(){
      if(this.serverData) {
        this.permissions = {};
        for(let i=0;i<this.serverList.length;i++){
          this.permissions[this.serverList[i].id] = {server:this.serverList[i].id, flags:'', immunity:0}
        }
      }
    },
    onRootFlagChange: function(value) {
      if(this.flags.includes('z')) {
        this.flags = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'z']
      } else {
        this.flags = []
      }
    }
  },
  computed: {
    serverList: function(){
      return [{
                displayname:'모든 서버',
                id:0
              }].concat(Object.values(this.serverData))
    },
    isAllServerOverrideAssigned: function() {
      return this.selectedServer && this.permissions && this.permissions[0].flags !== '' && this.selectedServer.id !== 0
    },
    checkShouldDisableFlagBoxes: function() {
      return !this.selectedServer || this.flags.includes('z')
    }
  },
  mounted: function() {
    this.$nextTick(function() {
    	this.initPermissions();
    });
  },
  watch: {
    serverList: function(newVal, oldVal) {
      if(newVal.length !== oldVal.length){
        let length = Math.max(oldVal.length, newVal.length);
        for(let i=0;i<length;i++) {
          if(!oldVal[i] && newVal[i]) // 없다가 생김
            this.permissions[newVal[i].id] = {server:newVal[i].id, flags:'', immunity:0}
          else if(oldVal[i] && !newVal[i]) // 있다가 없어짐
            delete this.permissions[oldVal[i].id]
        }
      }
    },
    selectedServer: function(newVal, oldVal) { // 다른 서버를 선택했을 때
      if(this.permissions){
        if(oldVal) {
          if(this.flags.includes('z')){ // Root 권한을 선택했다면
            this.permissions[oldVal.id].flags = 'z' // root만 남기고 적용
          } else { // Root가 없다면
            this.permissions[oldVal.id].flags = this.flags.sort().join('') // 다른 권한들을 모두 적용
          }
          this.permissions[oldVal.id].immunity = this.immunity
        }
        if(newVal){
          if(this.permissions[newVal.id].flags === 'z') // 선택한 서버에 이전에 루트 권한이 선택되었었다면
            this.flags = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'z'] // 모두 선택한다.
          else // 그게 아니라면 권한들을 다시 적용시켜 보여준다
            this.flags = this.permissions[newVal.id].flags.split('');

          this.immunity = this.permissions[newVal.id].immunity;
        }
      }
    }
  }
}
function checkSteamId2(Id) {
	var result, level;
	if(result = Id.match(/(STEAM)_?([0-5]:)?([01]:)?(\d+)?/))
	{
		level = 1;
		if(result = Id.match(/^STEAM_[0-5]:[01]:\d+$/))
		{
			level = 2;
		}
		return {'level':level, 'result':result};
	}
	return null;
}
function checkSteamId3(Id) {
	var result, level;
	if(result = Id.match(/^\[?U:(1:)?([0-9]+)?\]?$/))
	{
		level = 1;
		if(result = Id.match(/^\[?U:1:[0-9]+\]?$/))
		{
			level = 2;
		}
		return {'level':level, 'result':result};
	}
	return null;
}
function checkSteamId64(Id) {
	var result, level;
	if(result = Id.match(/^[0-9]+$/))
	{
		level = 1;
		if(result = Id.match(/^[0-9]{17}$/))
		{
			level = 2;
		}
		return {'level':level, 'result':result};
	}
	return null;
}
function checkSteamCommunityUrl(Id) {
	// /(?:https?:\/\/)?steamcommunity\.com\/(?:profiles|id)\/[a-zA-Z0-9]+/;
	var reId = /(?:https?:\/\/)?steamcommunity\.com\/(profiles|id)\/[a-zA-Z0-9]+/;
	return Id.match(reId);
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.admin-register-form {
  background-color: #fff;
}

#search-steamid {
  position: relative;
}

#admin-user-info {
  position: absolute;
  top: 15px;
  width: 100%;
  /* pointer-events: none; */
}

#user-profile-link {
  position: relative;
  bottom: 10px;
  width: max-content;
  left: 10px;
  text-align: left;
}

#search-steamid .input-group.md-invalid .input-group__details:before,
#search-steamid .input-group.md-invalid .input-group__details:after{
    background-color: #ff1744;
}

#search-steamid .input-group.md-invalid .input-group__details .input-group__messages,
#search-steamid .input-group.md-invalid .input-group__input i.material-icons.icon,
#search-steamid .input-group.md-invalid label {
    color: #ff1744;
}

#search-steamid .input-group.md-valid-not-correct .input-group__details:before,
#search-steamid .input-group.md-valid-not-correct .input-group__details:after{
    background-color: #f39c12;
}

#search-steamid .input-group.md-valid-not-correct .input-group__details .input-group__messages,
#search-steamid .input-group.md-valid-not-correct .input-group__input i.material-icons.icon,
#search-steamid .input-group.md-valid-not-correct label {
    color: #f39c12;
}

#search-steamid .input-group.md-valid .input-group__details:before,
#search-steamid .input-group.md-valid .input-group__details:after{
    background-color: #00a65a;
}

#search-steamid .input-group.md-valid .input-group__details .input-group__messages,
#search-steamid .input-group.md-valid .input-group__input i.material-icons.icon,
#search-steamid .input-group.md-valid label {
    color: #00a65a;
}

#search-steamid .input-group .input-group__input input {
  opacity: 1;
  transition: opacity .25s ease-out;
}

#search-steamid .input-group.user-found .input-group__input input {
  opacity: 0;
  transition: opacity .25s ease-in;
}

#admin-server .input-group .input-group__details .input-group__messages .input-group__hint,
#admin-immunity .input-group .input-group__details .input-group__messages .input-group__hint {
  transform: translateY(-20px);
}

#admin-server .input-group.hint-all-server-assigned .input-group__details .input-group__messages .input-group__hint,
#admin-immunity .input-group.no-flag-assigned .input-group__details .input-group__messages .input-group__hint {
  transform: translateY(0px);
  color: #ff1744;
}

#search-steamid .icon--disabled.input-group__append-icon.input-group__icon-cb {
  cursor: pointer;
  z-index:9;
}

#admin-permissions-flags {

  margin-top: 15px;
}

#admin-register-form .application .theme--light.list .list__tile:not(.list__tile--active),
#admin-register-form .theme--light .list .list__tile:not(.list__tile--active) {
  color:#2c3e50 !important;
}

#admin-register-form .subheader {
  padding:0px;
}

.admin-server-list-select-item {
  color:#2c3e50 !important;
}

/*
#admin-permissions-flags .input-group--disabled {
  color: #888;
} */

.slide-fade-enter-active {
  transition: all .25s ease-in;
}
.slide-fade-leave-active {
  transition: all .25s ease-out;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(-40px);
  opacity: 0;
}



</style>
