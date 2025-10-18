<script lang="ts">
  import { getContext } from 'svelte';
  import Marker from '$lib/components/map/Marker.svelte'
  import Popup from '$lib/components/map/Popup.svelte'
  import { Icon } from 'leaflet'
	import pinSvg from '$lib/assets/pin.svg'

  const map = getContext('map')()
	const icon = new Icon({
		iconUrl: pinSvg,
		iconSize: [35, 35]
	})
  let showSelf = $state(false)
  let lat = $state(0)
  let lng = $state(0)

  map.on('click', (event) => {
    console.log(event)
    showSelf = !showSelf
    lat = event.latlng.lat
    lng = event.latlng.lng
  })
</script>

{#if showSelf}
  <Marker {icon} {lat} {lng}>
    <Popup open={true} closeButton={false}>
      Test contnet
    </Popup>
  </Marker>
{/if}

