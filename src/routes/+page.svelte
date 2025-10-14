<script lang="ts">
	import { onMount } from 'svelte';
	import { authStore } from '$lib/stores/auth.svelte';
  import  LoginForm from '$lib/components/LoginForm.svelte'
  import  MapView from '$lib/components/MapView.svelte'
  import  NavBar from '$lib/components/NavBar.svelte'

	onMount(() => {
		authStore.init();
	});
</script>

<div class="home">

	{#if authStore.isLoading}
		<p>Loading...</p>
	{:else if authStore.error}
		<p class="error">{authStore.error}</p>
	{:else if authStore.isAuthenticated}
    <NavBar></NavBar>
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
