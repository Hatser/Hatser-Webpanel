<template>
  <section class="content">
    <slot>
    </slot>
  </section>
</template>

<script>
export default {
  name: 'md-content',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
section.content {
    position: relative;
    display: inline-block;
    margin: 48px auto auto 256px;
    width: calc(100% - 256px);
    height: calc(100% - 48px);
    transition: width .3s cubic-bezier(0, 0, 0.2, 1), margin .3s cubic-bezier(0, 0, 0.2, 1);
}

section.content > .content-body {
    position:absolute;
    width:100%;
}

@media(min-width:960px) {
    /* page body and footer */
    .collapsed-left-sidebar ~ section.content,
    .collapsed-left-sidebar ~ footer.page-footer {
        margin-left: 66px;
    }
    section.content {
        margin: 48px auto auto 256px;
        width: calc(100% - 256px);
    }
    .collapsed-left-sidebar ~ section.content {
        margin: 48px auto auto 66px;
        width: calc(100% - 66px);
    }
}

/* =================================================================================
Mobile and Tablet
================================================================================= */
@media(max-width:959px) {
    /* page body */
    section.content {
        margin: 48px auto auto 66px;
        width: calc(100% - 66px);
    }
    .expanded-left-sidebar ~ section.content {
        margin: 48px auto auto 256px;
        width: calc(100% - 256px);
    }
    footer.page-footer {
        margin-left: 0px;
    }
}
</style>
