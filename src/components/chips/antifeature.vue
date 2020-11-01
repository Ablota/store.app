<template>
	<span>
		<f7-chip
			v-if="$t(`lists.antiFeatures.${name}`)"
			:data-popover="`.popover-antifeatures-${name}`"
			:text="$t(`lists.antiFeatures.${name}.title`)"
			class="popover-open"
			media-bg-color="orange"
		>
			<f7-icon slot="media" aurora="f7:exclamationmark_triangle" ios="f7:exclamationmark_triangle" md="material:warning"></f7-icon>
		</f7-chip>
		<f7-chip v-else :text="name" media-bg-color="orange">
			<f7-icon slot="media" aurora="f7:exclamationmark_triangle" ios="f7:exclamationmark_triangle" md="material:warning"></f7-icon>
		</f7-chip>
	</span>
</template>
<script>
export default {
	props: {
		name: {
			type: String,
			required: true,
		},
	},
};
</script>
