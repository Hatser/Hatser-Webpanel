<template>
    <v-navigation-drawer width="256" touchless mini-variant-width="66" :mini-variant="viewPortWide?collapsed.wide:collapsed.narrow" permanent class="theme-left-sidebar md-whiteframe-6dp"
        v-bind:class="{ 'collapsed-left-sidebar' : viewPortWide?collapsed.wide:collapsed.narrow,
                        'expanded-left-sidebar'  : viewPortWide?!collapsed.wide:!collapsed.narrow }">
    <slot></slot>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'md-left-sidebar',
  components: {
    // <my-component> 는 상위 템플릿에서만 사용할 수 있습니다.

  },
  props: ['collapsed', 'viewPortWide']
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* =================================================================================
left-sidebar
================================================================================= */
/* sidebar general style */
.md-divider {
    display: block;
    border-top-width: 1px;
    border-top-style: solid;
    margin: 0;
    border-top-color: rgba(0,0,0,0.12);
    clear:both;
}
.theme-left-sidebar {
    position:fixed;
    width: 256px;
    height: 100%;
    overflow: hidden;
    z-index: 90;
    display: block;
    left:0px;
    top: 0px;
    bottom: 0px;
    height: calc(100% - 48px) !important;
    margin-top: 48px !important;
    -webkit-transition: width .3s cubic-bezier(0, 0, 0.2, 1), transform .3s cubic-bezier(0, 0, 0.2, 1);
    transition: width .3s cubic-bezier(0, 0, 0.2, 1), transform .3s cubic-bezier(0, 0, 0.2, 1);
    white-space: nowrap;
    overflow-y: auto;
    overflow-x: hidden;
}

.theme-left-sidebar, .theme-right-sidebar, footer.page-footer, .theme-search, .theme-search>input.theme-search-input {
    background-color: #fafafa;
}

/* logo for mobile and tablet */

.theme-left-sidebar .theme-mobile-logo-container {
    text-align: center;
}

.theme-mobile-logo-container .theme-mobile-logo {
    text-decoration: none;
    font-size: 1.4rem;
}


/* sidebar body */

.theme-left-sidebar .theme-left-sidebar-body {
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(100% - 50px);
}
/*
.collapsed-sidebar {
    width: 100%;
    cursor: pointer;
    float: right;
}*/

.collapsed-sidebar .material-icons {
    line-height: 50px;
    font-size: 35px;
    margin: 0px;
    cursor: pointer;
    width: 66px;
    padding: 0px;
    text-align: center;
}


/* sidebar footer */

.theme-left-sidebar .theme-left-sidebar-footer {
    bottom: 0;
    position: relative;
    height: 50px;
    line-height: 50px;
    z-index: 1;
}


/* subscription plan */

.theme-left-sidebar-body .subscription-plan {
    padding: 5px 0px;
}

.subscription-plan .current-plan {
    font-weight: 600;
}

.subscription-plan .price {
    font-size: 12px;
    line-height: 23px;
}

.subscription-plan .upgrade-plan {
    padding: 0px 20px;
}


/* left sidebar menu */

.theme-left-sidebar ul.theme-left-sidebar-menu {
    list-style-type: none;
    padding-left: 0px;
    margin-top: 0px;
}

.theme-left-sidebar-menu .navigation {
    font-size: 13px;
    width: 66px;
    text-align: center;
    line-height: 2rem;
}

.theme-left-sidebar-menu>li>a {
    cursor: pointer;
    text-decoration: none;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
}

.theme-left-sidebar-menu>li>a>.material-icons.left-icon {
    vertical-align: middle;
    font-size: 20px;
    line-height: 20px;
    width: 50px;
    text-align: center;
    padding: 10px 0;
    float: left;
}

.theme-left-sidebar-menu>li>a>span {
    vertical-align: middle;
    float: left;
    height: 40px;
    line-height: 40px;
}

.theme-left-sidebar-menu>li>md-menu {
    display: inline-block;
}

