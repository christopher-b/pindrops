<script lang="ts">
	// Ref: https://imfeld.dev/writing/svelte_domless_components
	import 'leaflet/dist/leaflet.css';
	import type { Snippet } from 'svelte';
	import type { MapOptions, TileLayerOptions, LeafletEventHandlerFn } from 'leaflet';
	import { setContext, onMount } from 'svelte';
	import { Map as LeafletMap, TileLayer } from 'leaflet';

	interface Props {
		children: Snippet;
		onclick?: LeafletEventHandlerFn;
		tilesUrl: string;
		mapOptions: MapOptions;
		tileOptions: TileLayerOptions;
	}

	let { children, onclick, tilesUrl, mapOptions, tileOptions }: Props = $props();
	let el: Element;
	let map: LeafletMap | null = $state(null);

	setContext('map', () => map);

	onMount(() => {
		map = new LeafletMap(el as HTMLElement, mapOptions);
		new TileLayer(tilesUrl, tileOptions).addTo(map);
		if (onclick) map.on('click', onclick);

		return () => {
			if (map) map.remove();
		};
	});
</script>

<map bind:this={el}>
	{#if map}
		{@render children?.()}
	{/if}
</map>

<style>
	map {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		z-index: 0;
	}
</style>
