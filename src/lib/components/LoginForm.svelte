<script lang="ts">
	import { getOAuthClient } from '$lib/atproto/client';
	import { onMount } from "svelte";
	import Card from '$lib/components/ui/Card.svelte';
	import compassSvg from '$lib/assets/compass.svg';

	let handle = '';
	let isLoggingIn = false;
	let error = '';
	let inputEl: HTMLInputElement;

	onMount(() => {
		inputEl?.focus();
	});

	async function onsubmit(event: SubmitEvent) {
		event.preventDefault();

		if (!handle) {
			error = 'Please enter your handle';
			return;
		}

		isLoggingIn = true;
		error = '';

		try {
			const client = await getOAuthClient();
			if (!client) throw new Error('OAuth client not available');

			// Start OAuth flow
			await client.signIn(handle, {
				signal: new AbortController().signal
			});
		} catch (e) {
			error = e instanceof Error ? e.message : 'Login failed';
			isLoggingIn = false;
		}
	}
</script>

<Card as="form" {onsubmit} class="login-form">
	<div class="brand">
		<img src={compassSvg} alt="" class="brand-icon" aria-hidden="true" />
		<h1>PinDrops</h1>
	</div>
	<p>
		An ATProto-powered collection of location pins. Record places you've been,
		places you would like to go, or whatever you like.
	</p>

	<div class="fields">
		<label>
			<span class="label-text">Your handle</span>
			<input
				type="text"
				bind:this={inputEl}
				bind:value={handle}
				placeholder="your-handle.bsky.social"
				disabled={isLoggingIn}
			/>
		</label>

		<button type="submit" disabled={isLoggingIn} aria-busy={isLoggingIn}>
			{isLoggingIn ? 'Logging in...' : 'Login'}
		</button>
	</div>

	{#if error}
		<p class="text-error">{error}</p>
	{/if}
</Card>

<style>
	:global(.login-form) {
		padding: var(--s1) !important;
		padding-inline: var(--s2) !important;
		max-width: 420px;
		margin: var(--s1) auto !important;
		display: flex;
		flex-direction: column;
		gap: var(--s-1);
	}

	.brand {
		display: flex;
		align-items: center;
		gap: var(--s-1);
	}

	.brand-icon {
		width: 40px;
		height: 40px;
		fill: var(--color-accent-med);
	}

	h1 {
		margin: 0;
		font-weight: var(--font-display-weight-bold);
		color: var(--color-accent-dark);
	}

	p {
		color: var(--color-text-muted);
		font-size: var(--font-sm);
		line-height: 1.5;
	}

	.fields {
		display: flex;
		flex-direction: column;
		gap: var(--s-1);
	}

	label {
		display: flex;
		flex-direction: column;
		gap: var(--s-3);
	}

	.label-text {
		font-size: var(--font-sm);
		font-weight: 500;
		color: var(--color-text);
	}

	input {
		padding: var(--s-2) var(--s-1);
		border: 1.5px solid var(--color-neutral-300);
		border-radius: var(--btn-radius);
		background: oklch(1 0 0 / 60%);
		color: var(--color-text);
		font-size: var(--font-sm);
		transition: var(--btn-transition);
	}

	input::placeholder {
		color: var(--color-neutral-400);
	}

	input:focus {
		outline: none;
		border-color: var(--color-accent-med-light);
		box-shadow: 0 0 0 3px oklch(0.65 0.12 155 / 20%);
	}

	input:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	button {
		padding: var(--s-2) var(--s0);
		background: var(--color-accent-med);
		color: var(--color-accent-light);
		border: none;
		border-radius: var(--btn-radius);
		cursor: pointer;
		font-weight: 600;
		font-size: var(--font-sm);
		transition: var(--btn-transition);
	}

	button:hover:not(:disabled) {
		background: var(--color-accent-dark);
	}

	button:active:not(:disabled) {
		transform: scale(0.98);
	}

	button:disabled {
		background: var(--color-neutral-300);
		color: var(--color-neutral-500);
		cursor: not-allowed;
	}
</style>
