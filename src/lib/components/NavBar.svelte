<script lang="ts">
	import { authStore } from '$lib/stores/auth.svelte';
</script>

<nav>
	<h1>PinDrop</h1>
    <p>
      Logged in as
      {#if authStore.handle}
        <strong title="{authStore.did}">{authStore.handle}</strong>
      {:else}
        <em>Loading...</em>
      {/if}
    </p>
  <button onclick={() => authStore.logout()}>Logout</button>
</nav>

<style>
  nav {
    background-color: #fff;
    padding: 5px;
    position: absolute;
    top: 10px;
    left: 50px;
    border: 2px solid rgba(0,0,0,0.3);
    border-radius: 4px;

    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
  }

  h1 {
    margin: 0;
    font-size: 1.5rem;
  }

  p {
  margin: 0;
  }
</style>

