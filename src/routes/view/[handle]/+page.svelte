<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { resolveHandle, fetchPublicPins } from '$lib/atproto/public';
	import { mapOptions } from '$lib/mapOptions';
	import type { Pin } from '$lib/atproto/schema';

	import MapView from '$lib/components/map/MapView.svelte';
	import Control from '$lib/components/map/Control.svelte';
	import PinMarker from '$lib/components/PinMarker.svelte';
	import Card from '$lib/components/ui/Card.svelte';

	let pins = $state<Pin[]>([]);
	let loading = $state(true);
	let errorMsg = $state('');
	let resolvedHandle = $state('');

	$effect(() => {
		const handle = $page.params.handle;
		if (handle) {
			loadUserPins(handle);
		}
	});

	async function loadUserPins(handle: string) {
		loading = true;
		errorMsg = '';
		pins = [];
		resolvedHandle = handle;

		try {
			const did = await resolveHandle(handle);
			pins = await fetchPublicPins(did);
		} catch (err) {
			console.error('Failed to load user pins:', err);
			errorMsg = err instanceof Error ? err.message : 'Failed to load pins';
		} finally {
			loading = false;
		}
	}

	function goHome() {
		goto('/');
	}
</script>

<MapView {...mapOptions}>
	<Control position="topright">
		<Card>
			<div class="view-header">
				<div class="user-info">
					<span class="viewing-label">Viewing pins by</span>
					<strong class="handle">@{resolvedHandle}</strong>
					{#if !loading}
						<span class="pin-count">{pins.length} pin{pins.length !== 1 ? 's' : ''}</span>
					{/if}
				</div>
				<button class="btn-back" onclick={goHome}>
					&larr; Back
				</button>
			</div>
		</Card>
	</Control>

	{#each pins as pin (pin.id)}
		<PinMarker {pin} readonly />
	{/each}
</MapView>

{#if loading}
	<div class="overlay-msg">
		<Card>
			<div class="status-msg">Loading pins for @{resolvedHandle}...</div>
		</Card>
	</div>
{/if}

{#if errorMsg}
	<div class="overlay-msg">
		<Card>
			<div class="status-msg error">{errorMsg}</div>
		</Card>
	</div>
{/if}

<style>
	.view-header {
		display: flex;
		align-items: center;
		gap: var(--s-2);
		padding: var(--s-4) var(--s-3);
	}

	.user-info {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.viewing-label {
		font-size: var(--font-xs);
		color: var(--color-text-muted);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: 500;
	}

	.handle {
		font-size: var(--font-sm);
		color: var(--color-text);
		font-weight: 600;
	}

	.pin-count {
		font-size: var(--font-xs);
		color: var(--color-text-muted);
	}

	.btn-back {
		margin-left: auto;
		padding: var(--s-4) var(--s-3);
		background: transparent;
		color: var(--color-accent-med-light);
		border: 1.5px solid var(--color-accent-med-light);
		border-radius: var(--btn-radius);
		cursor: pointer;
		font-weight: 500;
		font-size: var(--font-xs);
		transition: var(--btn-transition);
		white-space: nowrap;
	}

	.btn-back:hover {
		background: var(--color-accent-med-light);
		color: white;
	}

	.btn-back:active {
		transform: scale(0.98);
	}

	.overlay-msg {
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 1000;
		pointer-events: none;
	}

	.status-msg {
		padding: var(--s-2) var(--s-1);
		font-size: var(--font-sm);
		color: var(--color-text);
		text-align: center;
		white-space: nowrap;
	}

	.status-msg.error {
		color: var(--color-error);
	}
</style>
