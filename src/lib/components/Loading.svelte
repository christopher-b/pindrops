<script lang="ts">
	import compassSvg from '$lib/assets/compass.svg';

	interface Props {
		size?: string;
	}

	let { size = '48px' }: Props = $props();
</script>

<img src={compassSvg} alt="Loading..." class="spin" style="width: {size}; height: {size};" />
