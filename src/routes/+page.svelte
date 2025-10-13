<script lang="ts">
	import { onMount } from 'svelte';
  import { Agent } from '@atproto/api'
	import { getOAuthClient } from '$lib/atproto/client';
  import LoginForm from '$lib/components/LoginForm.svelte'

	let agent = $state<Agent | null>(null);
	let session = $state(null);
	let handle = $state<string | null>(null);
	let isLoading = $state(true);
	let error = $state<string | null>(null);
  let did = $derived(session?.sub);

	$effect(() => {
		if (agent) {
			fetchHandle();
		}
	});

	async function fetchHandle() {
		if (!agent || !did) return;

		try {
			const response = await agent.com.atproto.repo.describeRepo({ repo: did });
			handle = response.data.handle;
		} catch (err) {
			console.error('Failed to fetch handle:', err);
			error = 'Failed to load user information';
		}
	}

	onMount(async () => {
		const client = getOAuthClient()
    if (!client) {
			error = 'OAuth client not available';
			isLoading = false;
			return;
		}

		try {
			// Initialize and restore session if exists
			const result = await client.init()
      session = result?.session ?? null;

      if(session) {
        agent = new Agent(session)
      }
		} catch (err) {
			console.error('Failed to initialize session:', err);
			error = 'Failed to initialize authentication';
		} finally {
			isLoading = false;
		}
	});

  async function logout() {
		const client = getOAuthClient();
		if (!client || !session?.sub) return;

		try {
			// Revoke the session
			await client.revoke(session.sub);

			// Clear local state
			session = null;
			agent = null;
			handle = null;
			error = null;
		} catch (err) {
			console.error('Failed to logout:', err);
			error = 'Failed to logout';
		}
	}
</script>

<div class="home">
	<h1>PinDrop</h1>

  {#if isLoading}
		<p>Loading...</p>
	{:else if error}
		<p class="error">{error}</p>
	{:else if session}
    Logged in as
			{#if handle}
				<strong>{handle}</strong>
			{:else}
				<em>Loading...</em>
			{/if}
			({did})
    <button onclick={logout}>Logout</button>
  {:else}
    <LoginForm></LoginForm>
  {/if}
</div>

<style>
	.home {
		text-align: center;
		padding: 2rem;
	}
  .error {
		color: #d32f2f;
		font-weight: 500;
	}

	/* a { */
	/* 	display: inline-block; */
	/* 	margin-top: 1rem; */
	/* 	padding: 0.75rem 1.5rem; */
	/* 	background: #0085ff; */
	/* 	color: white; */
	/* 	text-decoration: none; */
	/* 	border-radius: 4px; */
	/* } */
</style>

