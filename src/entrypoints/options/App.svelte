<script>
  import { address, api_key, excludeUrls, customActions } from "@/lib/store";

  import logo44 from "@/assets/logo44.png";

  let excludeUrlsText = $derived.by(() => $excludeUrls.join('\n'));
  let customActionsText = $derived.by(() => $customActions.join('\n'));
  
  function saveExcludeUrls() {
    // Split by newlines and filter out empty lines
    const urls = excludeUrlsText
      .split('\n')
      .map(url => url.trim())
      .filter(url => url !== '');
    
    $excludeUrls = urls;
  }
  
  function saveCustomActions() {
    // Split by newlines and filter out empty lines
    const actions = customActionsText
      .split('\n')
      .map(action => action.trim())
      .filter(action => action !== '');
    
    $customActions = actions;
  }
</script>

<main>
  <h1><img src={logo44} alt="logo"> Mnemnk Options</h1>

  <div class="option-group">
    <h2>Connection Settings</h2>
    <label>
      <span>Address:</span>
      <input bind:value={$address} />
    </label>

    <label>
      <span>API key:</span>
      <input bind:value={$api_key} type="password" />
    </label>
  </div>
  
  <div class="option-group">
    <h2>Custom Actions</h2>
    <p class="description">Define custom actions that will appear in the popup menu when you click the extension icon. Add one action per line.</p>

    <div class="actions-editor">
      <textarea 
        bind:value={customActionsText}
        placeholder="clip"
        rows="6"
      ></textarea>
    </div>

    <div class="button-row">
      <button onclick={saveCustomActions} class="save-btn">Save Actions</button>
    </div>
  </div>

  <div class="option-group">
    <h2>Excluded URLs</h2>
    <p class="description">URLs matching these regular expressions will not be tracked. Add one pattern per line.</p>

    <div class="exclude-urls-editor">
      <textarea 
        bind:value={excludeUrlsText}
        placeholder="^(?!https?)
^http://localhost
^https://example.com/"
        rows="8"
      ></textarea>
    </div>

    <div class="button-row">
      <button onclick={saveExcludeUrls} class="save-btn">Save Changes</button>
    </div>
  </div>
</main>

<style>
  main {
    max-width: 800px;
    margin: 0 auto;
    padding: 0 1rem;
  }

  h1 {
    display: flex;
    align-items: center;
    font-size: 2.4rem;
    margin-bottom: 2rem;
    gap: 0.7rem;
  }

  .option-group {
    margin-bottom: 2rem;
    padding: 1rem;
    border: 1px solid #ccc;
    border-radius: 8px;
  }

  h2 {
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  .description {
    color: #666;
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }

  label {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }

  label span {
    margin-bottom: 0.3rem;
    font-weight: 500;
  }

  input, textarea {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }

  .exclude-urls-editor, .actions-editor {
    margin-bottom: 1rem;
  }

  textarea {
    width: 100%;
    font-family: monospace;
    resize: vertical;
    min-height: 150px;
  }

  .button-row {
    display: flex;
    justify-content: flex-end;
  }

  .save-btn {
    background-color: #4caf50;
    color: white;
  }

  button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    border-radius: 4px;
    border: none;
    cursor: pointer;
  }

  @media (prefers-color-scheme: dark) {
    .option-group {
      border-color: #444;
    }

    input, textarea {
      border-color: #444;
      background-color: #333;
      color: #fff;
    }

    .description {
      color: #aaa;
    }

    .save-btn {
      background-color: #2e7d32;
    }
  }
</style>
