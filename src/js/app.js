import Vue from 'vue';
import VueI18n from 'vue-i18n';
import Framework7 from 'framework7/framework7-lite.esm.bundle.js';
import Framework7Vue from 'framework7-vue/framework7-vue.esm.bundle.js';
import 'framework7/css/framework7.bundle.css';

import '../css/icons.css';
import '../css/app.scss';

import App from '../components/app.vue';
import i18nMessages from '../i18n';
import store from '../store';

Vue.use(VueI18n);
Framework7.use(Framework7Vue);

const i18n = new VueI18n({
	locale: 'en',
	fallbackLocale: 'en',
	messages: i18nMessages,
	silentTranslationWarn: true,
	missing: () => '',
});

new Vue({
	el: '#app',
	render: h => h(App),
	components: {
		app: App,
	},
	i18n,
	store,
});
