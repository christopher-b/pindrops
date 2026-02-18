<script>
	import {
		isLoading as isAuthLoading,
		error as authError,
		isAuthenticated
	} from '$lib/stores/auth.ts';
	import Loading from '$lib/components/Loading.svelte';
	import LoginForm from '$lib/components/LoginForm.svelte';
</script>

{#if $isAuthLoading}
	<div class="center">
		<Loading size="56px" />
		<p>Connecting...</p>
	</div>
{:else if $authError}
	<div class="center">
		<p class="text-error">{$authError}</p>
	</div>
{:else if !$isAuthenticated}
	<LoginForm />
{/if}

<style>
	.center {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		height: 100vh;
		gap: var(--s-1);

		p {
			margin: 0;
			font-size: var(--font-sm);
			color: var(--color-text-muted);
			font-weight: 500;
			letter-spacing: 0.02em;
		}
	}
</style>
