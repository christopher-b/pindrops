<script lang="ts">
	import type { Map as LeafletMap, Icon as LeafletIcon, LeafletMouseEvent } from 'leaflet';
	import { Icon } from 'leaflet';
	import { getContext } from 'svelte';
	import Marker from '$lib/components/map/Marker.svelte';
	import Popup from '$lib/components/map/Popup.svelte';
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
			label: data.label as string,
			date: new Date().toISOString()
		};
		if ($did) {
			await pinStore.addPin($did, pin);
			showSelf = !showSelf;
			label = '';
		}
		loading = false;
	};
</script>

{#if showSelf}
	<Marker {icon} {lat} {lng}>
		<Popup open={true} closeButton={false}>
			<form {onsubmit} bind:this={form} method="post" class="popup-form">
				<h2>New Pin</h2>
				<label>
					<span class="label-text">Label</span>
					<input type="text" name="label" bind:value={label} required placeholder="Name this place..." />
				</label>
				<input type="hidden" name="lat" bind:value={lat} />
				<input type="hidden" name="lng" bind:value={lng} />
				<button type="submit" class="btn-primary" disabled={loading}>
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

<style>
	.popup-form {
		display: flex;
		flex-direction: column;
		gap: var(--s-2);
		min-width: 200px;
	}

	h2 {
		margin: 0;
		font-size: var(--font-md);
		font-weight: var(--font-display-weight-bold);
		color: var(--color-accent-dark);
	}

	label {
		display: flex;
		flex-direction: column;
		gap: var(--s-4);
	}

	.label-text {
		font-size: var(--font-xs);
		font-weight: 500;
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	input[type='text'] {
		padding: var(--s-3) var(--s-2);
		border: 1.5px solid var(--color-neutral-300);
		border-radius: 6px;
		background: var(--color-neutral-50);
		color: var(--color-text);
		font-size: var(--font-sm);
		transition: var(--btn-transition);
	}

	input[type='text']::placeholder {
		color: var(--color-neutral-400);
	}

	input[type='text']:focus {
		outline: none;
		border-color: var(--color-accent-med-light);
		box-shadow: 0 0 0 3px oklch(0.65 0.12 155 / 20%);
		background: white;
	}

	.btn-primary {
		padding: var(--s-3) var(--s-1);
		background: var(--color-accent-med);
		color: var(--color-accent-light);
		border: none;
		border-radius: var(--btn-radius);
		cursor: pointer;
		font-weight: 600;
		font-size: var(--font-xs);
		transition: var(--btn-transition);
	}

	.btn-primary:hover:not(:disabled) {
		background: var(--color-accent-dark);
	}

	.btn-primary:active:not(:disabled) {
		transform: scale(0.98);
	}

	.btn-primary:disabled {
		background: var(--color-neutral-300);
		color: var(--color-neutral-500);
		cursor: not-allowed;
	}
</style>
