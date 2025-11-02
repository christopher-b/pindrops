<script lang="ts">
	import '../app.css';
	import '@fontsource/inter'; // Defaults to weight 400
	let { children } = $props();
</script>

<svelte:head></svelte:head>

{@render children?.()}
