<template>
	<f7-page name="home">
		<div v-if="loading || apps.length">
			<f7-block-title>{{ $t('pages.home.newUpdated') }}</f7-block-title>
			<f7-swiper :params="{slidesPerView: 'auto', pagination: {clickable: true}}" pagination>
				<f7-swiper-slide :key="index" class="slide-new-updated" v-for="index in 10" v-if="loading">
					<f7-list class="list-new-updated no-margin-top">
						<f7-list-item
							:key="index"
							class="skeleton-text"
							footer="Lorem ipsum dolor sit amet, consetetur sadipscing elitr."
							title="Lorem ipsum dolor sit amet."
							v-for="index in 3"
						>
							<f7-skeleton-block class="icon-40" slot="media"/>
						</f7-list-item>
					</f7-list>
				</f7-swiper-slide>
				<f7-swiper-slide :key="index" class="slide-new-updated" v-for="(apps, index) in splitArray(newUpdatedApps, 3)" v-if="!loading">
					<f7-list class="list-new-updated no-margin-top">
						<f7-list-item
							:footer="app.summary"
							:key="index"
							:link="`/sources/${encodeURIComponent(app.sourceId)}/apps/${app.packageName}/`"
							:title="app.name"
							v-for="(app, index) in apps"
						>
							<img :src="appsIcons[app.icon]" alt="" class="icon-40" slot="media" v-if="appsIcons[app.icon]"/>
							<f7-skeleton-block class="icon-40" slot="media" v-if="app.icon && !appsIcons[app.icon]"/>
						</f7-list-item>
					</f7-list>
				</f7-swiper-slide>
			</f7-swiper>
			<f7-block-title>{{ $t('words.explore') }}</f7-block-title>
			<f7-list
				class="list-explore" v-show="!loading"
			>
				<ul>
					<f7-list-item
						:footer="app.summary"
						:key="index"
						:link="`/sources/${encodeURIComponent(app.sourceId)}/apps/${app.packageName}/`"
						:title="app.name"
						:data-icon="app.icon"
						v-for="(app, index) in apps.slice(0, 50)"
					>
						<img :src="appsIcons[app.icon]" alt="" class="icon-40" slot="media" v-if="appsIcons[app.icon]"/>
						<f7-skeleton-block class="icon-40" slot="media" v-if="app.icon && !appsIcons[app.icon]"/>
					</f7-list-item>
				</ul>
			</f7-list>
			<f7-list v-if="loading">
				<f7-list-item
					:key="index" class="skeleton-text" footer="Lorem ipsum dolor sit amet, consetetur sadipscing elitr." title="Lorem ipsum dolor sit amet." v-for="index in 20"
				>
					<f7-skeleton-block class="icon-40" slot="media"/>
				</f7-list-item>
			</f7-list>
		</div>
		<div class="display-flex justify-content-center align-items-center height-100" v-else>
			<f7-block>
				<f7-icon aurora="f7:cloud" class="display-block" ios="f7:cloud" md="material:cloud" size="100"/>
			</f7-block>
			<f7-block>
				<p>{{ $t('pages.home.noApps') }}</p>
				<f7-button :text="$t('pages.home.addSource')" href="/sources/" outline raised/>
			</f7-block>
		</div>
	</f7-page>
</template>
<script>
	import { fetchIcons, splitArray } from '../js/utils';

	export default {
		data: function() {
			return {
				appsIcons: {},
				appsIconsTimeout: null,
			};
		},
		computed: {
			loading: function() {
				return this.$store.state.sources.loading;
			},
			apps: function() {
				const apps = this.$store.getters['sources/getApps'](this.$f7.language);

				if(process.env.NODE_ENV === 'production') {
					for(let i = apps.length - 1; i > 0; i--) {
						const j = Math.floor(Math.random() * (i + 1));

						[apps[i], apps[j]] = [apps[j], apps[i]];
					}
				}

				return apps;
			},
			newUpdatedApps: function() {
				return this.apps.concat().sort((a, b) => b.lastUpdated - a.lastUpdated).slice(0, 30);
			},
		},
		watch: {
			apps: {
				handler: function(apps) {
					if(apps.length) this.fetchAppsIcons();
				},
				immediate: true,
			},
		},
		methods: {
			fetchAppsIcons: function() {
				clearTimeout(this.appsIconsTimeout);

				this.appsIconsTimeout = setTimeout(() => {
					fetchIcons(this.newUpdatedApps, this.appsIcons, this.$store.state.settings.assetsAge).then(icons => {
						this.appsIcons = {
							...this.appsIcons,
							...icons,
						}
					});

					const items = [];

					this.$$('.list-explore li[data-icon]').each((index, app) => {
						if(this.$$(app).offset().top > 0 && this.$$(app).offset().top < window.innerHeight) {
							items.push({icon: this.$$(app).data('icon')});
						}
					});

					fetchIcons(items, this.appsIcons, this.$store.state.settings.assetsAge).then(icons => {
						this.appsIcons = {
							...this.appsIcons,
							...icons,
						}
					});
				}, 5000);
			},
			splitArray,
		},
		mounted() {
			this.$f7ready(() => {
				let interactionTimeout = null;

				this.$$(window).on('touchstart touchmove', () => {
					clearTimeout(interactionTimeout);
					interactionTimeout = setTimeout(() => this.fetchAppsIcons(), 1000);
				});

				this.$$('.page-content').on('scroll', () => {
					clearTimeout(interactionTimeout);
					interactionTimeout = setTimeout(() => this.fetchAppsIcons(), 1000);
				});
			});
		},
	};
</script>
