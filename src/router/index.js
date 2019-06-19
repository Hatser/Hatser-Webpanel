import Vue from 'vue';
import Router from 'vue-router';
import Header from '@/components/Content-Header';
import HelloWorld from '@/components/HelloWorld';
import AdminTable from '@/components/Pages/Admin-Table';
import ServerTable from '@/components/Pages/Server-Table';
import WebAdminTable from '@/components/Pages/Web-Admin-Table';

Vue.use(Router);

export default new Router({
	mode: 'history',
	routes: [
		{
			path: '/',
			name: 'home',
			components: {header: Header, content:HelloWorld},
			props: {header: true, content: false},
			meta: {
				title: 'Home',
				description: 'We \'r Home'
			}
		},
		{
			path: '/admin',
			name: 'admin',
			components: {header: Header, content:AdminTable},
			props: {header: true, content: false},
			meta: {
				title: 'Admin List',
				description: 'Obey us that have rule over you!!'
			}
		},
		{
			path: '/server',
			name: 'server',
			components: {header: Header, content:ServerTable},
			props: {header: true, content: false},
			meta: {
				title: 'Server List',
				description: 'Hey! do you want some? I mean... nvm.'
			}
    },
    {
			path: '/web/admin',
			name: 'web-admin',
			components: {header: Header, content:WebAdminTable},
			props: {header: true, content: false},
			meta: {
				title: 'Web Management / Web Admin List',
				description: 'Hey! do you want some? I mean... nvm.'
			}
		}
	]
});
