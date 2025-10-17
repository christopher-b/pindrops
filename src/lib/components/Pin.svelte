<script lang="ts">
  import { getContext } from 'svelte';
	import { Marker, Icon } from 'leaflet'
	import pinSvg from '$lib/assets/pin.svg'

	let { children, pin } = $props()
  let marker
  const map = getContext('map')()
	const pinIcon = new Icon({
		iconUrl: pinSvg,
		iconSize: [35, 35]
	})

  // const layerGroup = getContext('layerGroup')();
  // setContext('layer', () => marker);

  function leafletMarker(_node) {
    marker = new Marker([pin.lat, pin.lng], { icon: pinIcon })
		marker.addTo(map)

    return {
      destroy() {
        if (marker) {
          marker.remove();
          marker = undefined;
        }
      }
    }
  }

	// $effect(() => {
	// 	if(marker && map) {
	// 		marker.addTo(map)
	// 	}
	// })

	// const popupContent = document.createElement("div")
	// popupContent.innerHTML = popupTemplate
	// const button = popupContent.querySelector("button")
	//
	// console.log(button)
	// button?.addEventListener("click", () => {
	//   console.log(marker)
	//   marker.remove()
	// })
	//
	// marker.addTo(map)
	//
	// const popup = new Popup({
	//   offset: popupOffset,
	//   content: popupContent,
	// })
	//
	// marker.bindPopup(popup).openPopup()

</script>

<div class="hidden">
  <div {@attach leafletMarker}>
    {#if marker}
    	{@render children?.()}
    {/if}
  </div>
</div>

