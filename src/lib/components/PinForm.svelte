<script>
  let { onsubmit, lat, lng }= $props();
  let label = '';
</script>

<form {onsubmit}>
  <label>
    Label
    <input type="text" name="label" bind:value={label} required />
  </label>
  <input type="hidden" name="lat" bind:value={lat} />
  <input type="hidden" name="lng" bind:value={lng} />
  <button type="submit">Add Pin</button>
</form>
