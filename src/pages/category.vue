<template>
	<f7-page name="category">
		<f7-navbar :back-link="$t('words.back')">
			<f7-nav-title>{{ category }}</f7-nav-title>
			<f7-nav-right v-if="!loading">
				<f7-link class="searchbar-enable" data-searchbar=".searchbar-list" icon-aurora="f7:search" icon-ios="f7:search" icon-md="material:search"/>
			</f7-nav-right>
			<f7-searchbar
				:disable-button-text="$t('words.cancel')"
				:placeholder="$t('words.search')"
				class="searchbar-list"
				expandable
				search-container=".search-list"
				@searchbar:search="fetchAppsIcons"
			></f7-searchbar>
		</f7-navbar>
		<f7-list class="searchbar-not-found">
			<f7-list-item :title="$t('pages.category.notFound')"></f7-list-item>
		</f7-list>
		<div v-show="!loading">
			<f7-list-index
				v-if="!loading" :indexes="Object.keys(groups)" :label="true" class="position-fixed" list-el=".search-list"
			></f7-list-index>
			<f7-list
				class="searchbar-found search-list" contacts-list
			>
				<ul>
					<f7-list-group v-for="(apps, title) in this.groups" :key="title">
						<f7-list-item :title="title" group-title></f7-list-item>
						<f7-list-item
							v-for="(app, index) in apps"
							:key="index"
							:data-icon="app.icon"
							:link="`/sources/${encodeURIComponent(app.sourceId)}/apps/${app.packageName}/`"
							:title="app.name"
						>
							<img v-if="appsIcons[app.icon]" slot="media" :src="appsIcons[app.icon]" alt="" class="icon-20"/>
							<f7-skeleton-block v-if="app.icon && !appsIcons[app.icon]" slot="media" class="icon-20"></f7-skeleton-block>
						</f7-list-item>
					</f7-list-group>
				</ul>
			</f7-list>
		</div>
		<f7-list
			v-if="loading" contacts-list
		>
			<ul>
				<f7-list-group>
					<f7-list-item group-title title="A"></f7-list-item>
					<f7-list-item v-for="index in 25" :key="index" class="skeleton-text" title="Lorem ipsum dolor sit amet.">
						<f7-skeleton-block slot="media" class="icon-20"/>
					</f7-list-item>
				</f7-list-group>
			</ul>
		</f7-list>
	</f7-page>
</template>
<script>
import {fetchIcons} from '../js/utils';

export default {
	props: {
		categoryId: {
			type: String,
			required: false,
		},
		sourceId: {
			type: String,
			required: false,
		},
	},
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
		category: function() {
			if(!this.categoryId) {
				return this.$t('words.search');
			}

			const translation = this.$t(`pages.categories.official.${this.categoryId}`);

			return translation.title ? translation.title : this.categoryId;
		},
		source: function() {
			return this.$store.getters['sources/getItem'](this.sourceId);
		},
		apps: function() {
			if(this.loading) {
				return [];
			}

			let apps = this.$store.getters['sources/getApps'](this.$f7.language, this.sourceId);

			if(this.categoryId) {
				apps = apps.filter(app => app.categories.some(category => category === this.categoryId));
			}

			return apps.sort((a, b) => a.name.localeCompare(b.name, undefined, {
				numeric: true,
			}));
		},
		groups: function() {
			let groups = {};

			this.apps.forEach(app => {
				const group = app.name.charAt(0).toUpperCase();

				if(!groups[group]) {
					groups[group] = [];
				}
				groups[group].push(app);
			});

			return groups;
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
				const items = [];

				this.$$('.search-list li[data-icon]').each((index, app) => {
					if(this.$$(app).offset().top > 0 && this.$$(app).offset().top < window.innerHeight) {
						items.push({icon: this.$$(app).data('icon')});
					}
				});

				fetchIcons(items, this.appsIcons, this.$f7.data.server, this.$store.state.settings.assetsAge).then(icons => {
					this.appsIcons = {
						...this.appsIcons,
						...icons,
					};
				});
			}, 5000);
		},
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
