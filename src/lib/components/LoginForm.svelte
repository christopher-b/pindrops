<script lang="ts">
	import { getOAuthClient } from '$lib/atproto/client';

	let handle = '';
	let isLoggingIn = false;
	let error = '';

	async function handleLogin() {
		if (!handle) {
			error = 'Please enter your handle';
			return;
		}

		isLoggingIn = true;
		error = '';

		try {
			const client = getOAuthClient();
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

<form on:submit|preventDefault={handleLogin}>
  <h1>Login</h1>
  <label>
    Handle
    <input
      type="text"
      bind:value={handle}
      placeholder="your-handle.bsky.social"
      disabled={isLoggingIn}
    />
  </label>

  <button type="submit" disabled={isLoggingIn}>
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
    background-color: #fff;
    border: 2px solid rgba(0,0,0,0.3);
    border-radius: 4px;

		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

  h1 {
    margin: 0;
  }

	form {
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
