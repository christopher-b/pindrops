<script lang="ts">
	import { Icon } from 'leaflet';
	import pinSvg from '$lib/assets/pin.svg';
	import { pinStore } from '$lib/stores/pins.ts';
	import { did } from '$lib/stores/auth.ts';
	import Marker from '$lib/components/map/Marker.svelte';
	import Popup from '$lib/components/map/Popup.svelte';

	let { pin } = $props();
	let loading = $state(false);
	const icon = new Icon({
		iconUrl: pinSvg,
		iconSize: [35, 35]
	});

	const onclick = async () => {
		if (!$did) return;

		loading = true;
		await pinStore.removePin($did, pin.id);
		loading = false;
	};
</script>

<Marker lat={pin.lat} lng={pin.lng} {icon}>
	<Popup open={false}>
		<div class="pin-popup">
			<span class="pin-label">{pin.label}</span>
			<form>
				<button {onclick} class="btn-delete" disabled={loading}>
					{#if loading}
						Deleting...
					{:else}
						Delete Pin
					{/if}
				</button>
			</form>
		</div>
	</Popup>
</Marker>

<style>
	.pin-popup {
		display: flex;
		flex-direction: column;
		gap: var(--s-3);
		min-width: 140px;
	}

	.pin-label {
		font-weight: 500;
		font-size: var(--font-sm);
		color: var(--color-text);
	}

	.btn-delete {
		width: 100%;
		padding: var(--s-4) var(--s-2);
		background: transparent;
		color: var(--color-error);
		border: 1.5px solid var(--color-error);
		border-radius: var(--btn-radius);
		cursor: pointer;
		font-weight: 500;
		font-size: var(--font-xs);
		transition: var(--btn-transition);
	}

	.btn-delete:hover:not(:disabled) {
		background: var(--color-error);
		color: white;
	}

	.btn-delete:active:not(:disabled) {
		transform: scale(0.98);
	}

	.btn-delete:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
