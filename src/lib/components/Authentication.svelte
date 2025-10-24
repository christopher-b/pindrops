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
		<Loading />
	</div>
{:else if $authError}
	<p class="error">{$authError}</p>
{:else if !$isAuthenticated}
	<LoginForm />
{/if}

<style>
	.error {
		color: #d32f2f;
		font-weight: 500;
	}
	.center {
		margin: auto 0;
		text-align: center;
	}
</style>
