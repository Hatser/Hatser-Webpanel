<template>
  <section class="content-header">
    <transition name="content-header" mode="out-in">
      <h1 class="content-header-title" :key="crumbedTitle" v-text="crumbedTitle"></h1>
    </transition>
    <transition name="content-header" mode="out-in">
      <p class="content-header-description" :key="$route.meta.description" v-text="$route.meta.description || ''"></p>
    </transition>
    <v-breadcrumbs style="float: right;">
      <v-icon slot="divider">chevron_right</v-icon>
      <v-breadcrumbs-item
        v-for="item in crumbs" :key="item.name"
        :disabled="item.disabled"
      >
        <router-link :to="{ path: item.path }">{{ item.name }}</router-link>
      </v-breadcrumbs-item>
    </v-breadcrumbs>
    <div style="clear:both;"></div>
  </section>
</template>

<script>
export default {
  name: 'md-content-header',
  beforeRouteEnter(to,from, next) {
    next(vm => {
      // reset showmessage
      vm.showMessage = false
    })
  },
  data() {
    return {
      showMessage: false,
    }
  },
  props: {
    title: {
      type: String,
      required: false,
      default: 'Default Title'
    },
    description: {
      type: String,
      required: false,
      default: 'Default Description'
    }
  },
  computed: {
    crumbedTitle: function() {
      var title = this.$route.meta.title.match(/(?=\S)[^/]+?(?=\s*(\/|$))/g);
      if(title) title = title[title.length-1];
      else  title = this.$route.meta.title;
      return title;
    },
		crumbs: function()
		{
			var title = (this.root || 'Home');

			var cs = [ { name: title, path: '/'} ]; if(!this.$route) return [];

      var r = (this.$route.path).split('/');
      var m = (this.$route.matched[0].meta.title || '').match(/(?=\S)[^/]+?(?=\s*(\/|$))/g);

			for(var i = 1; i < r.length; i++)
			{
        var name = (m[i-1] || r[i]); if(r[i] == '') continue;

				cs.push({ name: name, path: this.$route.path, disabled: i === r.length-1 });
      }

      if(cs.length === 1)
        cs[0].disabled = true;

			return cs;
		}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.content-header {
  text-align: left;
  margin-left: 20px;
  margin-top:10px;
}

.content-header-title {
  display:inline-block;
  font-size:2rem;
}

.content-header-description {
  display:inline-block;
  font-size:1rem;
  margin-left:10px;
}

.content-header-enter-active, .content-header-leave-active {
  transition: all 150ms cubic-bezier(0, 0, 0.2, 1);
}

.content-header-enter, .content-header-leave-active {
  opacity: 0;
}

.breadcrumbs__item:not(.breadcrumbs__item--disabled) a {
    color: #1867c0;
    text-decoration: none;
}

.application .theme--light.breadcrumbs li.breadcrumbs__divider, .application .theme--light.breadcrumbs li .breadcrumbs__item--disabled, .application .theme--light.breadcrumbs li:last-child .breadcrumbs__item, .theme--light .breadcrumbs li.breadcrumbs__divider, .theme--light .breadcrumbs li .breadcrumbs__item--disabled, .theme--light .breadcrumbs li:last-child .breadcrumbs__item {
    color: rgba(0,0,0,.38) !important;
}
</style>
