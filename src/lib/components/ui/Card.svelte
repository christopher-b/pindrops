<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLElement> {
		children: Snippet;
		as?: string;
		class?: string;
	}

	let { children, as = 'div', class: className = '', ...rest }: Props = $props();
</script>

<svelte:element this={as} class="card {className}" {...rest}>
	{@render children()}
</svelte:element>

<style>
	.card {
		background-color: var(--surface-bg);
		backdrop-filter: blur(var(--surface-blur));
		-webkit-backdrop-filter: blur(var(--surface-blur));
		color: var(--color-text);
		border-radius: var(--surface-radius);
		border: 1.5px solid var(--surface-border);
		box-shadow: var(--surface-shadow);
		padding-block: var(--s-2);
		padding-inline: var(--s-1);
		margin: 0;
		width: fit-content;
	}
</style>
