<template>
  <div class="left-sidebar-user-info">
    <div v-if="$store.getters['auth/authenticated']" class="user-panel">
      <v-avatar size="50">
        <img v-bind:src="$store.getters['auth/user'].user.avatarmedium" class="user-image user-image-md img-circle" alt="User Image">
      </v-avatar>
      <div class="user-info" :class="stateClass">
        <span class="user-name" v-text="$store.getters['auth/user'].user.personaname"></span>
        <span class="user-state"><i class="fa fa-circle"></i><span class="user-state-text" v-text="stateString[$store.getters['auth/user'].user.personastate]"></span></span>
      </div>
    </div>
    <a v-else class="signin" href="auth/steam" style="z-index:999">
      <v-btn ripple block class="btn btn-block btn-social btn-steam btn-signin">
        <v-list-tile-action>
          <v-icon class="btn-signin-icon">fab fa-steam-symbol</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <span class="btn-signin-text">web.sign_in_through_steam</span>
        </v-list-tile-content>
      </v-btn>
    </a>
  </div>
</template>

<script>
export default {
  name: 'md-user-info',
  data () {
    return {
      userInfo: {},
      stateString: ['web.offline', 'web.online', 'web.busy', 'web.away', 'web.snooze', 'web.looking_to_trade', 'web.looking_to_play']
    }
  },
  computed: {
    stateClass: function() {
      if(this.$store.getters['auth/user']) {
        if(this.$store.getters['auth/user'].user.gameid && this.$store.getters['auth/user'].user.gameid > 0) {
              return 'playing';
          }
          return 'state'+this.$store.getters['auth/user'].user.personastate;
      }
      return ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.user-avatar {
  padding:0px !important;
}
.btn-signin {
	border-radius: 0px;
  margin:0px;
  width:100%;
  height: 3.8em;
}

.expanded-left-sidebar .btn-signin .list__tile__action,
.expanded-left-sidebar .btn-signin .list__tile__avatar {
    min-width: 40px;
}

.signin span{
	font-size: 16px;
	font-weight: bold;
  vertical-align: super;
  color: #ffffff !important;
  text-decoration: none;
  text-transform: initial !important;
}

.signin:hover{
  text-decoration: none;
}

.left-sidebar-user-info .signin {
	line-height: 17px !important;
	text-align: right;
  display: flex;
}

.left-sidebar-user-info .signin{
	text-align: center;
}

.left-sidebar-user-info .signin .fab{
	line-height: 50px;
  font-size:2em;
  color: #ffffff !important;
  transition: all 150ms cubic-bezier(0, 0, 0.2, 1);
}

.collapsed-left-sidebar .left-sidebar-user-info .signin{
  overflow: visible;
}

.collapsed-left-sidebar .left-sidebar-user-info > li:hover > a.signin > span:not(.pull-right){
  top:-1px;
  height:48px;
  padding-left: 5px;
}

.collapsed-left-sidebar .left-sidebar-user-info .signin .fab{
  width: 100%;
  border-right:0;
  font-size:2.8em;
}

.collapsed-left-sidebar .left-sidebar-user-info .signin{
	height: 48px;
}

.btn-steam {
  transition: all 150ms cubic-bezier(0, 0, 0.2, 1);
  color: #ffffff !important;
  background-color: #71A031 !important;
  border-color: rgba(0, 0, 0, 0.2) !important;
}
.btn-steam:focus,
.btn-steam.focus {
  color: #ffffff !important;
  background-color: #4A6A20 !important;
  border-color: rgba(0, 0, 0, 0.2) !important;
}
.btn-steam:hover {
  color: #ffffff !important;
  background-color: #4A6A20 !important;
  border-color: rgba(0, 0, 0, 0.2) !important;
}
.btn-steam:active,
.btn-steam.active,
.open > .dropdown-toggle.btn-steam {
  color: #ffffff !important;
  background-color: #4A6A20 !important;
  border-color: rgba(0, 0, 0, 0.2) !important;
}

.btn-steam:active,
.btn-steam.active,
.open > .dropdown-toggle.btn-steam {
  background-image: none !important;
}
.btn-steam .badge {
  color: #71A031 !important;
  background-color: #ffffff !important;
}

.user-panel {
  padding: 8px;
  display: flex;
}

.pull-left {
  float: left;
}

.user-info {
  margin-left:15px;
  text-align: left;
}

.user-name {
  display: block;
  font-size: 1.18em;
}

.user-state {
  display: block;
  margin-top: 8px;
  font-size: 12px;
}

.user-image {
  display:inline;
  max-width: none;
}

.user-image-md {
  width: 50px !important;
  height: 50px !important;
}

.img-circle {
  border-radius: 50%;
}

.user-state-text {
  vertical-align: top;
  margin-left: 7px;
  font-size: 12px;
}

.user-info.state0 i {
  color: #898989;
}

.user-info.state2 i,
.user-info.state3 i,
.user-info.state4 i {
  color: #e4ca63;
}

.user-info.state1 i,
.user-info.state5 i,
.user-info.state6 i {
  color: #57cbde;
}

.user-info.playing {
  color: #90ba3c;
}

</style>
