<script lang="ts">
	import { Icon } from 'leaflet';
	import pinSvg from '$lib/assets/pin.svg';
	import { pinStore } from '$lib/stores/pins.ts';
	import { did } from '$lib/stores/auth.ts';
	import Marker from '$lib/components/map/Marker.svelte';
	import Popup from '$lib/components/map/Popup.svelte';

	let { pin } = $props();
	let loading = $state(false);
	const icon = new Icon({
		iconUrl: pinSvg,
		iconSize: [35, 35]
	});

	const onclick = async () => {
		if (!$did) return;

		loading = true;
		await pinStore.removePin($did, pin.id);
		loading = false;
	};
</script>

<Marker lat={pin.lat} lng={pin.lng} {icon}>
	<Popup open={false}>
		{pin.label}
		<form>
			<button {onclick}>
				{#if loading}
					Deleting...
				{:else}
					Delete Pin
				{/if}
			</button>
		</form>
	</Popup>
</Marker>
