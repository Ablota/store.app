<template>
	<f7-page name="sources" ptr @ptr:refresh="reload">
		<f7-fab slot="fixed" @click="openAdd">
			<f7-icon aurora="f7:plus" ios="f7:plus" md="material:add"></f7-icon>
		</f7-fab>
		<f7-popup class="popup-sources-add" swipe-to-close>
			<f7-page>
				<f7-navbar :title="$t('pages.sources.add.title')">
					<f7-nav-right>
						<f7-link popup-close v-if="!add.loading">{{ $t('words.close') }}</f7-link>
					</f7-nav-right>
				</f7-navbar>
				<f7-progressbar infinite color="multi" v-if="add.loading"></f7-progressbar>
				<f7-block-title>{{ $t('words.description') }}</f7-block-title>
				<f7-block>
					<p>{{ $t('pages.sources.add.description') }}</p>
				</f7-block>
				<f7-list no-hairlines-md>
					<f7-list-input
						:label="$t('words.address')"
						type="url"
						:placeholder="$f7.data.url"
						:value="add.address"
						@input="add.address = $event.target.value"
						clear-button
						validate-on-blur
						:error-message="$t('validations.url')"
						:error-message-force="add.error"
					/>
					<f7-list-input
						:label="`${$t('words.fingerprint')} (${$t('words.optional')})`"
						type="text"
						placeholder="ADC4F67B9025112CE9DF69BA11396D8616EDAA2AFF2A5D15142AD1E43EFA6DEE"
						:value="add.fingerprint"
						@input="add.fingerprint = $event.target.value"
						clear-button
						validate-on-blur
						:error-message="$t('validations.text')"
						:error-message-force="add.error"
					/>
				</f7-list>
				<f7-block>
					<f7-button :text="$t('words.add')" fill raised :disabled="loading || add.loading" @click="submitAdd" />
				</f7-block>
				<f7-block-title>{{ $t('words.suggestions') }}</f7-block-title>
				<f7-list>
					<f7-list-item
						:footer="$t('pages.sources.add.suggestions.f-droid.description')"
						:title="$t('pages.sources.add.suggestions.f-droid.title')"
						link
						@click="add.address = 'https://f-droid.org/repo/'; add.fingerprint = '43238D512C1E5EB2D6569F4A3AFBF5523418B82E0A3ED1552770ABB9A9C9CCAB'; submitAdd();"
					/>
					<f7-list-item
						:footer="$t('pages.sources.add.suggestions.izzyOnDroid.description')"
						:title="$t('pages.sources.add.suggestions.izzyOnDroid.title')"
						link
						@click="add.address = 'https://apt.izzysoft.de/fdroid/repo/'; add.fingerprint = '3BF0D6ABFEAE2F401707B6D966BE743BF0EEE49C2561B9BA39073711F628937A'; submitAdd();"
					/>
					<f7-list-item
						:footer="$t('pages.sources.add.suggestions.bitwarden.description')"
						:title="$t('pages.sources.add.suggestions.bitwarden.title')"
						link
						@click="add.address = 'https://mobileapp.bitwarden.com/fdroid/repo/'; add.fingerprint = 'BC54EA6FD1CD5175BCCCC47C561C5726E1C3ED7E686B6DB4B18BAC843A3EFE6C'; submitAdd();"
					/>
				</f7-list>
			</f7-page>
		</f7-popup>

		<f7-list media-list>
			<f7-list-item
				:key="index"
				class="skeleton-text"
				footer="Lorem ipsum dolor sit amet."
				text="Lorem ipsum dolor sit amet, consetetur sadipscing elitr."
				title="Lorem ipsum dolor sit amet."
				v-for="index in 5"
				v-if="loading"
			>
				<f7-skeleton-block class="icon-60" slot="media"/>
			</f7-list-item>
			<f7-list-item
				:footer="$tc('counts.apps', source.apps.length, {
					count: source.apps.length,
				})"
				:key="source.repo.address"
				:link="`/sources/${encodeURIComponent(source.repo.address)}/`"
				:text="source.repo.description"
				:title="source.repo.name"
				:swipeout="!source.system"
				@swipeout:deleted="() => submitRemove(source.repo.address, source.fingerprint)"
				v-for="(source, index) in sources"
				v-if="!loading"
			>
				<img :src="icons[source.repo.icon]" alt="" slot="media" class="icon-60" v-if="icons[source.repo.icon]"/>
				<f7-skeleton-block class="icon-60" slot="media" v-if="source.repo.icon && !icons[source.repo.icon]"></f7-skeleton-block>
				<f7-swipeout-actions right>
					<f7-swipeout-button :confirm-text="$t('pages.source.remove.before')" delete overswipe>{{ $t('words.remove') }}</f7-swipeout-button>
				</f7-swipeout-actions>
			</f7-list-item>
		</f7-list>
	</f7-page>
