<template>
	<f7-page name="index" :page-content="false">
		<f7-toolbar tabbar labels bottom>
			<f7-link href="/" route-tab-id="home" tab-link="#home" icon-ios="f7:house_fill" icon-aurora="f7:house_fill" icon-md="material:home" :text="$t('pages.home.title')"></f7-link>
			<f7-link href="/categories/" route-tab-id="categories" tab-link="#categories" icon-ios="f7:square_list_fill" icon-aurora="f7:square_list_fill" icon-md="material:view_list" :text="$t('pages.categories.title')"></f7-link>
			<f7-link href="/sources/" route-tab-id="sources" tab-link="#sources" icon-ios="f7:tray_2_fill" icon-aurora="f7:tray_2_fill" icon-md="material:all_inbox" :text="$t('pages.sources.title')"></f7-link>
			<f7-link href="/manager/" route-tab-id="manager" tab-link="#manager" icon-ios="f7:circle_grid_3x3" icon-aurora="f7:circle_grid_3x3" icon-md="material:apps" :text="$t('pages.manager.title')" v-if="cordova"></f7-link>
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
		}
	};
</script>
