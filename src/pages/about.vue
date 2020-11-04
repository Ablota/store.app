<template>
	<f7-panel left cover swipe swipeOnlyClose>
		<f7-view>
			<f7-page name="about">
				<f7-list accordion-list class="no-margin" no-hairlines>
					<f7-list-item
						accordion-item :footer="$t('pages.about.version', {version: $f7.params.version})" :title="$t('app.name')"
					>
						<img src="static/icons/favicon.png" alt="" slot="media" class="icon-50"/>
						<f7-block>{{ $t('pages.about.slogan') }}</f7-block>
						<f7-accordion-content>
							<f7-block>
								<p v-for="paragraph in $t('pages.about.description')">{{paragraph}}</p>
							</f7-block>
						</f7-accordion-content>
					</f7-list-item>
				</f7-list>
				<f7-block-title>{{ $t('words.socialMedia') }}</f7-block-title>
				<f7-list>
					<f7-list-item footer="@Ablota_com" link="https://mastodon.online/@Ablota_com" :title="$t('words.mastodon')" external target="_system">
						<img src="static/images/logos/mastodon.svg" slot="media" alt="" class="icon-30" />
					</f7-list-item>
					<f7-list-item footer="@Ablota_com" link="https://twitter.com/Ablota_com" :title="$t('words.twitter')" external target="_system">
						<img src="static/images/logos/twitter.png" slot="media" alt="" class="icon-30" />
					</f7-list-item>
					<f7-list-item footer="r/Ablota" link="https://reddit.com/r/Ablota" :title="$t('words.reddit')" external target="_system">
						<img src="static/images/logos/reddit.png" slot="media" alt="" class="icon-30" />
					</f7-list-item>
				</f7-list>
				<f7-block-title>{{ $t('words.donate') }}</f7-block-title>
				<f7-list>
					<f7-list-item link="https://liberapay.com/Ablota_com" :title="$t('words.liberapay')" external target="_system">
						<img src="static/images/logos/liberapay.svg" slot="media" alt="" class="icon-30" />
					</f7-list-item>
					<f7-list-item link="https://opencollective.com/Ablota_com" :title="$t('words.openCollective')" external target="_system">
						<img src="static/images/logos/opencollective.svg" slot="media" alt="" class="icon-30" />
					</f7-list-item>
				</f7-list>
				<f7-block>
					<p v-html="$t('pages.about.trademark')" />
				</f7-block>
			</f7-page>
		</f7-view>
	</f7-panel>
</template>
<script>
	export default {};
</script>
