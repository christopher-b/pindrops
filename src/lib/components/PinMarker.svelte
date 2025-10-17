<script lang="ts">
  import Marker from '$lib/components/map/Marker.svelte'
  import Popup from '$lib/components/map/Popup.svelte'
  import { Icon } from 'leaflet'
	import pinSvg from '$lib/assets/pin.svg'

	let {  pin } = $props()
	const icon = new Icon({
		iconUrl: pinSvg,
		iconSize: [35, 35]
	})

  console.log(pin)

</script>

<Marker lat={pin.lat} lng={pin.lng} {icon}>
  <Popup>
    {pin.label}
  </Popup>
</Marker>