</template>
<script>
	import Device from 'framework7/utils/device';
	import Joi from '@hapi/joi';
	import {fetchIcons} from '../js/utils';

	export default {
		data: function() {
			return {
				icons: {},
				add: {
					loading: false,
					address: null,
					fingerprint: null,
					error: false,
				},
			}
		},
		computed: {
			loading: function() {
				return this.$store.state.sources.loading;
			},
			sources: function() {
				if(this.loading) {
					return [];
				}

				return this.$store.state.sources.items.concat().sort((a, b) => a.repo.name.localeCompare(b.repo.name));
			},
		},
		watch: {
			sources: {
				handler: function(sources) {
					if(sources.length) this.fetchIcons();
				},
				immediate: true,
			},
		},
		methods: {
			reload: function(done) {
				this.$store.dispatch('sources/load', {
					server: this.$f7.data.server,
					sourceAge: 0,
					warningCallback: (error, payload = {}) => this.$f7.dialog.alert(this.$t(error, payload)),
				});

				done();
			},
			openAdd: function() {
				this.$f7.popup.open('.popup-sources-add');
			},
			submitAdd: function() {
				this.add.loading = true;
				this.add.error = false;

				this.validateAdd(this.add.address, this.add.fingerprint).then(source => {
					this.$store.dispatch('sources/add', {
						address: source.address,
						fingerprint: source.fingerprint,
						server: this.$f7.data.server,
						sourceAge: this.$store.state.settings.sourceAge,
					}).then(() => {
						this.add.loading = false;
						this.add.address = null;
						this.add.fingerprint = null;

						this.$f7.popup.close('.popup-sources-add');
					}).catch(error => {
						this.add.loading = false;

						this.$f7.dialog.alert(this.$t(error));
					});
				}).catch(() => {
					this.add.loading = false;
					this.add.error = true;
				});
			},
			validateAdd: function(address, fingerprint) {
				return new Promise((resolve, reject) => {
					Joi.object({
						address: Joi.string().trim().uri({
							scheme: ['http', 'https'],
						}).required(),
						fingerprint: Joi.string().trim().failover(null).optional(),
					}).required().validateAsync({
						address,
						fingerprint,
					}).then(source => {
						const addressUrl = new URL(source.address);
						const addressQuery = this.$utils.parseUrlQuery(source.address);

						source.address = 'https://' + addressUrl.host + addressUrl.pathname;

						if(addressQuery.fingerprint && !source.fingerprint) {
							source.fingerprint = addressQuery.fingerprint;
						}

						resolve(source);
					}).catch(() => {
						reject();
					});
				});
			},
			submitRemove: function(address, fingerprint) {
				this.$store.dispatch('sources/remove', {fingerprint}).then(() => {
					this.$f7.toast.show({
						text: this.$t('pages.source.remove.after'),
						closeButtonText: this.$t('words.undo'),
						on: {
							closeButtonClick: () => {
								this.add.address = address;
								this.add.fingerprint = fingerprint;

								this.submitAdd();
							},
						},
					});
				});
			},
			fetchIcons: function() {
				fetchIcons(this.sources.map(source => source.repo), this.icons, this.$store.state.settings.assetsAge).then(icons => {
					this.icons = {
						...this.icons,
						...icons,
					};
				});
			},
		},
		mounted: function() {
			this.$f7ready(() => {
				if(this.$f7route.query.address) {
					this.add.address = this.$f7route.query.address;
					this.add.fingerprint = this.$f7route.query.fingerprint;

					this.openAdd();
				} else {
					if(Device.cordova) {
						cordova.plugins.clipboard.paste(text => {
							this.validateAdd(text, null).then(source => {
								this.add.address = source.address;
								this.add.fingerprint = source.fingerprint;
							}).catch(() => null);
						});
					} else {
						navigator.clipboard.readText().then(text => {
							this.validateAdd(text, null).then(source => {
								this.add.address = source.address;
								this.add.fingerprint = source.fingerprint;
							}).catch(() => null);
						}).catch(() => null);
					}
				}
			});
		},
	};
</script>