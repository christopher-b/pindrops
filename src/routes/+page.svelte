<script lang="ts">
	import { onMount } from 'svelte';
	import { isLoading as isAuthLoading, init as authInit, error as authError, isAuthenticated } from '$lib/stores/auth.ts';
  import  LoginForm from '$lib/components/LoginForm.svelte'
  import  MapView from '$lib/components/MapView.svelte'
  import  NavBar from '$lib/components/NavBar.svelte'

	onMount(() => {
    authInit();
	});
</script>

<div class="home">

	{#if $isAuthLoading}
		<p>Loading...</p>
	{:else if $authError}
		<p class="error">{$authError}</p>
	{:else if $isAuthenticated}
    <NavBar/>
	{:else}
    <LoginForm />
	{/if}

  <MapView />
</div>

<style>
	.error {
		color: #d32f2f;
		font-weight: 500;
	}
</style>
