<script lang="ts" module>
	import { Control, type ControlPosition } from 'leaflet';

	class _Control extends Control {
		el: HTMLElement;

		constructor(el: HTMLElement, position: ControlPosition) {
			super({ position });
			this.el = el;
		}

		onAdd(): HTMLElement {
			return this.el;
		}
		onRemove() {}
	}
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { Map as LeafletMap } from 'leaflet';
	import { getContext, onMount } from 'svelte';

	interface Props {
		children: Snippet;
		position: ControlPosition;
	}

	let { children, position }: Props = $props();
	let el: Element;
	let control: _Control;
	const map: LeafletMap = getContext<() => LeafletMap>('map')();

	onMount(() => {
		control = new _Control(el as HTMLElement, position);
		control.addTo(map);

		return () => control.remove();
	});
</script>

<control bind:this={el}>
	{@render children?.()}
</control>
