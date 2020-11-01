import {fetchSource, localizeApp} from '../../js/utils';
import { Device } from 'framework7';

const state = () => ({
	loading: false,
	items: [],
});

const getters = {
	getItem: state => id => {
		return state.items.find(item => item.repo.address === id);
	},
	getApps: (state, getters) => (language, sourceId = null) => {
		const sources = sourceId ? [getters.getItem(sourceId)] : state.items;
		const apps = [];

		sources.forEach(item => item.apps.forEach(app => {
			app = localizeApp(app, language);
			app.sourceId = item.repo.address;

			apps.push(app);
		}));

		return apps;
	},
	getApp: state => (sourceId, appId, language) => {
		const source = state.items.find(item => item.repo.address === sourceId);

		if(source) {
			const app = source.apps.find(app => app.packageName === appId);

			if(app) {
				return {
					...localizeApp(app, language),
					sourceId,
				}
			}
		}

		return null;
	},
	getPackages: (state, getters) => (id, sourceId = null) => {
		const sources = sourceId ? [getters.getItem(sourceId)] : state.items;
		const packages = [];

		sources.forEach(item => item.packages[id] && item.packages[id].forEach(appPackage => {
			appPackage.sourceId = item.repo.address;

			packages.push(appPackage);
		}));

		return packages.sort((a ,b) => a.versionCode < b.versionCode ? 1 : -1);
	},
};

const actions = {
	load({commit, dispatch, state}, {server, sourceAge, warningCallback}) {
		commit('setLoading', true);
		commit('setItems', []);

		if(!localStorage.getItem('sources')) {
			localStorage.setItem('sources', JSON.stringify([
				{
					url: 'https://ablota.com/repo/',
					fingerprint: 'ec6836750bcddd67268d00c13e959f03cb7e8709104d3c176870233a34e0b02a',
					system: true,
				},
			]));

			if(Device.cordova) {
				/*ablota.store.package.info('org.fdroid.fdroid', data => {
					if(data.status === 'success') {
						dispatch('add', {
							address: 'https://f-droid.org/repo/',
							fingerprint: '43238d512c1e5eb2d6569f4a3afbf5523418b82e0a3ed1552770abb9a9c9ccab',
							server,
							sourceAge,
						});
					}
				});*/
				ablota.store.package.info('com.x8bit.bitwarden', data => {
					if(data.status === 'success') {
						dispatch('add', {
							address: 'https://mobileapp.bitwarden.com/fdroid/repo/',
							fingerprint: 'bc54ea6fd1cd5175bcccc47c561c5726e1c3ed7e686b6db4b18bac843a3efe6c',
							server,
							sourceAge,
						});
					}
				});
				ablota.store.package.info('com.starapps.ablotahstorepro', data => {
					if(data.status === 'success') {
						dispatch('add', {
							address: 'https://the-hack-store.com/repo/',
							fingerprint: 'd0b9ec81e1435cf13bc9a28768ca9f498db320d54c93c7a9e9db744e4a65e173',
							server,
							sourceAge,
						});
					}
				});
			}
		}

		const sources = JSON.parse(localStorage.getItem('sources'));
		const promises = sources.map(source => fetchSource(source.url, server, sourceAge).then(fetchedSource => {
			if((source.fingerprint && fetchedSource.fingerprint) && source.fingerprint.trim().toLowerCase() !== fetchedSource.fingerprint.trim().toLowerCase()) {
				warningCallback('actions.sources.load.fingerprint', {
					source: source.url,
				});
			} else {
				commit('addItem', {
					...fetchedSource,
					system: source.system,
				});
			}
		}).catch(error => {
			warningCallback(`actions.sources.load.${error}`, {
				source: source.url,
			});
		}));

		Promise.all(promises).then(() => {
			commit('setLoading', false);
		});
	},
	add({commit, state}, {address, fingerprint, server, sourceAge}) {
		return new Promise((resolve, reject) => {
			const saveSource = source => {
				if(state.items.some(item => item.repo.address.trim().toLowerCase() === source.repo.address.trim().toLowerCase())) {
					reject('actions.sources.add.exists');
					return;
				}

				if((fingerprint && source.fingerprint) && fingerprint.trim().toLowerCase() !== source.fingerprint.trim().toLowerCase()) {
					reject('actions.sources.add.fingerprint');
					return;
				}

				const sources = JSON.parse(localStorage.getItem('sources'));
				sources.push({
					id: source.id,
					url: source.url,
					icon: source.icon,
					fingerprint: source.fingerprint,
				});

				localStorage.setItem('sources', JSON.stringify(sources));

				commit('addItem', source);
				resolve(source);
			};

			const url = new URL(address);

			if(!url.pathname.endsWith('/')) {
				url.pathname += '/';
			}

			fetchSource('https://' + url.host + url.pathname, server, sourceAge).then(source => {
				saveSource(source);
			}).catch(() => {
				url.pathname += 'repo/';

				fetchSource('https://' + url.host + url.pathname, server, sourceAge).then(source => {
					saveSource(source);
				}).catch(() => reject('actions.sources.add.incorrect'));
			});
		});
	},
	remove({commit, state}, {fingerprint}) {
		return new Promise(resolve => {
			let sources = JSON.parse(localStorage.getItem('sources'));
			sources = sources.filter(source => source.fingerprint !== fingerprint);

			localStorage.setItem('sources', JSON.stringify(sources));

			commit('removeItem', {fingerprint});

			resolve();
		});
	},
};

const mutations = {
	setLoading(state, loading) {
		state.loading = loading;
	},
	setItems(state, items) {
		state.items = items;
	},
	addItem(state, item) {
		state.items.push(item);
	},
	updateItem(state, {id, item}) {
		const index = state.items.findIndex(item => item.id === id);

		state.items[index] = {
			...state.items[index],
			...item,
		};
	},
	removeItem(state, {fingerprint}) {
		state.items = state.items.filter(item => item.fingerprint !== fingerprint);
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
