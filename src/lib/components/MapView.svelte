<script lang="ts">
  import { mount, onMount } from 'svelte'
	import { isAuthenticated, did } from '$lib/stores/auth.ts';
  import { pinStore } from '$lib/stores/pins.ts'
  import type { Pin } from '$lib/stores/pins.ts'
	import pin from '$lib/assets/pin.svg'
  import PinForm from '$lib/components/PinForm.svelte'
	import { Map, Icon, LatLng, Marker, Point, Popup, TileLayer } from 'leaflet'
	import type { LeafletMouseEvent, MapOptions, TileLayerOptions } from 'leaflet'
	import 'leaflet/dist/leaflet.css'

	// "https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.{ext}",
	// "https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}.{ext}",
	// "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.{ext}"

  let mapContainer
  let map: Map
	const origin = new LatLng(25, -40)
	const tilesUrl = 'https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.{ext}'
	const mapOptions: MapOptions = {
		center: origin,
		zoom: 3
	}
	const pinIcon = new Icon({
		iconUrl: pin,
		iconSize: [35, 35]
	})
	const popupOffset = new Point(0, 0)
	const tileOptions: TileLayerOptions & { ext: string } = {
		minZoom: 1,
		maxZoom: 16,
		attribution:
			'&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		ext: 'jpg'
	}

  onMount(() => {
		map = new Map(mapContainer, mapOptions)
		new TileLayer(tilesUrl, tileOptions).addTo(map)

    // Load existing pins from persistence
    // await pinStore.fetchPins($did)
  })

  $effect(() => {
    if(!map) return
    // Attach click handler if we're logged in
    if(isAuthenticated) {
      map.on('click', onClick)
      // if($did) {
      //   pinStore.fetchPins()
      // }
    }
      else {
    map.off('click')
    }
  })

	function onClick(event: LeafletMouseEvent) {
		const container = document.createElement('div')
		const popup = new Popup({
			offset: popupOffset,
			content: container
		})
    mount(PinForm, {
      target: container,
      props: {
        onsubmit: (e) => {
          e.preventDefault()
          popup.close()
          onPinFormSubmit(e)
        },
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      }
    })

		popup.setLatLng(event.latlng).openOn(event.target)
	}

  function onPinFormSubmit(event){
		const formData = new FormData(event.target)
		const data = Object.fromEntries(formData.entries())
    const pin:Pin = {
      lat: data.lat,
      lng: data.lng,
      label: data.label
    }
    pinStore.addPin($did, pin)
  }
  pinStore.pins.subscribe((value) =>{
    const popupTemplate: string = `
       <div>
         <p>Click to remove this marker</p>
         <button style="padding: 5px 10px; cursor: pointer;">Remove</button>
       </div>
    `
    value.forEach((pin) => {
      const marker = new Marker([pin.lat, pin.lng], { icon: pinIcon })
      const popupContent = document.createElement("div")
      popupContent.innerHTML = popupTemplate
      const button = popupContent.querySelector("button")

      console.log(button)
      button?.addEventListener("click", () => {
        console.log(marker)
        marker.remove()
      })

      marker.addTo(map)

      const popup = new Popup({
        offset: popupOffset,
        content: popupContent,
      })

      marker.bindPopup(popup).openPopup()

    })
  })
</script>

<map bind:this={mapContainer}></map>

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

