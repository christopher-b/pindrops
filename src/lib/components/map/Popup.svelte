<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Marker as LeafletMarker, Popup as LeafletPopup } from 'leaflet';
	import { getContext, setContext, onMount } from 'svelte';
	import { Point } from 'leaflet';

	interface Props {
		children: Snippet;
		open: boolean;
		closeButton?: boolean;
		onopen?: (el: HTMLElement) => void;
	}

	let { children, open = true, closeButton = true, onopen }: Props = $props();
	let el: HTMLElement;
	let popup: LeafletPopup;
	const offset = new Point(0, -7);
	const context: LeafletMarker = getContext<() => LeafletMarker>('markerContext')();
	setContext('popupContext', () => popup);

	onMount(() => {
		context.bindPopup(el, {
			offset: offset,
			closeButton
		});
		popup = context.getPopup()!;

		if (open) {
			context.openPopup();
			if (onopen) {
				requestAnimationFrame(() => onopen(el));
			}
		}

		return () => {
			if (popup) {
				popup.remove();
			}
		};
	});
</script>

<popup bind:this={el}>
	{@render children?.()}
</popup>
