import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import sources from './modules/sources';
import settings from './modules/settings';

Vue.use(Vuex);

export default new Vuex.Store({
	actions,
	modules: {
		sources,
		settings,
	},
	strict: process.env.NODE_ENV !== 'production',
});
