<template>
	<f7-page name="categories">
		<f7-navbar large>
			<f7-nav-left>
				<f7-link href="/about/" icon-aurora="f7:menu" icon-ios="f7:menu" icon-md="material:menu" />
			</f7-nav-left>
			<f7-nav-title>{{ $t('pages.categories.title') }}</f7-nav-title>
			<f7-nav-title-large>{{ $t('pages.categories.title') }}</f7-nav-title-large>
			<f7-nav-right>
				<f7-link icon-aurora="f7:search" icon-ios="f7:search" icon-md="material:search" href="/sources/apps/search/" />
			</f7-nav-right>
		</f7-navbar>
		<f7-list>
			<f7-list-item
				:footer="$tc('counts.apps', 0, {
						count: 0,
					})"
				:key="index"
				title="Lorem ipsum dolor sit amet."
				v-for="index in 10"
				v-if="loading"
				class="skeleton-text"
			>
				<f7-skeleton-block class="icon-40" slot="media"/>
			</f7-list-item>
			<f7-list-item
				:footer="$tc('counts.apps', category.apps, {
						count: category.apps,
					})"
				:key="category.id"
				:link="`/categories/${category.id}/`"
				:title="category.title"
				v-for="category in categories.official"
				v-if="!loading"
			>
				<img :src="`static/images/categories/${category.id}.png`" alt="" slot="media" class="icon-40" />
			</f7-list-item>
		</f7-list>
		<div v-if="!loading && categories.unofficial.length">
			<f7-block-title>{{ $t('words.more') }}</f7-block-title>
			<f7-list>
				<f7-list-item
					:footer="$tc('counts.apps', category.apps, {
						count: category.apps,
					})"
					:key="category.id"
					:link="`/categories/${category.id}/`"
					:title="category.id"
					v-for="category in categories.unofficial"
				></f7-list-item>
			</f7-list>
		</div>
	</f7-page>
</template>
<script>
	export default {
		computed: {
			loading: function() {
				return this.$store.state.sources.loading;
			},
			categories: function() {
				const official = {};
				const unofficial = {};

				this.$store.state.sources.items.forEach(source => source.apps.forEach(app => app.categories.forEach(category => {
					if(this.$t(`pages.categories.official.${category}`).title) {
						if(official[category]) {
							official[category].apps++;
						} else {
							official[category] = {
								id: category,
								title: this.$t(`pages.categories.official.${category}.title`),
								apps: 1,
							};
						}
					} else {
						if(unofficial[category]) {
							unofficial[category].apps++;
						} else {
							unofficial[category] = {
								id: category,
								apps: 1,
							};
						}
					}
				})));

				return {
					official: Object.values(official).sort((a, b) => a.title.localeCompare(b.title)),
					unofficial: Object.values(unofficial).sort((a, b) => a.id.localeCompare(b.id)),
				};
			},
		},
	};
</script>
