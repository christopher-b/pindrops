<script lang="ts">
	import { get } from 'svelte/store'
	import { isLoading as isAuthLoading, init as authInit, error as authError, isAuthenticated } from '$lib/stores/auth.ts'
  import { pinStore } from '$lib/stores/pins.ts'
  import { mapOptions } from '$lib/mapOptions.ts'

  import Loading from '$lib/components/Loading.svelte'
  import LoginForm from '$lib/components/LoginForm.svelte'
  import NavBar from '$lib/components/NavBar.svelte'
	// import Pin from '$lib/components/Pin.svelte'

  import Map from '$lib/components/map/Map.svelte'
  import Control from '$lib/components/map/Control.svelte'
  import Marker from '$lib/components/map/Marker.svelte'
  import Popup from '$lib/components/map/Popup.svelte'

  import { Icon } from 'leaflet'
	import pinSvg from '$lib/assets/pin.svg'
	pinStore.addPin("test", {
		id:123, lat: 25, lng: -40, label: "TEST"
	})
	const icon = new Icon({
		iconUrl: pinSvg,
		iconSize: [35, 35]
	})

  $effect(() => {
    authInit()
  })
</script>

{#if $isAuthLoading}
  <div class="center">
    <Loading />
  </div>
{:else if $authError}
  <p class="error">{$authError}</p>
{:else if !$isAuthenticated}
  <LoginForm />
{/if}

<Map {...mapOptions}>
  <Control position="topright">
    {#if !$isAuthLoading && $isAuthenticated}
      <NavBar/>
    {/if}
  </Control>

  {#each get(pinStore.pins) as pin (pin.id)}
    <Marker lat={pin.lat} lng={pin.lng} {icon}>
      <Popup>
        This is a test
      </Popup>
    </Marker>
  {/each}
</Map>

<style>
	.error {
		color: #d32f2f;
		font-weight: 500;
	}
  .center {
    margin: auto 0;
    text-align: center;
  }
</style>
