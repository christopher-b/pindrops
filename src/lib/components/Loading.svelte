<script lang="ts">
	import compassSvg from '$lib/assets/compass.svg';

	interface Props {
		size?: string;
	}

	let { size = '48px' }: Props = $props();
</script>

<div class="loading-indicator">
	<img src={compassSvg} alt="Loading..." class="spinner" style="width: {size}; height: {size};" />
</div>

<style>
	.spinner {
		animation: spin 2s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
</style>
