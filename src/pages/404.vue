<template>
	<f7-page name="404">
		<f7-navbar :back-link="$t('words.back')">
			<f7-nav-title>{{ $t('pages.404.title') }}</f7-nav-title>
		</f7-navbar>
		<div class="display-flex justify-content-center align-items-center height-100">
			<f7-block>
				<f7-icon aurora="f7:exclamationmark_circle" class="display-block" ios="f7:exclamationmark_circle" md="material:error_outline" size="100"/>
			</f7-block>
			<f7-block>
				<p>{{ $t('pages.404.description') }}</p>
				<f7-button :text="$t('words.back')" back outline raised/>
			</f7-block>
		</div>
	</f7-page>
</template>
