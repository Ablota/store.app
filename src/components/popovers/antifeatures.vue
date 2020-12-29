<template>
	<div class="popover-antifeatures">
		<f7-popover v-for="(antiFeature, key) in $t('lists.antiFeatures')" :key="key" :class="`popover-antifeatures-${key}`">
			<f7-block><p>{{ antiFeature.description }}</p></f7-block>
			<f7-list>
				<f7-list-item :footer="antiFeature.key" :link="`https://f-droid.org/docs/Anti-Features/#${key}`" :title="$t('words.more')" external popover-close target="_system">
					<f7-icon slot="media" aurora="f7:link" ios="f7:link" md="material:link"></f7-icon>
				</f7-list-item>
			</f7-list>
		</f7-popover>
	</div>
</template>
