<template>
  <v-app id="app">
    <md-header-bar :collapsed="collapsed" :viewPortWide="viewPortWide" v-on:toggledCollapse="toggleCollapse">
      <div class="theme-logo hide-xs hide-sm" slot="logo"
         @click="toggleCollapse" v-text="logoMessage"></div>
    </md-header-bar>
    <md-left-sidebar :collapsed="collapsed" :viewPortWide="viewPortWide">
      <md-user-info></md-user-info>
      <v-divider></v-divider>
      <v-list>
        <template v-for="item in navItems">
          <v-list-tile ripple append exact v-if="!item.items && (!item.needAuthenticated || $store.getters['auth/authenticated']) && (!item.needPerm || ($store.getters['auth/authenticated'] && $store.getters['auth/user'].user.webPermissions.includes(item.needPerm)))" :key="item.text" router :to="typeof item.action !== 'function'?item.action:undefined" @click="typeof item.action === 'function'?item.action():undefined">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="nav-text">{{ item.text }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-list-group ripple append v-if="item.items && (!item.needAuthenticated || $store.getters['auth/authenticated']) && (!item.needPerm || ($store.getters['auth/authenticated'] && $store.getters['auth/user'].user.webPermissions.includes(item.needPerm)))" :key="item.text" no-action>
            <v-list-tile ripple append no-action slot="activator">
              <v-list-tile-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title class="nav-text">{{ item.text }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile ripple append exact v-for="subItem in item.items" v-if="(!subItem.needAuthenticated || $store.getters['auth/authenticated']) && (!subItem.needPerm || ($store.getters['auth/authenticated'] && $store.getters['auth/user'].user.webPermissions.includes(subItem.needPerm)))" :key="subItem.text" :to="typeof subItem.action !== 'function'?subItem.action:undefined" @click="typeof subItem.action === 'function'?subItem.action:undefined" router>
              <v-list-tile-action>
                <v-icon>{{ subItem.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title class="nav-text">{{ subItem.text }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
        </template>
      </v-list>
      <br>
    </md-left-sidebar>
    <md-content>
      <!-- mode out-in -->
      <router-view name="header"></router-view>
      <transition name="content-router" mode="out-in">
        <router-view name="content"></router-view>
      </transition>
    </md-content>

    <page-server-chat ref="chatDialog"></page-server-chat>
  </v-app>
</template>

<script>
import HeaderBar from '@/components/Header-Bar';
import LeftSideBar from '@/components/Left-SideBar';
import Content from '@/components/Content';
import UserInfo from '@/components/Left-SideBar-Comps/User-Info';
import ServerChat from '@/components/Pages/Server-Chat';

export default {
  name: 'app',
  components: {
    // <my-component> 는 상위 템플릿에서만 사용할 수 있습니다.
    'md-header-bar': HeaderBar,
    'md-left-sidebar': LeftSideBar,
    'md-content': Content,
    'md-user-info': UserInfo,
    'page-server-chat': ServerChat
  },
  data: function () {
    return {
      logoMessage: 'BST Manager',
      collapsed: {wide:false, narrow:true},
      viewPortWide: true,
      windowWidth: 0,
      windowHeight: 0,
      chatDialog: false,
      navItems: [
        { text: '메인', icon: 'home', action: { name: 'home' } },
        { text: '서버 채팅', icon: 'chat', action: this.openChatDialog, needAuthenticated: true },
        { text: '서버', icon: 'storage', action: { name: 'server' } },
        { text: '관리자', icon: 'supervisor_account', action: { name: 'admin' } },
        { text: '웹 관리', icon: 'web', needPerm: 'WEB_ADM_PERM_WEB_ADMIN', items:[{text:'웹 관리자', icon: 'gavel', action: {name: 'web-admin'}}]}
      ]
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      window.addEventListener('resize', this.getWindowWidth);
      window.addEventListener('resize', this.getWindowHeight);

      //Init
      this.getWindowWidth();
      this.getWindowHeight();
    });
  },
  methods: {
    openChatDialog(){
      this.$refs.chatDialog.dialog = !this.$refs.chatDialog.dialog
    },
    toggleCollapse () {
      if(this.windowWidth >= 960) {
        this.collapsed.wide = !this.collapsed.wide;

        if(!this.collapsed.wide)
          this.logoMessage = 'BST Manager';
        else
          this.logoMessage = 'BST';
      } else {
        this.collapsed.narrow = !this.collapsed.narrow;

        if(!this.collapsed.narrow)
          this.logoMessage = 'BST Manager';
        else
          this.logoMessage = 'BST';
      }
    },
    getWindowWidth(event) {
      // 원래 좁은 화면이었을 때
      if(this.windowWidth < 960) {
        // 넓은 화면으로 변경되었을 때
        if(document.documentElement.clientWidth >= 960) {
          // 좁은 화면에서 확장된 왼쪽 사이드바를 보고 있었을 경우
          if(this.collapsed.narrow) {
            // 넓은 화면에서도 큰 왼쪽 사이드바를 보도록 한다.
            this.collapsed.wide = false;
          }
        }
      } else { // 원래 넓은 화면이었을 때
        // 좁은 화면으로 변경되었을 때
        if(document.documentElement.clientWidth < 960) {

          if(!this.collapsed.narrow)
            this.logoMessage = 'BST Manager';
          else
            this.logoMessage = 'BST';
        }
      }

      this.windowWidth = document.documentElement.clientWidth;

      if(this.windowWidth >= 960) {
        if(!this.collapsed.wide)
          this.logoMessage = 'BST Manager';
        else
          this.logoMessage = 'BST';

        this.viewPortWide = true;
      } else {
        if(!this.collapsed.narrow)
          this.logoMessage = 'BST Manager';
        else
          this.logoMessage = 'BST';

        this.viewPortWide = false;
      }
    },
    getWindowHeight(event) {
      this.windowHeight = document.documentElement.clientHeight;
    }
  },
  beforeDestroy: function() {
    window.removeEventListener('resize', this.getWindowWidth);
    window.removeEventListener('resize', this.getWindowHeight);
  }
}
</script>
<style>
@import url(./assets/css/source-sans-pro.css);
@import url(./assets/font-awesome/css/fontawesome-all.min.css);
@import url(https://fonts.googleapis.com/icon?family=Material+Icons);

html {
  overflow: hidden !important;
}
a {
  text-decoration: none;
}

#app {
  font-family: 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
  text-decoration: none !important;
  text-decoration-color: none !important;
  text-decoration-style: none !important;
}

.content-router-enter-active, .content-router-leave-active {
  transition: all 250ms cubic-bezier(0, 0, 0.2, 1);
}

.content-router-enter, .content-router-leave-active {
  transform: translateY(20px);
  opacity: 0;
}

.md-theme-default :not(input):not(textarea)::selection {
    background-color: rgba(0,0,0,.5);
    background-color: var(--md-theme-default-accent-on-background, rgba(0,0,0,.5));
    color: #fff;
    color: var(--md-theme-default-text-primary-on-accent, #fff);
}

.breadcrumbs__item.breadcrumbs__item--disabled > a {
  color:#2c3e50;
  text-decoration: none;
}

.list__group:after, .list__group:before {
    left: 0px;
}

.list__group__items--no-action .list__tile {
    padding-left: 16px !important;
}

.list__tile .avatar, .list__tile__action {
    min-width: 48px;
}

.list__tile__title {
  font-size: 1.18em;
  font-weight: bold;
}

.list__tile--active {
  color:#3949ab !important;
}

.navigation-drawer>.list .list__tile {
  transition: padding .3s cubic-bezier(0, 0, 0.2, 1) !important;
  -webkit-transition: padding .3s cubic-bezier(0, 0, 0.2, 1) !important;
}

.navigation-drawer--mini-variant .list__tile,
.navigation-drawer--mini-variant .btn__content {
  padding: 0px 9px !important;
}

.navigation-drawer>.list .list__tile .nav-text {
  color:#2c3e50;
}
</style>
