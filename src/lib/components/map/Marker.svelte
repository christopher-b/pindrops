<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Map as LeafletMap, Marker as LeafletMarker, Icon } from 'leaflet';
	import { getContext, setContext, onMount } from 'svelte';
	import { Marker } from 'leaflet';

	interface Props {
		children: Snippet;
		lat: number;
		lng: number;
		icon: Icon;
	}

	let { children, lat, lng, icon }: Props = $props();
	let el: SVGMarkerElement;
	let marker: LeafletMarker | null = $state(null);

	const map: LeafletMap = getContext<() => LeafletMap>('map')();
	setContext('markerContext', () => marker);

	onMount(() => {
		marker = new Marker([lat, lng], { icon });
		marker.addTo(map);

		return () => {
			if (marker) {
				marker.remove();
			}
		};
	});
</script>

<marker bind:this={el}>
	{#if marker}
		{@render children?.()}
	{/if}
</marker>
