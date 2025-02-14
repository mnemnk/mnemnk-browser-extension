<script lang="ts">
  import { address, api_key } from "@/lib/store";
</script>

<main>
  <h1>Mnemnk Options</h1>

  <label>
    <span>Address:</span>
    <input bind:value={$address} />
  </label>

  <label>
    <span>API key:</span>
    <input bind:value={$api_key} />
  </label>
</main>

<style>
</style>
