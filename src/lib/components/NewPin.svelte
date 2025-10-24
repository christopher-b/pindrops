<script lang="ts">
	import type { Map as LeafletMap, Icon as LeafletIcon, LeafletMouseEvent } from 'leaflet';
	import { getContext } from 'svelte';
	import Marker from '$lib/components/map/Marker.svelte';
	import Popup from '$lib/components/map/Popup.svelte';
	import PinForm from '$lib/components/PinForm.svelte';
	import { Icon } from 'leaflet';
	import pinSvg from '$lib/assets/pin.svg';

	const map: LeafletMap = getContext<() => LeafletMap>('map')();
	const icon: LeafletIcon = new Icon({
		iconUrl: pinSvg,
		iconSize: [35, 35]
	});
	let showSelf = $state(false);
	let lat = $state(0);
	let lng = $state(0);

	$effect(() => {
		if (!map) return;

		const handleClick = (event: LeafletMouseEvent) => {
			showSelf = !showSelf;
			lat = event.latlng.lat;
			lng = event.latlng.lng;
		};

		map.on('click', handleClick);

		return () => {
			map.off('click', handleClick);
		};
	});
</script>

{#if showSelf}
	<Marker {icon} {lat} {lng}>
		<Popup open={true} closeButton={false}>
			<PinForm lat={String(lat)} lng={String(lng)} />
		</Popup>
	</Marker>
{/if}
