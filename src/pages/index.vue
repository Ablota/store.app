<template>
	<f7-page :page-content="false" name="index">
		<f7-toolbar bottom labels tabbar>
			<f7-link
				:text="$t('pages.home.title')"
				href="/"
				icon-aurora="f7:house_fill"
				icon-ios="f7:house_fill"
				icon-md="material:home"
				route-tab-id="home"
				tab-link
			></f7-link>
			<f7-link
				:text="$t('pages.categories.title')"
				href="/categories/"
				icon-aurora="f7:square_list_fill"
				icon-ios="f7:square_list_fill"
				icon-md="material:view_list"
				route-tab-id="categories"
				tab-link
			></f7-link>
			<f7-link
				:text="$t('pages.sources.title')"
				href="/sources/"
				icon-aurora="f7:tray_2_fill"
				icon-ios="f7:tray_2_fill"
				icon-md="material:all_inbox"
				route-tab-id="sources"
				tab-link
			></f7-link>
			<f7-link
				v-if="cordova"
				:text="$t('pages.manager.title')"
				href="/manager/"
				icon-aurora="f7:circle_grid_3x3"
				icon-ios="f7:circle_grid_3x3"
				icon-md="material:apps"
				route-tab-id="manager"
				tab-link
			></f7-link>
		</f7-toolbar>
		<f7-tabs routable>
			<f7-tab id="home"></f7-tab>
			<f7-tab id="categories"></f7-tab>
			<f7-tab id="sources"></f7-tab>
			<f7-tab id="manager"></f7-tab>
		</f7-tabs>
	</f7-page>
</template>
<script>
import {Device} from 'framework7';

export default {
	data: function() {
		return {
			cordova: Device.cordova,
		};
	},
	mounted() {
		this.$f7ready(() => {
			if(Device.cordova) {
				setTimeout(() => {
					window.navigator.splashscreen.hide();

					ablota.store.device.info(data => {
						this.$f7.data.deviceInfo = data;
					});
				}, 1000);

				ablota.store.link.handler(data => {
					if(data.event.host === 'store.ablota.com') {
						this.$f7router.navigate(data.event.url.split('/#!')[1]);
					} else if(data.event.host === 'f-droid.org' || data.event.host === 'www.f-droid.org') {
						this.$f7router.navigate(`/sources/${encodeURIComponent('https://f-droid.org/repo')}/apps/${data.event.path.split('/packages/')[1].replace('/', '')}/`);
					} else if(data.event.url.includes('/fdroid/repo') || data.event.url.includes('/fdroid/archive')) {
						this.$f7router.navigate(`/sources/${encodeURIComponent(data.event.url)}/`);
					}
				});
			}
		});
	},
};
</script>
