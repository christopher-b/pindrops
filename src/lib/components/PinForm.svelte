<script lang="ts">
	import type { Popup as LeafletPopup } from 'leaflet';
	import { getContext } from 'svelte';
	import { did } from '$lib/stores/auth.ts';
	import { pinStore } from '$lib/stores/pins.ts';
	import type { Pin } from '$lib/atproto/schema';

	interface Props {
		lat: string;
		lng: string;
	}
	let { lat, lng }: Props = $props();
	let label = $state('');
	let loading = $state(false);
	let form: HTMLFormElement;
	const context: LeafletPopup = getContext<() => LeafletPopup>('markerContext')();

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
			context.closePopup();
		}
		loading = false;
	};
</script>

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
