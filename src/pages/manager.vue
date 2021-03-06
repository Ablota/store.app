<template>
	<f7-page name="manager" @page:beforein="checkApps">
		<f7-navbar large>
			<f7-nav-left>
				<f7-link href="/about/" icon-aurora="f7:menu" icon-ios="f7:menu" icon-md="material:menu"/>
			</f7-nav-left>
			<f7-nav-title>{{ $t('pages.manager.title') }}</f7-nav-title>
			<f7-nav-title-large>{{ $t('pages.manager.title') }}</f7-nav-title-large>
			<f7-nav-right>
				<f7-link href="/sources/apps/search/" icon-aurora="f7:search" icon-ios="f7:search" icon-md="material:search"/>
			</f7-nav-right>
		</f7-navbar>
		<popover-anti-features/>
		<div v-show="!loading && apps.length">
			<div v-show="apps.filter(app => app.packageUpdate).length">
				<f7-block-title>{{ $t('pages.manager.updateAvailable') }} <!--<f7-link class="float-right" :text="$t('pages.manager.updateAll')" @click="() => {}" />--></f7-block-title>
				<f7-list class="list-outdated">
					<ul>
						<f7-list-item
							v-for="(app, index) in apps.filter(app => app.packageUpdate)"
							:key="app.packageName"
							:badge="app.packageSuggestion.versionName"
							:data-icon="app.icon"
							:footer="`${app.packageSuggestion.added.toLocaleDateString()}, ${Math.round(app.packageSuggestion.size / 1024 / 1024 * 10) / 10} MB`"
							:title="app.name"
							accordion-item
							badge-color="blue"
						>
							<img v-if="icons[app.icon]" slot="media" :src="icons[app.icon]" alt="" class="icon-40"/>
							<f7-skeleton-block v-if="app.icon && !icons[app.icon]" slot="media" class="icon-40"></f7-skeleton-block>
							<f7-accordion-content>
								<div v-if="app.whatsNew">
									<f7-block-title>{{ $t('words.whatsNew') }}</f7-block-title>
									<f7-block v-html="app.whatsNew"></f7-block>
								</div>
								<div v-if="app.packageDifferences">
									<div v-if="app.packageDifferences.antiFeatures.length">
										<f7-block-title>{{ $t('words.antiFeatures') }} ({{ $t('words.differences') }})</f7-block-title>
										<f7-block>
											<chip-anti-feature
												v-for="antiFeature in app.packageDifferences.antiFeatures || app.antiFeatures"
												:key="antiFeature"
												:name="antiFeature"
												class="padding-horizontal-half"
											/>
										</f7-block>
									</div>
								</div>
								<f7-block>
									<f7-button :href="`/sources/${encodeURIComponent(app.sourceId)}/apps/${app.packageName}/`" :text="$t('words.update')" fill raised></f7-button>
								</f7-block>
							</f7-accordion-content>
						</f7-list-item>
					</ul>
				</f7-list>
			</div>
			<f7-block-title>{{ $t('words.installed') }}</f7-block-title>
			<f7-list class="list-installed">
				<ul>
					<f7-list-item
						v-for="(app, index) in apps"
						:key="app.packageName"
						:badge="app.packageInstalled.versionName"
						:badge-color="app.packageUpdate ? 'orange' : 'green'"
						:data-icon="app.icon"
						:footer="app.packageName"
						:link="`/sources/${encodeURIComponent(app.sourceId)}/apps/${app.packageName}/`"
						:swipeout="!app.packageInstalled.applicationSystem"
						:title="app.name"
					>
						<img v-if="icons[app.icon]" slot="media" :src="icons[app.icon]" alt="" class="icon-40"/>
						<f7-skeleton-block v-if="app.icon && !icons[app.icon]" slot="media" class="icon-40"></f7-skeleton-block>
						<f7-swipeout-actions right>
							<f7-swipeout-button color="blue" @click="() => submitLaunch(app)">{{ $t('words.launch') }}</f7-swipeout-button>
							<f7-swipeout-button color="red" @click="() => submitUninstall(app)">{{ $t('words.uninstall') }}</f7-swipeout-button>
						</f7-swipeout-actions>
					</f7-list-item>
				</ul>
			</f7-list>
		</div>
		<f7-list v-if="loading">
			<f7-list-item v-for="index in 25" :key="index" class="skeleton-text" title="Lorem ipsum dolor sit amet.">
				<f7-skeleton-block slot="media" class="icon-40"/>
			</f7-list-item>
		</f7-list>
		<div v-else-if="!apps.length" class="display-flex justify-content-center align-items-center height-100">
			<f7-block>
				<f7-icon aurora="f7:circle_grid_3x3" class="display-block" ios="f7:circle_grid_3x3" md="material:apps" size="100"/>
			</f7-block>
			<f7-block>
				<p>{{ $t('pages.manager.noApps') }}</p>
				<f7-button :text="$t('words.explore')" href="/home/" outline raised/>
			</f7-block>
		</div>
	</f7-page>
</template>
<script>
import {fetchIcons, suggestPackage} from '../js/utils';
import ChipAntiFeature from '../components/chips/antifeature';
import PopoverAntiFeatures from '../components/popovers/antifeatures.vue';

