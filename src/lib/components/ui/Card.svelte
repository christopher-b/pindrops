<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		as?: string;
		class?: string;
		[key: string]: any;
	}

	let { children, as = 'div', class: className = '', ...rest }: Props = $props();
</script>

<svelte:element this={as} class="card {className}" {...rest}>
	{@render children()}
</svelte:element>

<style>
	.card {
		background-color: oklch(1 0 0 / 80%);
		color: oklch(0.482 0.0275 277.42);
		border-radius: 10px;
		border: 2px solid oklch(86.9% 0.005 56.366);
		box-shadow: 0 1px 2px oklch(0.9132 0.0224 87.15);
		padding-block: 6px;
		padding-inline: 4px;
		margin: 0;
		width: fit-content;
	}
</style>
