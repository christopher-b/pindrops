<script lang="ts">
	import { get } from 'svelte/store'
	import { isLoading as isAuthLoading, init as authInit, isAuthenticated } from '$lib/stores/auth.ts'
  import { pinStore } from '$lib/stores/pins.ts'
  import { mapOptions } from '$lib/mapOptions.ts'

  import Map from '$lib/components/map/Map.svelte'
  import Control from '$lib/components/map/Control.svelte'
  import NavBar from '$lib/components/NavBar.svelte'
  import Authentication from '$lib/components/Authentication.svelte'
  import PinMarker from '$lib/components/PinMarker.svelte'

  const pins = pinStore.pins

	pinStore.addPin("test", {
		id:123, lat: 25, lng: -40, label: "TEST"
	})

  $effect(() => {
    authInit()
  })

  const onclick = function(event) {
    // const {lat, lng} = event.latlng

    pinStore.addPin("test", {
      id: Math.floor(Math.random()*10000000),
      label: "new pin",
      lat: event.latlng.lat,
      lng: event.latlng.lng
    })

    console.log(get(pinStore.pins))
  }
</script>

<Authentication />

<Map {...mapOptions} {onclick}>
  <Control position="topright">
    {#if !$isAuthLoading && $isAuthenticated}
      <NavBar/>
    {/if}
  </Control>

  {#each $pins as pin (pin.id)}
    <PinMarker {pin} />
  {/each}
</Map>

