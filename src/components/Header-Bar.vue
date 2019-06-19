<template>
  <div class="theme-toolbar md-primary md-whiteframe-6dp _md _md-toolbar-transitions"
       v-bind:class="{ 'collapsed-left-sidebar' : viewPortWide?collapsed.wide:collapsed.narrow,
                        'expanded-left-sidebar'  : !collapsed.narrow }">
      <slot name="logo"></slot>
  </div>
</template>

<script>
export default {
  name: 'md-header-bar',
  props: ['collapsed', 'viewPortWide'],
  data: function () {
    return {

    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* =================================================================================
header
================================================================================= */


/* toolbar general style */

.theme-toolbar,
.theme-toolbar .md-toolbar-tools,
ul.theme-toolbar-left,
ul.theme-toolbar-right,
ul.theme-toolbar-left>li,
ul.theme-toolbar-right>li,
ul.theme-toolbar-left a.horz-menu,
ul.theme-toolbar-right a.horz-menu,
ul.theme-toolbar-left a.horz-menu .material-icons,
ul.theme-toolbar-right a.horz-menu .material-icons,
.theme-left-sidebar .theme-mobile-logo-container {
    height: 48px;
    line-height: 48px;
    min-height: 48px;
}

.theme-toolbar,
.theme-toolbar .md-toolbar-tools {
    display: block;
}


/* fixed toolbar */
.theme-toolbar .md-toolbar-tools {
    margin-left: 256px;
    padding: 0px;
    width: calc(100% - 256px);
}


/* theme logo */

.theme-toolbar .theme-logo {
    width: 256px;
    text-align: center;
    font-size: 1.7rem;
    position: absolute;
    display: inline-block;
    white-space: nowrap;
    text-decoration: none;
    color: rgba(255,255,255,0.87);
    text-decoration-color: rgba(255,255,255,0.75);
    -webkit-transition: width .3s cubic-bezier(0, 0, 0.2, 1);
    transition: width .3s cubic-bezier(0, 0, 0.2, 1);
    white-space: nowrap;
    cursor: pointer;
    user-select: none;
}

.collapsed-left-sidebar.theme-toolbar .theme-logo {
    width: 66px;
    content: 'B';
}


/* header menu */

ul.theme-toolbar-left,
ul.theme-toolbar-right {
    padding: 0px;
    margin: 0px;
    list-style-type: none;
}

ul.theme-toolbar-left {
    float: left;
}

ul.theme-toolbar-right {
    float: right;
}

ul.theme-toolbar-left>li,
ul.theme-toolbar-right>li {
    display: inline-block;
    cursor: pointer;
}

ul.theme-toolbar-left .material-icons,
ul.theme-toolbar-right .material-icons {
    font-size: 28px;
    cursor: pointer;
}

ul.theme-toolbar-left>li>md-menu>a,
ul.theme-toolbar-right>li>md-menu>a,
ul.theme-toolbar-left>li>a,
ul.theme-toolbar-right>li>a {
    display: block;
    padding: 0px 12px;
    position: relative;
}


/* notification pulse indicator */

.theme-pulse.noti-pulse {
    position: absolute;
    top: 8px;
    margin-left: 10px;
}


/* apps item */

.theme-apps-item {
    height: auto;
    min-height: auto;
}

.theme-apps-item>a {
    margin: 0 5px;
}

.theme-apps-item>a>span {
    display: block;
}


/* Notification List */

.theme-toolbar.theme-noti-box {
    width: 450px;
}

.theme-toolbar.theme-noti-list:first-child {
    min-height: 40px;
    margin-bottom: 10px;
    line-height: 40px;
}

.theme-toolbar.theme-noti-list {
    margin: 0 15px 20px 15px;
    min-height: 150px;
}

.theme-noti-list .theme-noti-list-item {
    padding-top: 15px;
    padding-bottom: 5px;
}

.theme-noti-list>.theme-noti-list-title {
    font-size: 15px;
    font-weight: 600;
    margin: 0px;
}

.theme-noti-list-item>.noti-list-item-title,
.noti-list-item-action button.md-primary,
.noti-list-item-action a.md-button {
    font-weight: 600;
}

.theme-noti-list-item>.noti-list-item-title,
.theme-noti-list-item>.noti-list-item-desc {
    font-size: 13px;
}

.theme-noti-list-item>.noti-list-item-desc {
    line-height: 20px;
    min-height: 24px;
    margin-top: 5px;
}


/* search */

.theme-search {
    position: fixed;
    left: 0;
    right: 0;
    z-index: 90;
    top: 48px;
    width: 100%;
}

.unfixed-toolbar .theme-search {
    position: absolute;
}

.theme-search,
.theme-search>input.theme-search-input {
    height: 48px;
}

.theme-search>input.theme-search-input {
    width: calc(100% - 40px);
    line-height: 20px;
    outline: none;
    border: 0px;
    padding: 0 20px;
}

.theme-search.theme-search-hide {
    top: 0;
    box-shadow: none;
}

.unfixed-toolbar .theme-search.theme-search-hide {
    top: -48px;
}

.theme-toolbar._md-toolbar-transitions {
    -webkit-transition-duration: .5s;
    transition-duration: .5s;
    -webkit-transition-timing-function: cubic-bezier(.35,0,.25,1);
    transition-timing-function: cubic-bezier(.35,0,.25,1);
    -webkit-transition-property: background-color,fill,color;
    transition-property: background-color,fill,color;
}

.md-whiteframe-6dp {
    box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12);
}
.theme-toolbar {
    position:fixed;
    top:0px;
    left:0px;
    box-sizing: border-box;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
    flex-direction: column;
    z-index: 91;
    font-size: 20px;
/*    min-height: 56px; */
    width: 100%;
    background-color:rgb(57,73,171);
    color:rgba(255,255,255,0.87);
}
@media(max-width:959px) {
    .theme-toolbar .theme-logo {
        width: 66px;
    }

    .expanded-left-sidebar.theme-toolbar .theme-logo {
        width: 256px;
    }
}
</style>
