<template>
	<f7-page name="app">
		<f7-navbar v-if="app" :back-link="$t('words.back')" large transparent>
			<f7-nav-title>{{ app.name }}</f7-nav-title>
			<f7-nav-title-large>{{ app.name }}</f7-nav-title-large>
			<f7-nav-right>
				<f7-link icon-aurora="f7:square_arrow_up" icon-ios="f7:square_arrow_up" icon-md="material:share" @click="share"></f7-link>
			</f7-nav-right>
		</f7-navbar>
		<f7-navbar v-else :back-link="$t('words.back')" large transparent>
			<f7-nav-title class="skeleton-text">Lorem ipsum dolor sit amet.</f7-nav-title>
			<f7-nav-title-large class="skeleton-text">Lorem ipsum dolor sit amet.</f7-nav-title-large>
		</f7-navbar>
		<f7-toolbar bottom class="toolbar-progress fab-morph-target">
			<f7-link
				slot="before-inner"
				:text="$t('words.cancel')"
				class="float-left fab-close"
				color="red"
				icon-aurora="f7:xmark"
				icon-ios="f7:xmark"
				icon-md="material:clear"
				@click="cancelInstallPackage"
			></f7-link>
			<f7-gauge
				:label-text="progress.label" :value="progress.value" :value-text="progress.status" border-color="#2196f3" type="semicircle"
			></f7-gauge>
		</f7-toolbar>
		<popover-anti-features/>
		<popup-download-app/>
		<f7-fab
			v-show="app && suggestion.package && (!suggestion.installed || suggestion.outdated || suggestion.reinstall)"
			slot="fixed"
			:text="suggestion.outdated ? $t('words.update') : $t('words.install')"
			class="fab-install no-margin-bottom"
			morph-to=".toolbar-progress"
			position="center-bottom"
			@click="installPackage(suggestion.package)"
		>
			<f7-icon aurora="f7:plus" ios="f7:plus" md="material:add"></f7-icon>
		</f7-fab>
		<f7-fab
			v-show="app && suggestion.installed && !suggestion.outdated && !suggestion.reinstall"
			slot="fixed"
			:text="$t('words.launch')"
			class="fab-launch no-margin-bottom"
			position="center-bottom"
			@click="launchApp()"
		>
			<f7-icon aurora="f7:arrow_up_right_square" ios="f7:arrow_up_right_square" md="material:launch"></f7-icon>
		</f7-fab>
		<f7-fab
			v-show="app && suggestion.installed"
			slot="fixed"
			:tooltip="$t('words.uninstall')"
			class="fab-uninstall no-margin-bottom"
			position="right-bottom"
			@click="uninstallApp"
		>
			<f7-icon aurora="f7:trash" ios="f7:trash" md="material:delete"></f7-icon>
		</f7-fab>
		<div v-if="app">
			<f7-popover class="popover-packages">
				<f7-list>
					<f7-list-item
						v-for="appPackage in packages"
						:key="appPackage.hash"
						:badge="suggestion.package && appPackage.hash === suggestion.package.hash ? $t('words.suggestion') : ''"
						:footer="`${appPackage.added.toLocaleDateString()}, ${Math.round(appPackage.size / 1024 / 1024 * 10) / 10} MB`"
						:title="`${appPackage.versionName} (${appPackage.versionCode})`"
						link
						popover-close
						@click="() => installPackage(appPackage)"
					/>
				</f7-list>
			</f7-popover>
			<f7-popover class="popover-author">
				<f7-list>
					<f7-list-item v-if="app.authorEmail" :footer="app.authorEmail" :link="`mailto:${app.authorEmail}`" :title="$t('words.email')" external popover-close>
						<f7-icon slot="media" aurora="f7:envelope" ios="f7:envelope" md="material:mail"></f7-icon>
					</f7-list-item>
					<f7-list-item v-if="app.authorWebSite" :footer="app.authorWebSite" :link="app.webSite" :title="$t('words.website')" external popover-close target="_system">
						<f7-icon slot="media" aurora="f7:link" ios="f7:link" md="material:link"></f7-icon>
					</f7-list-item>
				</f7-list>
			</f7-popover>
			<f7-list accordion-list class="no-margin" media-list no-hairlines>
				<f7-list-item
					:accordion-item="!!suggestion.package" :footer="app.packageName" :subtitle="app.summary" class="no-subtitle-limit"
				>
					<img v-if="appIcon" slot="media" :src="appIcon" alt="" class="icon-60"/>
					<f7-skeleton-block v-if="app.icon && !appIcon" slot="media" class="icon-60"/>
					<f7-link v-if="app.authorName && (app.authorEmail || app.authorWebSite)" slot="text" popover-open=".popover-author" v-html="app.authorName"/>
					<span v-else-if="app.authorName" slot="text" v-html="app.authorName"/>
					<f7-accordion-content v-if="suggestion.package">
						<f7-block-title class="no-margin-top">{{ $t('words.details') }}</f7-block-title>
						<f7-block>
							<p>{{ $t('pages.app.details') }}</p>
						</f7-block>
						<f7-list class="no-title-limit item-padding-half" inset>
							<f7-list-item :header="$t('words.date')" :title="suggestion.package.added.toLocaleDateString()"></f7-list-item>
							<f7-list-item :header="$t('words.version')" :title="`${suggestion.package.versionName} (${suggestion.package.versionCode})`"></f7-list-item>
							<f7-list-item :header="$t('words.size')" :title="`${Math.round(suggestion.package.size / 1024 / 1024 * 10) / 10} MB`"></f7-list-item>
							<f7-list-item v-if="suggestion.package.minSdkVersion" :header="$t('words.minSdkVersion')" :title="suggestion.package.minSdkVersion"></f7-list-item>
							<f7-list-item
								v-if="suggestion.package.targetSdkVersion"
								:header="$t('words.targetSdkVersion')"
								:title="suggestion.package.targetSdkVersion"
							></f7-list-item>
							<f7-list-item v-if="suggestion.package.maxSdkVersion" :header="$t('words.maxSdkVersion')" :title="suggestion.package.maxSdkVersion"></f7-list-item>
							<f7-list-item v-if="suggestion.package.nativecode.length" :header="$t('words.abis')" :title="suggestion.package.nativecode.join(', ')"></f7-list-item>
						</f7-list>
						<div v-if="Object.keys(permissions).length">
							<f7-block-title>{{ $t('words.permissions') }}</f7-block-title>
							<f7-block>
								<p>{{ $t('pages.app.permissions') }}</p>
							</f7-block>
							<f7-list class="no-title-limit item-padding-half" inset>
								<f7-list-item v-for="(value, name) in permissions" :header="name" :title="value"></f7-list-item>
							</f7-list>
						</div>
						<div v-if="suggestion.package.features.length">
							<f7-block-title>{{ $t('words.features') }}</f7-block-title>
							<f7-block>
								<p>{{ $t('pages.app.features') }}</p>
							</f7-block>
							<f7-list class="no-title-limit item-padding-half" inset>
								<f7-list-item v-for="feature in suggestion.package.features" :header="feature" :title="feature"></f7-list-item>
							</f7-list>
						</div>
						<f7-block-title>{{ $t('words.hashes') }}</f7-block-title>
						<f7-block>
							<p>{{ $t('pages.app.hashes') }}</p>
						</f7-block>
						<f7-list class="no-title-limit item-padding-half" inset>
							<f7-list-item
								v-if="suggestion.package.hashType === 'sha256'"
								:header="`${$t('words.apk')} (${$t('words.sha256')})`"
								:title="suggestion.package.hash.match(/.{1,2}/g).join(':').toUpperCase()"
							></f7-list-item>
							<f7-list-item
								v-if="suggestion.package.hashType === 'sha512'"
								:header="`${$t('words.apk')} (${$t('words.sha512')})`"
								:title="suggestion.package.hash.match(/.{1,2}/g).join(':').toUpperCase()"
							></f7-list-item>
							<f7-list-item
								v-if="suggestion.package.obbMainFileSha256"
								:header="`${$t('words.obbMain')} (${$t('words.sha256')})`"
								:title="suggestion.package.obbMainFileSha256.match(/.{1,2}/g).join(':').toUpperCase()"
							></f7-list-item>
							<f7-list-item
								v-if="suggestion.package.obbPatchFileSha256"
								:header="`${$t('words.obbPatch')} (${$t('words.sha256')})`"
								:title="suggestion.package.obbPatchFileSha256.match(/.{1,2}/g).join(':').toUpperCase()"
							></f7-list-item>
						</f7-list>
					</f7-accordion-content>
				</f7-list-item>
			</f7-list>
			<f7-block v-if="appGraphicsBundle.length" class="no-margin">
				<f7-swiper :params="{effect: 'cube', centeredSlides: true, loop: appGraphicsBundle.length > 1, autoplay: {delay: 10000}, }">
					<f7-swiper-slide v-for="(graphic, index) in appGraphicsBundle" :key="index">
						<img v-if="appGraphics[graphic]" :src="appGraphics[graphic]" alt="" class="width-100" @click="graphicsPhotoBrowser.open(index)"/>
						<f7-skeleton-block v-else height="30vh" width="100%"/>
						<f7-link
							v-if="app.video"
							:href="app.video"
							:tooltip="$t('words.video')"
							class="overlay-center"
							external
							icon-aurora="f7:play_circle"
							icon-color="black"
							icon-ios="f7:play_circle"
							icon-md="material:play_circle_outline"
							icon-size="75"
							target="_system"
						></f7-link>
					</f7-swiper-slide>
				</f7-swiper>
			</f7-block>
			<div v-if="app.whatsNew">
				<f7-block-title>{{ $t('words.whatsNew') }}</f7-block-title>
				<f7-block v-html="app.whatsNew"></f7-block>
			</div>
			<div v-if="app.description">
				<f7-block-title>{{ $t('words.description') }}</f7-block-title>
				<f7-list accordion-list class="no-margin" media-list no-hairlines>
					<f7-list-item
						:accordion-item="app.description.length > 500" class="no-subtitle-limit accordion-text"
					>
						<span slot="title" class="item-subtitle" v-html="`${app.description.replace(/^(.{500}[^\s]*).*/, '$1')}${app.description.length > 500 ? '...' : ''}`"/>
						<f7-accordion-content>
							<f7-block class="no-margin" v-html="`...${app.description.replace(app.description.replace(/^(.{500}[^\s]*).*/, '$1'), '')}`"></f7-block>
						</f7-accordion-content>
					</f7-list-item>
				</f7-list>
			</div>
			<div v-if="appScreenshotsBundle.length">
				<f7-block-title>{{ $t('words.screenshots') }}</f7-block-title>
				<f7-block>
					<f7-swiper :params="{slidesPerView: 3.5, spaceBetween: 20}">
						<f7-swiper-slide v-for="(screenshot, index) in appScreenshotsBundle.flat()" :key="index">
							<img v-if="appScreenshots[screenshot]" :src="appScreenshots[screenshot]" alt="" class="width-100" @click="screenshotsPhotoBrowser.open(index)"/>
							<f7-skeleton-block v-else height="20vh" width="100%"/>
						</f7-swiper-slide>
					</f7-swiper>
				</f7-block>
			</div>
			<div v-if="!!(app.donate || app.bitcoin || app.litecoin || app.liberapayID || app.flattrID || app.openCollective)">
				<f7-card>
					<f7-card-content class="text-align-center">
						<p>{{ $t('pages.app.donate') }}</p>
						<a v-if="app.bitcoin" :href="`bitcoin:${app.bitcoin}?message=${app.name}`" class="chip color-orange external" @click="crypto(app.bitcoin)">
							<div class="chip-label">{{ $t('words.bitcoin') }}</div>
						</a> <a v-if="app.litecoin" :href="`litecoin:${app.litecoin}?message=${app.name}`" class="chip color-blue external" @click="crypto(app.litecoin)">
						<div class="chip-label">{{ $t('words.litecoin') }}</div>
					</a> <a v-if="app.liberapayID" :href="`https://liberapay.com/~${app.liberapayID}`" class="chip color-yellow external" target="_system">
						<div class="chip-label">{{ $t('words.liberapay') }}</div>
					</a> <a v-if="app.flattrID" :href="`https://flattr.com/thing/${app.flattrID}`" class="chip color-green external" target="_system">
						<div class="chip-label">{{ $t('words.flattr') }}</div>
					</a> <a v-if="app.openCollective" :href="`https://opencollective.com/${app.openCollective}`" class="chip color-lightblue external" target="_system">
						<div class="chip-label">{{ $t('words.openCollective') }}</div>
					</a>
						<p v-if="!!(app.donate && (app.bitcoin || app.litecoin || app.liberapayID || app.flattrID || app.openCollective))"><i>{{ $t('words.or') }}</i></p>
						<f7-button v-if="app.donate" :href="app.donate" :text="$t('words.donate')" external fill raised target="_system"></f7-button>
					</f7-card-content>
				</f7-card>
			</div>
			<div v-if="app.antiFeatures.length">
				<f7-block-title>{{ $t('words.antiFeatures') }}</f7-block-title>
				<f7-block>
					<chip-anti-feature v-for="antiFeature in app.antiFeatures" :key="antiFeature" :name="antiFeature" class="padding-horizontal-half"/>
				</f7-block>
			</div>
			<div v-if="!!(app.license || app.webSite || app.sourceCode || app.issueTracker || app.translation || app.changelog)">
				<f7-block-title>{{ $t('words.links') }}</f7-block-title>
				<f7-list>
					<f7-list-item
						v-if="app.license"
						:footer="app.license"
						:link="`https://spdx.org/licenses/${app.license}`"
						:title="$t('words.license')"
						external
						target="_system"
					>
						<f7-icon slot="media" aurora="f7:doc_text" ios="f7:doc_text" md="material:copyright"></f7-icon>
					</f7-list-item>
					<f7-list-item v-if="app.webSite" :footer="app.webSite" :link="app.webSite" :title="$t('words.website')" external target="_system">
						<f7-icon slot="media" aurora="f7:link" ios="f7:link" md="material:link"></f7-icon>
					</f7-list-item>
					<f7-list-item v-if="app.sourceCode" :footer="app.sourceCode" :link="app.sourceCode" :title="$t('words.sourceCode')" external target="_system">
						<f7-icon slot="media" aurora="f7:chevron_left_slash_chevron_right" ios="f7:chevron_left_slash_chevron_right" md="material:code"></f7-icon>
					</f7-list-item>
					<f7-list-item v-if="app.issueTracker" :footer="app.issueTracker" :link="app.issueTracker" :title="$t('words.issueTracker')" external target="_system">
						<f7-icon slot="media" aurora="f7:ant" ios="f7:ant" md="material:bug_report"></f7-icon>
					</f7-list-item>
					<f7-list-item v-if="app.translation" :footer="app.translation" :link="app.translation" :title="$t('words.translation')" external target="_system">
						<f7-icon slot="media" aurora="f7:t_bubble" ios="f7:t_bubble" md="material:translate"></f7-icon>
					</f7-list-item>
					<f7-list-item v-if="app.changelog" :footer="app.changelog" :link="app.changelog" :title="$t('words.changelog')" external target="_system">
						<f7-icon slot="media" aurora="f7:gobackward" ios="f7:gobackward" md="material:history"></f7-icon>
					</f7-list-item>
				</f7-list>
			</div>
		</div>
		<div v-else>
			<f7-list accordion-list class="no-margin" media-list no-hairlines>
				<f7-list-item
					accordion-item
					accordion-item-opened
					class="skeleton-text no-subtitle-limit"
					footer="Lorem ipsum dolor."
					subtitle="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
				>
					<f7-skeleton-block slot="media" class="icon-60"/>
					<span slot="text" class="skeleton-text">Lorem ipsum.</span>
					<f7-accordion-content>
						<f7-block-title class="skeleton-text">{{ $t('words.description') }}</f7-block-title>
						<f7-block class="skeleton-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla enim arcu, sollicitudin vel lacus quis, efficitur auctor diam. Nunc cursus lacus a neque efficitur, ut ultricies eros euismod. Pellentesque tempus placerat finibus. Morbi pellentesque id nunc id porttitor. Nullam et turpis vitae enim maximus pharetra vel non ipsum. Proin ac mattis sapien. Donec leo massa, viverra vitae enim ac, condimentum fringilla risus. Suspendisse hendrerit quis lacus nec auctor. Cras vel nunc a massa ullamcorper sollicitudin sed vitae urna. Nam consectetur sollicitudin erat in accumsan.</f7-block>
						<f7-block-title class="skeleton-text">{{ $t('words.whatsNew') }}</f7-block-title>
						<f7-block class="skeleton-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla enim arcu, sollicitudin vel lacus quis, efficitur auctor diam. Nunc cursus lacus a neque efficitur, ut ultricies eros euismod. Pellentesque tempus placerat finibus. Morbi pellentesque id nunc id porttitor. Nullam et turpis vitae enim maximus pharetra vel non ipsum. Proin ac mattis sapien. Donec leo massa, viverra vitae enim ac, condimentum fringilla risus. Suspendisse hendrerit quis lacus nec auctor. Cras vel nunc a massa ullamcorper sollicitudin sed vitae urna. Nam consectetur sollicitudin erat in accumsan.</f7-block>
					</f7-accordion-content>
				</f7-list-item>
			</f7-list>
		</div>
	</f7-page>
