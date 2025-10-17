<script context="module">
  import { Control } from 'leaflet'

  class _Control extends Control {
    constructor(el, position) {
      super({ position })
      this.el = el
    }
    onAdd() {
      return this.el
    }
    onRemove() {}
  }
</script>

<script>
  import { getContext } from 'svelte'

  let { children, position } = $props()
  let control
  const map = getContext('map')()

  function leafletControl(node) {
    control = new _Control(node, position)
    control.addTo(map)

    return {
      destroy() {
        control.remove()
        control = undefined
      },
    }
  }
</script>

<div class="hidden">
  <div {@attach leafletControl}>
    {@render children?.()}
  </div>
</div>
