<script lang="ts">
	import { getOAuthClient } from '$lib/atproto/client';

	let handle = '';
	let isLoggingIn = false;
	let error = '';

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

<form {onsubmit} class="card">
	<h1>PinDrops</h1>
	<p>
		PinDrops is an ATProto-powered collection of location pins. Use it to record places you've been,
		places you would like to go, or whatever you like.
	</p>
	<p>PinDrops was built to explore building applications with ATProto.</p>
	<h2>Login</h2>
	<label>
		Your handle
		<input
			type="text"
			bind:value={handle}
			placeholder="your-handle.bsky.social"
			disabled={isLoggingIn}
		/>
	</label>

	<button type="submit" disabled={isLoggingIn} aria-busy={isLoggingIn}>
		{isLoggingIn ? 'Logging in...' : 'Login'}
	</button>

	{#if error}
		<p class="error">{error}</p>
	{/if}
</form>

<style>
	form {
		padding: 1rem;
		max-width: 400px;
		margin: 10px auto;

		/* display: flex; */
		/* flex-direction: column; */
		/* gap: 1rem; */
	}

	h2 {
		margin: 0;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	input {
		padding: 0.5rem;
		border: 1px solid #ccc;
		border-radius: 4px;
	}

	button {
		padding: 0.75rem;
		background: #0085ff;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
	}

	button:disabled {
		background: #ccc;
		cursor: not-allowed;
	}

	.error {
		color: red;
	}
</style>
