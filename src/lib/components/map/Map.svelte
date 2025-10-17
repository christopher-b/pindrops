<script lang="ts">
  import { setContext } from 'svelte';
	import { Map, TileLayer, LatLng } from 'leaflet'
	import type { MapOptions, TileLayerOptions } from 'leaflet'
	import 'leaflet/dist/leaflet.css'

  let { children, onclick, tilesUrl, centerLat, centerLng, zoom, minZoom, attribution } = $props();
  let map: Map = $state(null)
  const center = new LatLng(centerLat, centerLng)
	const mapOptions: MapOptions = { center, zoom, minZoom }
	const tileOptions: TileLayerOptions & { ext: string } = { attribution, ext: 'jpg' }

	const getMap = () => map;
	setContext('map', getMap);

	function leafletMap(node) {
		if(map) return

		map = new Map(node, mapOptions)
    map.on('click', onclick)
		new TileLayer(tilesUrl, tileOptions).addTo(map)

    return {
      destroy() {
        map.remove();
        map = undefined;
      }
    }
  }
</script>

<map {@attach leafletMap}>
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
  z-index: -1000;
}
</style>

