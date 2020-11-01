<template>
	<f7-page name="source">
		<f7-navbar :back-link="$t('words.back')" large transparent>
			<f7-nav-title :class="source ? null : 'skeleton-text'">{{ source ? source.repo.name : 'Lorem ipsum dolor sit amet.' }}</f7-nav-title>
			<f7-nav-title-large :class="source ? null : 'skeleton-text'">{{ source ? source.repo.name : 'Lorem ipsum dolor sit amet.' }}</f7-nav-title-large>
			<f7-nav-right v-if="source">
				<f7-link icon-aurora="f7:qrcode" icon-ios="f7:qrcode" icon-md="f7:qrcode" popover-open=".popover-qrcode" v-if="qrcode"></f7-link>
				<f7-link @click="submitShare" icon-aurora="f7:square_arrow_up" icon-ios="f7:square_arrow_up" icon-md="material:share"></f7-link>
				<f7-link @click="submitRemove" icon-aurora="f7:trash" icon-ios="f7:trash" icon-md="material:delete" v-if="!source.system"></f7-link>
			</f7-nav-right>
		</f7-navbar>
		<f7-popover class="popover-qrcode">
			<img :src="qrcode" alt=""/>
		</f7-popover>
		<div v-if="source">
			<f7-list accordion-list class="no-margin" media-list no-hairlines>
				<f7-list-item
					:footer="$t('pages.source.footer', {
					date: source.repo.timestamp.toLocaleDateString(),
					version: source.repo.version,
				})"
					:subtitle="source.repo.description"
					accordion-item
					class="no-subtitle-limit"
				>
					<img :src="icon" alt="" slot="media" class="icon-60" v-if="icon" />
					<f7-skeleton-block class="icon-60" v-if="source.repo.icon && !icon" slot="media"/>
					<f7-accordion-content>
						<f7-block-title>{{ $t('words.address') }}</f7-block-title>
						<f7-block>
							<p>{{ $t('pages.source.address') }}</p>
						</f7-block>
						<f7-list class="no-title-limit" inset>
							<f7-list-item :title="source.repo.address"></f7-list-item>
						</f7-list>
						<div v-if="source.repo.mirrors.length">
							<f7-block-title>{{ $t('words.mirrors') }}</f7-block-title>
							<f7-block>
								<p>{{ $t('pages.source.mirrors') }}</p>
							</f7-block>
							<f7-list class="no-title-limit" inset>
								<f7-list-item :key="mirror" :title="mirror" v-for="mirror in source.repo.mirrors"></f7-list-item>
							</f7-list>
						</div>
						<f7-block-title>{{ $t('words.fingerprint') }}</f7-block-title>
						<f7-block>
							<p>{{ $t('pages.source.fingerprint') }}</p>
						</f7-block>
						<f7-list class="no-title-limit" inset>
							<f7-list-item :title="source.fingerprint.match(/.{1,2}/g).join(':').toUpperCase()" :header="$t('words.sha256')"></f7-list-item>
						</f7-list>
					</f7-accordion-content>
				</f7-list-item>
			</f7-list>
			<f7-list>
				<f7-list-item
					:footer="$tc('counts.apps', category.apps, {
					count: category.apps,
				})"
					:key="category.id"
					:link="`/sources/${encodeURIComponent(source.repo.address)}/categories/${encodeURIComponent(category.id)}/`"
					:title="category.title"
					v-for="category in categories"
				></f7-list-item>
			</f7-list>
		</div>
		<div v-else>
			<f7-list class="no-margin" media-list no-hairlines>
				<f7-list-item
					:footer="$t('pages.source.footer', {
						date: new Date().toLocaleDateString(),
						version: 1,
					})"
					subtitle="Lorem ipsum dolor sit amet, consetetur sadipscing elitr."
					class="no-subtitle-limit skeleton-text"
				>
					<f7-skeleton-block class="icon-60" slot="media"/>
				</f7-list-item>
			</f7-list>
			<f7-list>
				<f7-list-item
					:footer="$tc('counts.apps', 0, {
						count: 0,
					})"
					:key="index"
					title="Lorem ipsum."
					v-for="index in 5"
					class="skeleton-text"
				></f7-list-item>
			</f7-list>
		</div>
	</f7-page>
</template>
<script>
	import QRCode from 'qrcode';
	import {fetchAsset, share} from '../js/utils';

	export default {
		props: {
			sourceId: {
				type: String,
				required: true,
			},
		},
		data: function() {
			return {
				icon: null,
				qrcode: null,
				shareUrl: null,
			};
		},
		computed: {
			loading: function() {
				return this.$store.state.sources.loading;
			},
			source: function() {
				if(this.loading) {
					return null;
				}

				const source = this.$store.getters['sources/getItem'](this.sourceId);

				if(source) {
					this.shareUrl = `${this.$f7.data.url}${this.$f7.params.view.pushStateSeparator}${this.$f7router.generateUrl({
						name: 'source',
						params: {
							sourceId: encodeURIComponent(source.repo.address),
						},
					})}`;

					QRCode.toDataURL(this.shareUrl, {
						margin: 2,
						width: 240,
					}).then(url => {
						this.qrcode = url;
					});

					if(source.repo.icon) {
						fetchAsset(source.repo.icon, this.$store.state.settings.assetsAge).then(asset => {
							const img = new Image();

							img.src = asset.localUrl;
							img.onload = () => {
								this.icon = img.src;
							};
						});
					}
				} else if(!this.shareUrl) {
					this.$f7.dialog.confirm(this.$t('pages.source.add', {
						source: this.sourceId,
					}), () => this.$f7router.navigate(this.$f7router.generateUrl({
						path: '/sources/',
						query: {
							address: this.sourceId,
						},
					})), () => this.$f7router.back());
				}

				return source;
			},
			categories: function() {
				const categories = [];

				this.source.apps.forEach(app => {
					app.categories.forEach(category => {
						if(categories[category]) {
							categories[category].apps++;
						} else {
							const translation = this.$t(`pages.categories.official.${category}`);

							categories[category] = {
								id: category,
								title: translation.title ? translation.title : category,
								apps: 1,
							};
						}
					});
				});

				return Object.values(categories).sort((a, b) => a.title.localeCompare(b.title));
			},
		},
		methods: {
			submitShare: function() {
				const data = {
					title: this.$t('pages.source.share.title', {
						source: this.source.repo.name,
					}),
					text: this.$tc('pages.source.share.text', this.source.apps.length, {
						source: this.source.repo.name,
						apps: this.source.apps.length,
					}),
					url: this.shareUrl,
				};

				share(data).then(data => data && this.$f7.toast.show({
					text: this.$t(data),
				}));
			},
			submitRemove: function() {
				this.$f7.dialog.confirm(this.$t('pages.source.remove.before'), () => {
					this.$f7router.back();

					this.$store.dispatch('sources/remove', this.source).then(() => {
						this.$f7.toast.show({
							text: this.$t('pages.source.remove.after'),
						});
					});
				});
			},
		},
	};
</script>
