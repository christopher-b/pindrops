<script lang="ts">
	import compassSvg from '$lib/assets/compass.svg';

	interface Props {
		size?: string;
	}

	let { size = '48px' }: Props = $props();
</script>

<div class="loading-container" style="width: {size}; height: {size};">
	<img src={compassSvg} alt="Loading..." class="spin" style="width: {size}; height: {size};" />
</div>

<style>
	.loading-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.spin {
		animation: spin 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
		opacity: 0.6;
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
