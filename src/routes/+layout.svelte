<script lang="ts">
	import '../app.css';
	import '@fontsource/inter'; // Defaults to weight 400
	let { children } = $props();
</script>

<svelte:head>
	<title>PinDrops</title>
</svelte:head>

{@render children?.()}
