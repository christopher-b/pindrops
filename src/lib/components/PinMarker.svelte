<script lang="ts">
	import { pinIcon } from '$lib/pinIcon';
	import { pinStore } from '$lib/stores/pins.ts';
	import { did } from '$lib/stores/auth.ts';
	import Marker from '$lib/components/map/Marker.svelte';
	import Popup from '$lib/components/map/Popup.svelte';
	import Tooltip from '$lib/components/map/Tooltip.svelte';
	import type { Pin } from '$lib/atproto/schema';

	interface Props {
		pin: Pin;
		readonly?: boolean;
	}

	let { pin, readonly = false }: Props = $props();
	let loading = $state(false);
	let editing = $state(false);
	let editLabel = $state(pin.label);
	const ondelete = async () => {
		if (!$did) return;

		loading = true;
		await pinStore.removePin($did, pin.id);
		loading = false;
	};

	const onStartEdit = () => {
		editLabel = pin.label;
		editing = true;
	};

	const onCancelEdit = () => {
		editLabel = pin.label;
		editing = false;
	};

	const onSaveEdit = async () => {
		if (!$did) return;
		const trimmed = editLabel.trim();
		if (!trimmed || trimmed === pin.label) {
			editing = false;
			return;
		}

		loading = true;
		const success = await pinStore.updatePin($did, pin.id, { label: trimmed });
		loading = false;

		if (success) {
			editing = false;
		}
	};

	const onKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			onSaveEdit();
		} else if (e.key === 'Escape') {
			onCancelEdit();
		}
	};
</script>

<Marker lat={pin.lat} lng={pin.lng} icon={pinIcon}>
	<Tooltip>
		<span class="tooltip-label">{pin.label}</span>
	</Tooltip>
	{#if readonly}
		<Popup open={false}>
			<div class="pin-popup">
				<span class="pin-label">{pin.label}</span>
				{#if pin.date}
					<span class="pin-date">{new Date(pin.date).toLocaleDateString()}</span>
				{/if}
			</div>
		</Popup>
	{:else}
		<Popup open={false}>
			<div class="pin-popup">
				{#if editing}
					<input
						type="text"
						class="edit-input"
						bind:value={editLabel}
						onkeydown={onKeydown}
						disabled={loading}
					/>
					<div class="btn-row">
						<button onclick={onSaveEdit} class="btn-save" disabled={loading || !editLabel.trim()}>
							{#if loading}
								Saving...
							{:else}
								Save
							{/if}
						</button>
						<button onclick={onCancelEdit} class="btn-cancel" disabled={loading}>
							Cancel
						</button>
					</div>
				{:else}
					<span class="pin-label">{pin.label}</span>
					<div class="btn-row">
						<button onclick={onStartEdit} class="btn-edit" disabled={loading}>
							Edit
						</button>
						<button onclick={ondelete} class="btn-delete" disabled={loading}>
							{#if loading}
								Deleting...
							{:else}
								Delete
							{/if}
						</button>
					</div>
				{/if}
			</div>
		</Popup>
	{/if}
</Marker>

<style>
	.tooltip-label {
		font-weight: 500;
		font-size: var(--font-xs);
		color: var(--color-text);
	}

	.pin-popup {
		display: flex;
		flex-direction: column;
		gap: var(--s-3);
		min-width: 160px;
	}

	.pin-label {
		font-weight: 500;
		font-size: var(--font-sm);
		color: var(--color-text);
	}

	.pin-date {
		font-size: var(--font-xs);
		color: var(--color-text-muted);
	}

	.edit-input {
		width: 100%;
		padding: var(--s-4) var(--s-3);
		border: 1.5px solid var(--color-border);
		border-radius: var(--btn-radius);
		font-size: var(--font-xs);
		font-family: var(--font-body);
		color: var(--color-text);
		background: white;
		outline: none;
		transition: border-color 0.2s ease;
		box-sizing: border-box;
	}

	.edit-input:focus {
		border-color: var(--color-accent-med-light);
		box-shadow: 0 0 0 2px oklch(from var(--color-accent-light) l c h / 40%);
	}

	.edit-input:disabled {
		opacity: 0.5;
	}

	.btn-row {
		display: flex;
		gap: var(--s-4);
	}

	.btn-row > button {
		flex: 1;
		padding: var(--s-4) var(--s-3);
		border-radius: var(--btn-radius);
		cursor: pointer;
		font-weight: 500;
		font-size: var(--font-xs);
		transition: var(--btn-transition);
	}

	.btn-row > button:active:not(:disabled) {
		transform: scale(0.98);
	}

	.btn-row > button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.btn-edit {
		background: transparent;
		color: var(--color-accent-med-light);
		border: 1.5px solid var(--color-accent-med-light);
	}

	.btn-edit:hover:not(:disabled) {
		background: var(--color-accent-med-light);
		color: white;
	}

	.btn-save {
		background: var(--color-accent-med-light);
		color: white;
		border: 1.5px solid var(--color-accent-med-light);
	}

	.btn-save:hover:not(:disabled) {
		background: var(--color-accent-med);
		border-color: var(--color-accent-med);
	}

	.btn-cancel {
		background: transparent;
		color: var(--color-text-muted);
		border: 1.5px solid var(--color-border);
	}

	.btn-cancel:hover:not(:disabled) {
		background: var(--color-neutral-100);
		color: var(--color-text);
	}

	.btn-delete {
		background: transparent;
		color: var(--color-error);
		border: 1.5px solid var(--color-error);
	}

	.btn-delete:hover:not(:disabled) {
		background: var(--color-error);
		color: white;
	}
</style>
