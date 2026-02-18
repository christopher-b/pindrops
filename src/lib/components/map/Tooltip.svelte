<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Marker as LeafletMarker } from 'leaflet';
	import { getContext, onMount } from 'svelte';
	import { Point } from 'leaflet';

	interface Props {
		children: Snippet;
		offset?: Point;
		direction?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'auto';
		permanent?: boolean;
	}

	let {
		children,
		offset = new Point(0, -7),
		direction = 'top',
		permanent = false
	}: Props = $props();

	let el: HTMLElement;
	const marker: LeafletMarker = getContext<() => LeafletMarker>('markerContext')();

	onMount(() => {
		marker.bindTooltip(el, {
			offset,
			direction,
			permanent,
			className: 'pin-tooltip'
		});

		const tooltip = marker.getTooltip();

		return () => {
			if (tooltip) {
				marker.unbindTooltip();
			}
		};
	});
</script>

<tooltip bind:this={el}>
	{@render children?.()}
</tooltip>