</template>
<script>
import {Device} from 'framework7';
import {downloadPackage, fetchIcons, share, suggestPackage} from '../js/utils';
import ChipAntiFeature from '../components/chips/antifeature';
import PopoverAntiFeatures from '../components/popovers/antifeatures';
import PopupDownloadApp from '../components/popups/downloadapp';

export default {
	components: {ChipAntiFeature, PopoverAntiFeatures, PopupDownloadApp},
	props: {
		sourceId: {
			type: String,
			required: true,
		},
		appId: {
			type: String,
			required: true,
		},
	},
	data: () => {
		return {
			appIcon: null,
			appGraphics: {},
			appScreenshots: {},
			packages: [],
			suggestion: {},
			permissions: {},
			progress: {
				value: 0,
				status: null,
				label: null,
			},
			installPackageCancelled: false,
		};
	},
	computed: {
		loading: function() {
			return this.$store.state.sources.loading;
		},
		app: function() {
			if(this.loading) return null;

			return this.$store.getters['sources/getApp'](this.sourceId, this.appId, this.$f7.language);
		},
		appGraphicsBundle: function() {
			if(!this.app) return [];

			return ['featureGraphic', 'promoGraphic', 'tvBanner'].filter(graphic => this.app[graphic]).map(graphic => this.app[graphic]);
		},
		appScreenshotsBundle: function() {
			if(!this.app) return [];

			return ['phoneScreenshots', 'sevenInchScreenshots', 'tenInchScreenshots', 'wearScreenshots', 'tvScreenshots'].filter(screenshots => this.app[screenshots].length)
				.map(screenshots => this.app[screenshots]);
		},
		appPackages: function() {
			if(this.loading) return [];

			return this.$store.getters['sources/getPackages'](this.appId, this.sourceId);
		},
		graphicsPhotoBrowser: function() {
			return this.$f7.photoBrowser.create({
				photos: Object.values(this.appGraphics),
			});
		},
		screenshotsPhotoBrowser: function() {
			return this.$f7.photoBrowser.create({
				photos: Object.values(this.appScreenshots),
			});
		},
	},
	watch: {
		app: {
			handler: function(app) {
				if(!app) return;

				this.checkPackages();

				fetchIcons([app], {}, this.$f7.data.server, this.$store.state.settings.assetsAge).then(icons => {
					this.appIcon = icons[app.icon] ? icons[app.icon] : null;
				});

				fetchIcons(this.appGraphicsBundle.map(graphic => ({icon: graphic})), this.appGraphics, this.$f7.data.server, this.$store.state.settings.assetsAge)
					.then(appGraphics => {
						this.appGraphics = {
							...this.appGraphics,
							...appGraphics,
						};
					});

				this.appScreenshotsBundle.forEach(screenshots => {
					fetchIcons(screenshots.map(screenshot => ({icon: screenshot})), this.appScreenshots, this.$f7.data.server, this.$store.state.settings.assetsAge)
						.then(appScreenshots => {
							this.appScreenshots = {
								...this.appScreenshots,
								...appScreenshots,
							};
						});
				});
			},
			immediate: true,
		},
		appPackages: {
			handler: function(appPackages) {
				this.checkPackages(appPackages);
			},
			immediate: true,
		},
	},
	methods: {
		installPackage: function(appPackage) {
			this.$f7.fab.open('.fab-install');

			if(Device.cordova) {
				if(!appPackage) {
					setTimeout(() => this.$f7.fab.close('.fab-install'), 1000);
					this.$f7.popover.open('.popover-packages', '.fab-install', true);

					return;
				}
				if(this.suggestion.reinstall) {
					setTimeout(() => this.$f7.fab.close('.fab-install'), 1000);
					this.$f7.dialog.confirm(this.$t('pages.app.reinstall'), () => {
						this.uninstallApp();
					});

					return;
				}

				this.installPackageCancelled = false;

				const fakeProgress = setInterval(() => update({
					progress: this.progress.value * 100 + 1,
				}), 15000);
				const update = data => {
					let label;

					if(data.progress === 100) {
						clearInterval(fakeProgress);
						label = `${this.$t('words.verifying')}...`;
					} else if(data.bytesTotal) {
						clearInterval(fakeProgress);
						label = `${Math.round(data.bytesCurrent / 1024 / 1024 * 10) / 10} / ${Math.round(data.bytesTotal / 1024 / 1024 * 10) / 10} MB`;
					} else if(data.itemsTotal) {
						label = `${data.itemsCurrent} / ${data.itemsTotal} ${this.$t('words.items')}`;
					} else {
						label = `${this.$t('words.downloading')}...`;
					}

					this.progress = {
						value: data.progress / 100,
						status: `${data.progress}%`,
						label,
					};
				};

				this.progress = {
					value: 0,
					status: '0%',
					label: `${this.$t('words.downloading')}...`,
				};

				downloadPackage(this.app, appPackage, update).then(data => {
					if(this.installPackageCancelled) return;

					this.progress = {
						value: 1,
						status: '100%',
						label: `${this.$t('words.installing')}...`,
					};

					ablota.store.package.install([
						{
							file: data.packageFilePath,
							hash: appPackage.hash,
						},
					], false, data => {
						if(data.status === 'success' && data.code === 0) {
							this.$f7.toast.show({
								text: this.$t('pages.app.install.success'),
								closeButtonText: this.$t('words.launch'),
								on: {
									closeButtonClick: () => this.launchApp(),
								},
							});
							this.$f7.fab.close('.fab-install');
						} else if(data.status === 'failure' || (data.status === 'success' && data.code !== 0)) {
							this.$f7.toast.show({
								text: this.$t('pages.app.install.failure'),
							});
							this.$f7.fab.close('.fab-install');
						}

						this.checkPackages();
					}, data => {
						this.$f7.dialog.alert(this.$t(data));
						this.$f7.fab.close('.fab-install');
					});
				}).catch(data => {
					this.$f7.dialog.alert(this.$t(data));
					this.cancelInstallPackage();
				});
			} else {
				this.$f7.popup.open('.popup-downloadapp');
				setTimeout(() => this.$f7.fab.close('.fab-install'), 1000);
			}
		},
		cancelInstallPackage: function() {
			this.installPackageCancelled = true;

			setTimeout(() => this.$f7.fab.close('.fab-install'), 1000);
		},
		launchApp: function() {
			if(!Device.cordova) return;

			ablota.store.package.launch(this.app.packageName, () => {
			}, () => {
				this.$f7.dialog.alert(this.$t('pages.app.launch'));
			});
		},
		uninstallApp: function() {
			if(!Device.cordova) return;

			ablota.store.package.uninstall(this.app.packageName, () => this.checkPackages());
		},
		checkPackages: function(appPackages = this.appPackages) {
			if(Device.cordova && this.app) {
				suggestPackage(this.app, appPackages, this.$f7.data.deviceInfo).then(data => {
					this.suggestion = data;
					this.packages = data.packages;

					if(this.suggestion.package) {
						ablota.store.package.permissionsInfo(this.suggestion.package['uses-permission'].map(permission => permission[0]), data => {
							if(data.status === 'success') {
								for(const key in data.permissions) {
									if(data.permissions.hasOwnProperty(key) && data.permissions[key] === null) {
										delete data.permissions[key];
									}
								}

								this.permissions = data.permissions;
							}
						});
					}
				}).catch(data => {
					this.$f7.dialog.alert(this.$t(data));
					this.$f7router.back();
				});
			} else {
				this.packages = appPackages;
				this.suggestion = {
					package: this.packages[0],
					installed: false,
				};
			}
		},
		share: function() {
			const data = {
				title: this.$t('pages.app.share.title', {
					app: this.app.name,
				}),
				text: this.$t('pages.app.share.text', {
					summary: this.app.summary,
					app: this.app.name,
				}),
				url: `${this.$f7.data.url}${this.$f7.params.view.pushStateSeparator}${this.$f7router.generateUrl({
					name: 'app',
					params: {
						sourceId: encodeURIComponent(this.sourceId),
						appId: encodeURIComponent(this.appId),
					},
				})}`,
			};

			share(data).then(data => data && this.$f7.toast.show({
				text: this.$t(data),
			}));
		},
		crypto: function(address) {
			this.$f7.dialog.create({
				title: this.$t('app.name'),
				text: this.$t('pages.app.crypto.text'),
				buttons: [
					{
						text: this.$t('words.close'),
					},
					{
						text: this.$t('words.copy'),
						bold: true,
						onClick: () => {
							navigator.clipboard.writeText(address);

							this.$f7.toast.show({
								text: this.$t('pages.app.crypto.clipboard'),
							});
						},
					},
				],
				destroyOnClose: true,
			}).open();
		},
	},
	mounted: function() {
		this.$f7ready(() => {
			this.$$('.fab-install').on('taphold', () => {
				this.$f7.popover.open('.popover-packages', '.fab-install', true);
			});

			setInterval(() => {
				if(this.app) this.checkPackages();
			}, 30000);
		});
	},
};
</script>