export default {
	components: {ChipAntiFeature, PopoverAntiFeatures},
	data: function() {
		return {
			apps: [],
			icons: {},
			iconsTimeout: null,
		};
	},
	computed: {
		loading: function() {
			const loading = this.$store.state.sources.loading;

			if(!loading) {
				this.checkApps();
			}

			return loading;
		},
	},
	methods: {
		fetchIcons: function() {
			clearTimeout(this.iconsTimeout);

			this.iconsTimeout = setTimeout(() => {
				const items = [];

				this.$$('[class^="list-"] li[data-icon]').each((index, app) => {
					if(this.$$(app).offset().top > 0 && this.$$(app).offset().top < window.innerHeight) {
						items.push({icon: this.$$(app).data('icon')});
					}
				});

				fetchIcons(items, this.icons, this.$f7.data.server, this.$store.state.settings.assetsAge).then(icons => {
					this.icons = {
						...this.icons,
						...icons,
					};
				});
			}, 5000);
		},
		checkApps: function() {
			ablota.store.package.list(data => {
				if(data.status === 'success') {
					const apps = [];

					const promises = data.packages.map(installedPackage => new Promise(resolve => {
						const packages = this.$store.getters['sources/getPackages'](installedPackage.packageName);
						let appPackage = null;

						if(packages.some(appPackage => installedPackage.signatures.includes(appPackage.signer) && installedPackage.versionCode === appPackage.versionCode)) {
							appPackage = packages.find(appPackage => installedPackage.signatures.includes(appPackage.signer) && installedPackage.versionCode === appPackage.versionCode);
						} else if(packages.some(appPackage => installedPackage.signatures.includes(appPackage.signer))) {
							appPackage = packages.find(appPackage => installedPackage.signatures.includes(appPackage.signer));
						} else if(installedPackage.installerPackageName === this.$f7.params.id && packages.length) {
							appPackage = packages[0];
						}

						if(appPackage) {
							const app = this.$store.getters['sources/getApp'](appPackage.sourceId, appPackage.packageName, this.$f7.language);

							suggestPackage(app, packages, this.$f7.data.deviceInfo).then(data => {
								let packageDifferences = null;

								if(data.package) {
									packageDifferences = {
										antiFeatures: data.package.antiFeatures.filter(antiFeature => !appPackage.antiFeatures.includes(antiFeature)),
									};
								}

								apps.push({
									...app,
									package: appPackage,
									packageSuggestion: data.package,
									packageUpdate: data.outdated,
									packageInstalled: installedPackage,
									packageDifferences,
								});

								resolve();
							}).catch(data => this.$f7.dialog.alert(this.$t(data)));
						} else {
							resolve();
						}
					}));

					Promise.all(promises).then(() => {
						if(!this.apps.some(app => app.packageName === this.$f7.id && app.packageUpdate) && apps.some(app => app.packageName === this.$f7.id && app.packageUpdate)) {
							const app = apps.find(app => app.packageName === this.$f7.id && app.packageUpdate);

							this.$f7.dialog.alert(this.$t('pages.manager.updateSystem'), () => {
								this.$f7router.navigate(`/sources/${encodeURIComponent(app.sourceId)}/apps/${app.packageName}/`);
							});
						}

						this.apps = apps.sort((a, b) => a.lastUpdated < b.lastUpdated);
						this.fetchIcons();
					});
				} else {
					this.$f7.dialog.alert(this.$t('pages.manager.errors.list'));
				}
			}, () => {
				this.$f7.dialog.alert(this.$t('pages.manager.errors.list'));
			});
		},
		submitLaunch: function(app) {
			ablota.store.package.launch(app.packageName, () => {
			}, () => {
				this.$f7.dialog.alert(this.$t('pages.manager.errors.launch'));
			});
		},
		submitUninstall: function(app) {
			this.$f7.dialog.confirm(this.$t('pages.manager.uninstall.before'), () => {
				ablota.store.package.uninstall(app.packageName, data => {
					if(data.status === 'success') {
						if(data.code === 0) {
							this.$f7.toast.show({
								text: this.$t('pages.manager.uninstall.after'),
							});
							this.$f7.swipeout.delete(this.$$(`.list-installed li[data-icon="${app.icon}"]`), () => this.checkApps());
						} else if(data.code !== 3) {
							this.$f7.dialog.alert(this.$t('pages.manager.errors.uninstall'));
						}
					}
				}, () => {
					this.$f7.dialog.alert(this.$t('pages.manager.errors.uninstall'));
				});
			});
		},
	},
	mounted() {
		this.$f7ready(() => {
			let interactionTimeout = null;

			this.$$(document).on('resume', () => this.checkApps());
			this.$$(window).on('touchstart touchmove', () => {
				clearTimeout(interactionTimeout);
				interactionTimeout = setTimeout(() => this.fetchIcons(), 1000);
			});

			this.$$('.page-content').on('scroll', () => {
				clearTimeout(interactionTimeout);
				interactionTimeout = setTimeout(() => this.fetchIcons(), 1000);
			});

			setInterval(() => this.checkApps(), 60000);
		});
	},
};
</script>
