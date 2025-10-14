<script lang="ts">
  import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/auth.svelte';
	import type { LeafletMouseEvent, MapOptions, TileLayerOptions } from 'leaflet';
	import { Map, Icon, LatLng, Marker, Point, Popup, TileLayer } from 'leaflet';
	import 'leaflet/dist/leaflet.css';
	import pin from '$lib/assets/pin.svg';

	// "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.{ext}",
	// "https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}.{ext}",
	// "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.{ext}";

  let mapContainer;
  let pinFormTemplate;
	const origin = new LatLng(25, -40);
	const tilesUrl = 'https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.{ext}';
	const mapOptions: MapOptions = {
		center: origin,
		zoom: 3
	};
	const pinIcon = new Icon({
		iconUrl: pin,
		iconSize: [35, 35]
	});
	const popupOffset = new Point(0, 0);
	const tileOptions: TileLayerOptions & { ext: string } = {
		minZoom: 1,
		maxZoom: 16,
		attribution:
			'&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		ext: 'jpg'
	};
	// const popupTemplate: string = `
	//    <div>
	//      <p>Click to remove this marker</p>
	//      <button style="padding: 5px 10px; cursor: pointer;">Remove</button>
	//    </div>
	//  `;

  onMount(() => {
		const map = new Map(mapContainer, mapOptions);
		new TileLayer(tilesUrl, tileOptions).addTo(map);

	  if (authStore.isAuthenticated) {
		  map.on('click', onClick);
    }
  })

	// function onMapClick(e: LeafletMouseEvent) {
	//   const map = e.target;
	//   const marker = new Marker(e.latlng, { icon: pinIcon });
	//   const popupContent = document.createElement("div");
	//   const button = popupContent.querySelector("button");
	//
	//   popupContent.innerHTML = popupTemplate;
	//
	//   button?.addEventListener("click", () => {
	//     marker.remove();
	//   });
	//
	//   marker.addTo(map);
	//
	//   const popup = new Popup({
	//     offset: popupOffset,
	//     content: popupContent,
	//   });
	//
	//   marker.bindPopup(popup).openPopup();
	// }

	function onClick(event: LeafletMouseEvent) {
		const pinForm = pinFormTemplate.content.cloneNode(true) as DocumentFragment;
		const container = document.createElement('div');
		container.appendChild(pinForm);

		const form = container.querySelector('form');
		form?.addEventListener('submit', (e) => {
			e.preventDefault();
			const formData = new FormData(form);
			const data = Object.fromEntries(formData.entries());
		});

		const popup = new Popup({
			offset: popupOffset,
			content: container
		});

		popup.setLatLng(event.latlng).openOn(event.target);
	}
</script>

<map bind:this={mapContainer}></map>

<template bind:this={pinFormTemplate} id="pin-form-template">
  <form id="addPinForm">
    <label for="label">Label</label>
    <input type="text" name="label" id="label" />
    <input type="submit" value="Add Pin" />
  </form>
</template>

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

