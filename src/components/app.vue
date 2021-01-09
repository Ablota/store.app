<template>
	<f7-app :params="f7params">
		<f7-views class="safe-areas">
			<f7-view :push-state="pushState" :routes="routes" :stack-pages="true" main url="/"></f7-view>
		</f7-views>
	</f7-app>
</template>
<script>
import {Device} from 'framework7/framework7-lite.esm.bundle.js';
import cordovaApp from '../js/cordova-app.js';
import routes from '../js/routes.js';

export default {
	data() {
		return {
			pushState: !Device.cordova,
			routes,
			f7params: {
				id: 'com.ablota.store',
				name: 'Ablota Store',
				version: '1.0.2',
				theme: 'auto',
				data: function() {
					return {
						url: 'https://store.ablota.com/',
						server: {
							url: 'https://api.store.ablota.com/',
						},
						deviceInfo: null,
					};
				},
				autoDarkTheme: true,
				serviceWorker: Device.cordova ? {} : {
					path: '/service-worker.js',
				},
				input: {
					scrollIntoViewOnFocus: Device.cordova && !Device.electron,
					scrollIntoViewCentered: Device.cordova && !Device.electron,
				},
				statusbar: {
					enabled: false,
				},
				toast: {
					closeButton: true,
					closeButtonText: this.$t('words.ok'),
					closeTimeout: 5000,
					destroyonClose: true,
				},
				dialog: {
					buttonOk: this.$t('words.ok'),
					buttonCancel: this.$t('words.cancel'),
				},
				photoBrowser: {
					routableModals: false,
					type: 'popup',
					pageBackLinkText: this.$t('words.back'),
					popupCloseLinkText: this.$t('words.ok'),
					navbarOfText: this.$t('words.of'),
				},
				lazy: {
					sequential: false,
				},
				touch: {
					tapHold: true,
				},
			},
		};
	},

	mounted() {
		this.$f7ready((f7) => {
			if(Device.cordova) {
				cordovaApp.init(f7);
			}

			this.$store.dispatch('load', {
				server: this.$f7.data.server,
				sourceAge: this.$store.state.settings.sourceAge,
				warningCallback: (error, payload = {}) => this.$f7.dialog.alert(this.$t(error, payload)),
			});
		});
	},
};
</script>
