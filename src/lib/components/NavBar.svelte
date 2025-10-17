<script lang="ts">
	import { handle, did, logout } from '$lib/stores/auth.ts';
  function onclick() {
    logout()
  }
</script>

<nav>
	<h1>PinDrop</h1>
    <p>
      Logged in as
      {#if $handle}
        <strong title="{$did}">{$handle}</strong>
      {:else}
        <em>Loading...</em>
      {/if}
    </p>
  <button {onclick}>Logout</button>
</nav>

<style>
  nav {
    background-color: #fff;
    padding: 5px;
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

