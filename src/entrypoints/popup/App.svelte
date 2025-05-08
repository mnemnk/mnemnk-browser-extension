<script>
  import { customActions } from "@/lib/store";
  import { getCurrentTab, getPageContent } from "@/lib/utils";
  import logo44 from "@/assets/logo44.png";

  let isLoading = $state(false);
  let status = $state("");
  let error = $state("");
  let success = $state(false);

  async function sendPageData(actionName) {
    isLoading = true;
    status = "Getting page data...";
    error = "";
    success = false;

    try {
      const tab = await getCurrentTab();
      if (!tab || !tab.url) {
        throw new Error("Could not get current tab information");
      }

      status = "Getting page content...";
      const content = await getPageContent();

      status = "Sending data...";
      const message = {
        action: "sendPageData",
        url: tab.url,
        title: tab.title,
        content: content,
        customAction: actionName,
      };

      const response = await browser.runtime.sendMessage(message);
    //   console.log("Response from background:", response);

      if (response && response.success) {
        success = true;
        status = `"${actionName}" sent`;
        setTimeout(() => {
          window.close();
        }, 1500);
      } else {
        const errorMsg =
          response && response.error
            ? response.error
            : "Failed to send data to server";
        throw new Error(errorMsg);
      }
    } catch (err) {
      console.error("Error in sendPageData:", err);
      error = err.message || "An unexpected error occurred";
      status = "Failed!";
    } finally {
      isLoading = false;
    }
  }
</script>

<main>
  <div class="popup-header">
    <img src={logo44} alt="Mnemnk Logo" width="24" height="24" />
    <h1>Mnemnk</h1>
    <button aria-label="Open options page" onclick={() => browser.runtime.openOptionsPage()} class="icon-button">
        <svg width="20px" height="20px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="none">
            <path stroke="#535358" stroke-linejoin="round" stroke-width="2" d="M13.905 3.379A.5.5 0 0114.39 3h3.22a.5.5 0 01.485.379l.689 2.757a.515.515 0 00.341.362c.383.126.755.274 1.115.443a.515.515 0 00.449-.003l2.767-1.383a.5.5 0 01.577.093l2.319 2.319a.5.5 0 01.093.577l-1.383 2.767a.515.515 0 00-.003.449c.127.271.243.549.346.833.053.148.17.265.319.315l2.934.978a.5.5 0 01.342.474v3.28a.5.5 0 01-.342.474l-2.934.978a.515.515 0 00-.32.315 9.937 9.937 0 01-.345.833.515.515 0 00.003.449l1.383 2.767a.5.5 0 01-.093.577l-2.319 2.319a.5.5 0 01-.577.093l-2.767-1.383a.515.515 0 00-.449-.003c-.271.127-.549.243-.833.346a.515.515 0 00-.315.319l-.978 2.934a.5.5 0 01-.474.342h-3.28a.5.5 0 01-.474-.342l-.978-2.934a.515.515 0 00-.315-.32 9.95 9.95 0 01-1.101-.475.515.515 0 00-.498.014l-2.437 1.463a.5.5 0 01-.611-.075l-2.277-2.277a.5.5 0 01-.075-.61l1.463-2.438a.515.515 0 00.014-.498 9.938 9.938 0 01-.573-1.383.515.515 0 00-.362-.341l-2.757-.69A.5.5 0 013 17.61v-3.22a.5.5 0 01.379-.485l2.757-.689a.515.515 0 00.362-.341c.157-.478.35-.94.573-1.383a.515.515 0 00-.014-.498L5.594 8.557a.5.5 0 01.075-.611l2.277-2.277a.5.5 0 01.61-.075l2.438 1.463c.152.091.34.094.498.014a9.938 9.938 0 011.382-.573.515.515 0 00.342-.362l.69-2.757z"/>
            <circle cx="16" cy="16" r="5" stroke="#535358" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
        </svg>
    </button>
  </div>

  <div class="actions-container">
    <h2>Select Action</h2>

    {#if isLoading}
      <div class="status-message loading">
        <div class="spinner"></div>
        <p>{status}</p>
      </div>
    {:else if error}
      <div class="status-message error">
        <p>Error: {error}</p>
      </div>
    {:else if success}
      <div class="status-message success">
        <p>{status}</p>
      </div>
    {:else}
      <div class="actions-list">
        {#each $customActions as action}
          <button class="action-button" onclick={() => sendPageData(action)}>
            {action}
          </button>
        {/each}
      </div>
    {/if}
  </div>
</main>

<style>
  main {
    min-width: 240px;
    padding: 0.8rem;
  }

  .popup-header {
    display: flex;
    align-items: center;
    margin-bottom: 1.2rem;
  }

  .popup-header h1 {
    font-size: 1.2rem;
    margin-left: 0.5rem;
  }

  .popup-header button {
    margin-top: 0.2rem;
    margin-left: auto;
    padding: 0.1rem;
    background: none;
    border: none;
  }

  h2 {
    font-size: 0.8rem;
    margin-top: 0;
    margin-bottom: 0.8rem;
  }

  .actions-container {
    margin-bottom: 1rem;
  }

  .actions-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .action-button {
    text-align: left;
    padding: 0.5rem 0.8rem;
    border-radius: 4px;
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .action-button:hover {
    background-color: #e0e0e0;
  }

  .status-message {
    padding: 0.8rem;
    border-radius: 4px;
    margin-bottom: 0.8rem;
  }

  .status-message p {
    margin: 0;
    text-align: center;
  }

  .loading {
    background-color: #f0f8ff;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .error {
    background-color: #fff0f0;
    color: #d32f2f;
  }

  .success {
    background-color: #f0fff0;
    color: #388e3c;
  }

  .spinner {
    width: 24px;
    height: 24px;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top-color: #4caf50;
    animation: spin 1s linear infinite;
    margin-bottom: 0.5rem;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-color-scheme: dark) {
    .action-button {
      background-color: #333;
      border-color: #444;
      color: #fff;
    }

    .action-button:hover {
      background-color: #444;
    }

    .loading {
      background-color: #203040;
    }

    .error {
      background-color: #402030;
      color: #ff6b6b;
    }

    .success {
      background-color: #203020;
      color: #7ee67e;
    }

    .spinner {
      border-color: rgba(255, 255, 255, 0.1);
      border-top-color: #4caf50;
    }
  }
</style>
