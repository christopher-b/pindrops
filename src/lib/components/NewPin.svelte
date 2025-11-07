<script lang="ts">
	import type {
		Map as LeafletMap,
		Popup as LeafletPopup,
		Icon as LeafletIcon,
		LeafletMouseEvent
	} from 'leaflet';
	import { Icon } from 'leaflet';
	import { getContext } from 'svelte';
	import Marker from '$lib/components/map/Marker.svelte';
	import Popup from '$lib/components/map/Popup.svelte';
	// import PinForm from '$lib/components/PinForm.svelte';
	import { did } from '$lib/stores/auth.ts';
	import { pinStore } from '$lib/stores/pins.ts';
	import pinSvg from '$lib/assets/pin.svg';
	import type { Pin } from '$lib/atproto/schema';

	const map: LeafletMap = getContext<() => LeafletMap>('map')();
	const icon: LeafletIcon = new Icon({
		iconUrl: pinSvg,
		iconSize: [35, 35]
	});
	let showSelf = $state(false);
	let loading = $state(false);
	let lat = $state(0);
	let lng = $state(0);
	let label = $state('');
	let form: HTMLFormElement;

	$effect(() => {
		if (!map) return;

		const handleClick = (event: LeafletMouseEvent) => {
			showSelf = !showSelf;
			lat = event.latlng.lat;
			lng = event.latlng.lng;
		};

		map.on('click', handleClick);

		return () => {
			map.off('click', handleClick);
		};
	});

	const onsubmit = async (event: SubmitEvent) => {
		event.preventDefault();
		loading = true;
		const formData = new FormData(form);
		const data = Object.fromEntries(formData.entries());
		const pin: Omit<Pin, 'id'> = {
			lat: Number(data.lat),
			lng: Number(data.lng),
			label: data.label as string
		};
		if ($did) {
			await pinStore.addPin($did, pin);
			showSelf = !showSelf;
			label = '';
			// context.closePopup();
		}
		loading = false;
	};
</script>

{#if showSelf}
	<Marker {icon} {lat} {lng}>
		<Popup open={true} closeButton={false}>
			<!-- <PinForm lat={String(lat)} lng={String(lng)} {onFormSubmit} /> -->
			<form {onsubmit} bind:this={form} method="post">
				<h2>New Pin</h2>
				<label>
					Label
					<input type="text" name="label" bind:value={label} required />
				</label>
				<input type="hidden" name="lat" bind:value={lat} />
				<input type="hidden" name="lng" bind:value={lng} />
				<button type="submit">
					{#if loading}
						Adding...
					{:else}
						Add Pin
					{/if}
				</button>
			</form>
		</Popup>
	</Marker>
{/if}
