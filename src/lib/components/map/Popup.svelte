<script>
  import { Point } from 'leaflet'
  import { getContext } from 'svelte'

  let { children, open, closeButton } = $props()
  let popup
  const offset = new Point(0, 0)
  const context = getContext('popupContext')()

  function leafletPopup(node){
    popup = context.bindPopup(node, {
      offset: offset,
      closeButton
    })

    if(open) {
      popup.openPopup()
    }

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

