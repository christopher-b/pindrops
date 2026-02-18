<script lang="ts">
	import { onMount } from 'svelte';
	import {
		isLoading as isAuthLoading,
		init as authInit,
		isAuthenticated,
		did
	} from '$lib/stores/auth.ts';
	import { pinStore } from '$lib/stores/pins.ts';
	import { mapOptions } from '$lib/mapOptions.ts';

	import MapView from '$lib/components/map/MapView.svelte';
	import Control from '$lib/components/map/Control.svelte';
	import NavBar from '$lib/components/NavBar.svelte';
	import Authentication from '$lib/components/Authentication.svelte';
	import PinMarker from '$lib/components/PinMarker.svelte';
	import NewPin from '$lib/components/NewPin.svelte';

	const pins = pinStore.pins;

	onMount(authInit);

	$effect(() => {
		if ($isAuthenticated && $did) {
			pinStore.fetchPins($did);
		}
	});
</script>

<Authentication />

<MapView {...mapOptions}>
	{#if !$isAuthLoading && $isAuthenticated}
		<Control position="topright">
			<NavBar />
		</Control>
	{/if}

	{#each $pins as pin (pin.id)}
		<PinMarker {pin} />
	{/each}

	<NewPin />
</MapView>
