// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-core/register';
import 'babel-polyfill';

import Vue from 'vue';
import router from './router';
import store from './store';
import axios from 'axios';
store.dispatch('auth/validate')
import App from './App';

import Vuetify from 'vuetify';
Vue.use(Vuetify);
import('vuetify/dist/vuetify.min.css');

// Request interceptor
//https://github.com/cretueusebiu/laravel-vue-spa
axios.interceptors.request.use(request => {
  const token = store.getters['auth/token']
  if (token) {
    console.log(request.headers.common);
    request.headers.common['Authorization'] = `Bearer ${token}`
  }
/*
  const locale = store.getters['lang/locale']
  if (locale) {
    request.headers.common['Accept-Language'] = locale
  }
*/
  // request.headers['X-Socket-Id'] = Echo.socketId()

  return request
})

// Response interceptor
axios.interceptors.response.use(response => response, error => {
  const { status } = error.response


  /*
  if (status >= 500) {
    swal({
      type: 'error',
      title: i18n.t('error_alert_title'),
      text: i18n.t('error_alert_text'),
      reverseButtons: true,
      confirmButtonText: i18n.t('ok'),
      cancelButtonText: i18n.t('cancel')
    })
  }

  if (status === 401 && store.getters['auth/check']) {
    swal({
      type: 'warning',
      title: i18n.t('token_expired_alert_title'),
      text: i18n.t('token_expired_alert_text'),
      reverseButtons: true,
      confirmButtonText: i18n.t('ok'),
      cancelButtonText: i18n.t('cancel')
    }).then(async () => {
      await store.dispatch('auth/logout')

      router.push({ name: 'login' })
    })
  }*/

  return Promise.reject(error)
})

Vue.prototype.$http = axios;

//Vue.axios.defaults.baseURL = 'https://api-demo.websanova.com/api/v1';

Vue.config.productionTip = false;

/* eslint-disable no-new */
Vue.router = router;

new Vue({
	el: '#app',
	store,
	router,
	template: '<App/>',
	components: { App }
});
/*
	http://demo.ngtemplates.com/admin-material/v1.0.3/index.html#/app/dashboard
	http://designlayout.xyz/consolebox/html/default/#/autocomplete
	https://www.npmjs.com/package/vue-material-components
	https://github.com/PygmySlowLoris/vue-ripple-directive  ??
	https://github.com/gurayyarar/AdminBSBMaterialDesign/tree/master/pages

	https://forum.vuejs.org/t/best-breadcrumb-pattern/905/8
	https://jsfiddle.net/adriaanmeuris/9aur04nv/

  https://github.com/NxtChg/pieces/blob/master/js/vue/vs-crumbs/vs-crumbs.js

  /<(?:\w+)\W+?[\w]/
*/
