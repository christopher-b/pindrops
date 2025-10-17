<script>
  import { getContext, setContext } from 'svelte';
  import { Marker } from 'leaflet'

  let { children, lat, lng, icon } = $props()
  let marker
  let renderChildren = $state(false)

  const map = getContext('map')()
  setContext('popupContext', () => marker)

  function leafletMarker() {
    marker = new Marker([lat, lng], { icon })
    marker.addTo(map)
    renderChildren = true

    return {
      destroy() {
        if (marker) {
          marker.remove();
          marker = undefined;
        }
      },
    };
  }
</script>

<marker {@attach leafletMarker}>
  {#if renderChildren}
    {@render children?.()}
  {/if}
</marker>
