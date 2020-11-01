<template>
	<f7-popup class="popup-downloadapp">
		<f7-page>
			<f7-navbar :title="$t('popups.downloadApp.title')">
				<f7-nav-right>
					<f7-link popup-close>{{ $t('words.close') }}</f7-link>
				</f7-nav-right>
			</f7-navbar>
			<div class="timeline">
				<div class="timeline-item">
					<div class="timeline-item-date">{{ $t('words.step') }} #1</div>
					<div class="timeline-item-divider"></div>
					<div class="timeline-item-content">
						<div class="timeline-item-inner">
							<div class="timeline-item-title">{{ $t('words.download') }}</div>
							<div class="timeline-item-text">{{ $t('popups.downloadApp.steps.download.description') }}</div>
							<f7-button href="https://ablota.com/repo/Ablota_Store.apk" :text="$t('words.download')" fill raised></f7-button>
						</div>
					</div>
				</div>
				<div class="timeline-item">
					<div class="timeline-item-date">{{ $t('words.step') }} #2</div>
					<div class="timeline-item-divider"></div>
					<div class="timeline-item-content">
						<div class="timeline-item-inner">
							<div class="timeline-item-title">{{ $t('popups.downloadApp.steps.unknownSources.title') }}</div>
							<div class="timeline-item-text">{{ $t('popups.downloadApp.steps.unknownSources.description') }}</div>
						</div>
					</div>
				</div>
				<div class="timeline-item">
					<div class="timeline-item-date">{{ $t('words.step') }} #3</div>
					<div class="timeline-item-divider"></div>
					<div class="timeline-item-content">
						<div class="timeline-item-inner">
							<div class="timeline-item-title">{{ $t('popups.downloadApp.steps.openInstall.title') }}</div>
							<div class="timeline-item-text">{{ $t('popups.downloadApp.steps.openInstall.description') }}</div>
						</div>
					</div>
				</div>
				<div class="timeline-item">
					<div class="timeline-item-date">{{ $t('words.step') }} #4</div>
					<div class="timeline-item-divider"></div>
					<div class="timeline-item-content">
						<div class="timeline-item-inner">
							<div class="timeline-item-title">{{ $t('words.done') }}</div>
							<div class="timeline-item-text">{{ $t('popups.downloadApp.steps.done.description') }}</div>
							<f7-button href="https://store.ablota.com" :text="$t('words.launch')" fill raised></f7-button>
						</div>
					</div>
				</div>
			</div>
		</f7-page>
	</f7-popup>
</template>