md-tooltip.hide-collapsed-ls-tooltip,
md-tooltip.show-collapsed-ls-tooltip {
    display: none !important;
}


/* side menu */

.right-icon {
    float: right;
    vertical-align: middle;
    height: 40px;
    line-height: 40px;
    margin-right: 10px;
}

.side-menu-label-body {
    list-style-type: none;
    padding-left: 0px;
    display: none;
}

.side-menu-label-body>li>a {
    padding-left: 55px;
    cursor: pointer;
    text-decoration: none;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 35px;
    line-height: 35px;
    font-size: 15px;
    position: relative;
}

.menu-active .material-icons.right-icon {
    -webkit-transform: rotate(-180deg);
    transform: rotate(-180deg);
}

.side-menu-label.menu-active,
.side-menu-label-1.menu-active1 {
    pointer-events: none;
    cursor: default;
}

.side-menu-label.menu-has-label.menu-active {
    pointer-events: painted;
    cursor: pointer;
}

@media(min-width:960px) {
    /* header */
    ul.theme-toolbar-right {
        margin-right: 10px;
    }
    ul.theme-toolbar-left {
        margin-left: 10px;
    }
    /* left sidebar */
    .collapsed-left-sidebar.theme-left-sidebar {
        width: 66px;
    }
    .collapsed-left-sidebar.theme-left-sidebar-menu>li>a {
        overflow: unset;
    }
    .collapsed-left-sidebar.collapsed-sidebar .material-icons {
        -webkit-transform: rotate(-180deg);
        transform: rotate(-180deg);
    }
    .collapsed-left-sidebar.theme-left-sidebar .subscription-plan,
    .collapsed-left-sidebar.theme-left-sidebar .theme-left-sidebar-menu>li>a>span,
    .collapsed-left-sidebar.theme-left-sidebar .side-menu-label .material-icons.right-icon,
    .collapsed-left-sidebar.theme-left-sidebar .side-menu-label-body {
        display: none !important;
    }
    .collapsed-left-sidebar.theme-left-sidebar .theme-left-sidebar-menu>li>a>.material-icons.left-icon {
        width: 66px;
    }
    .collapsed-left-sidebar.theme-left-sidebar .theme-left-sidebar-menu>li>a>span,
    .collapsed-left-sidebar.theme-left-sidebar-menu>li>a>.material-icons.left-icon {
        float: unset;
    }
    /* collapsed sidebar scrollbar */
    .collapsed-left-sidebar.theme-left-sidebar-body::-webkit-scrollbar {
        width: 8px;
    }
    /* show tooltips for collapsed sidebar */
    md-tooltip.show-collapsed-ls-tooltip {
        display: inline-block !important;
    }
}


/* =================================================================================
Mobile and Tablet
================================================================================= */

@media(max-width:959px) {
    /* left sidebar */
    .theme-left-sidebar {
        -webkit-transform: translate3d(-256px, 0, 0);
        transform: translate3d(-256px, 0, 0);
        height: 100%;
    }
    .theme-left-sidebar,
    .md-virtual-repeat-container.md-autocomplete-suggestions-container {
        z-index: 90; /* 작은 화면에서 다른 인터페이스보다 높게 있을것인지 설정한다 */
    }
    .expanded-left-sidebar.theme-left-sidebar {
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
    }
    /* left sidebar overlay  */
    .md-left-sidebar .theme-left-sidebar-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 92;
    }
    /* header */
    .theme-toolbar .md-toolbar-tools {
        margin-left: 0px;
        width: 100%;
    }
    /* left sidebar body */
    .theme-left-sidebar .theme-left-sidebar-body {
        height: calc(100% - 48px);
    }

    /* Header tooltip hide */
    md-tooltip.tooltip-gt-md {
        display: none !important;
    }
}

.md-whiteframe-6dp {
    box-shadow: 0 3px 5px -1px rgba(0,0,0,.2), 0 6px 10px 0 rgba(0,0,0,.14), 0 1px 18px 0 rgba(0,0,0,.12);
}
</style>
