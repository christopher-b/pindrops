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

	pinStore.addPin("test", {
		id:123, lat: 25, lng: -40, label: "TEST"
	})

  $effect(() => {
    authInit()
  })
</script>

<Authentication />

<Map {...mapOptions}>
  <Control position="topright">
    {#if !$isAuthLoading && $isAuthenticated}
      <NavBar/>
    {/if}
  </Control>

  {#each get(pinStore.pins) as pin (pin.id)}
    <PinMarker {pin} />
  {/each}
</Map>

