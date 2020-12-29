<template>
	<f7-panel cover left swipe swipeOnlyClose>
		<f7-view>
			<f7-page name="about">
				<f7-list accordion-list class="no-margin" no-hairlines>
					<f7-list-item
						:footer="$t('pages.about.version', {version: $f7.params.version})" :title="$t('app.name')" accordion-item
					>
						<img slot="media" alt="" class="icon-50" src="static/icons/favicon.png"/>
						<f7-block>{{ $t('pages.about.slogan') }}</f7-block>
						<f7-accordion-content>
							<f7-block>
								<p v-for="paragraph in $t('pages.about.description')">{{ paragraph }}</p>
							</f7-block>
						</f7-accordion-content>
					</f7-list-item>
				</f7-list>
				<f7-block-title>{{ $t('words.socialMedia') }}</f7-block-title>
				<f7-list>
					<f7-list-item :title="$t('words.mastodon')" external footer="@Ablota_com" link="https://mastodon.online/@Ablota_com" target="_system">
						<img slot="media" alt="" class="icon-30" src="static/images/logos/mastodon.svg"/>
					</f7-list-item>
					<f7-list-item :title="$t('words.twitter')" external footer="@Ablota_com" link="https://twitter.com/Ablota_com" target="_system">
						<img slot="media" alt="" class="icon-30" src="static/images/logos/twitter.png"/>
					</f7-list-item>
					<f7-list-item :title="$t('words.reddit')" external footer="r/Ablota" link="https://reddit.com/r/Ablota" target="_system">
						<img slot="media" alt="" class="icon-30" src="static/images/logos/reddit.png"/>
					</f7-list-item>
				</f7-list>
				<f7-block-title>{{ $t('words.donate') }}</f7-block-title>
				<f7-list>
					<f7-list-item :title="$t('words.liberapay')" external link="https://liberapay.com/Ablota_com" target="_system">
						<img slot="media" alt="" class="icon-30" src="static/images/logos/liberapay.svg"/>
					</f7-list-item>
					<f7-list-item :title="$t('words.openCollective')" external link="https://opencollective.com/Ablota_com" target="_system">
						<img slot="media" alt="" class="icon-30" src="static/images/logos/opencollective.svg"/>
					</f7-list-item>
				</f7-list>
				<f7-block>
					<p v-html="$t('pages.about.trademark')"/>
				</f7-block>
			</f7-page>
		</f7-view>
	</f7-panel>
</template>
<script>
export default {};
</script>
