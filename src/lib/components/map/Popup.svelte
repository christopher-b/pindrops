<script>
  import { Point } from 'leaflet'
  import { getContext } from 'svelte'

  let { children } = $props()
  const offset = new Point(0, 0)
  const context = getContext('popupContext')()

  function leafletPopup(node){
    context.bindPopup(node, {
      offset: offset
    })

    return {
      destroy() {
        context.unbindPopup();
      },
    }
  }
</script>

<popup {@attach leafletPopup}>
  {@render children?.()}
</popup>

