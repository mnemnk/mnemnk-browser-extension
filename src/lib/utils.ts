import { storage } from "@wxt-dev/storage";

export type SendDataOptions = {
  url: string;
  title?: string;
  text?: string;
  content?: string;
  action?: string;
};

export async function sendData(options: SendDataOptions): Promise<{status: string, ok: boolean}> {
  let address = await storage.getItem<string>("local:address") || "localhost:3296";
  let api_key = await storage.getItem<string>("local:api_key") || "";

  const server = `http://${address}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${api_key}`,
  };

  const data = {
    ch: "browser",
    kind: "browser",
    value: {
      t: Date.now(),
      url: options.url,
      title: options.title,
      text: options.text || `${options.url} ${options.title || ""}`,
      content: options.content,
      action: options.action,
    },
  };

  const json_data = JSON.stringify(data);

  try {
    const response = await fetch(`${server}/out`, {
      method: "POST",
      mode: "cors",
      headers: headers,
      body: json_data,
    });

    if (response.status !== 200) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    return { 
      status: response.statusText || "ok", 
      ok: true 
    };
  } catch (error) {
    console.error("Error in sendData:", error);
    return { 
      status: error.message || "Error connecting to server", 
      ok: false 
    };
  }
}

export function removeUtmParams(url: string): string {
  const urlObj = new URL(url);
  const params = urlObj.searchParams;
  const keys = Array.from(params.keys());
  // remove all utm_* and fbclid params
  for (const key of keys) {
    if (key.startsWith("utm_") || key === "fbclid") {
      params.delete(key);
    }
  }
  return urlObj.toString();
}

export async function isExcludeUrl(url: string): Promise<boolean> {
  const excludeUrlsList = await storage.getItem<string[]>("local:excludeUrls") || [];
  const excludeUrls = excludeUrlsList.map((re) => new RegExp(re));
  return excludeUrls.some((re) => re.test(url));
}

export async function getCurrentTab(): Promise<chrome.tabs.Tab | null> {
  try {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    return tabs.length > 0 ? tabs[0] : null;
  } catch (error) {
    console.error("Error getting current tab:", error);
    return null;
  }
}

export async function getPageContent(): Promise<string | null> {
  try {
    const tab = await getCurrentTab();
    if (!tab || !tab.id) return null;

    const [result] = await browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => document.documentElement.outerHTML,
    });

    return result?.result as string || null;
  } catch (error) {
    console.error("Error getting page content:", error);
    return null;
  }
}
