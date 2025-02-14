import { storage } from "@wxt-dev/storage";
import { debounceTime, Subject } from "rxjs";

type TabUpdatedEvent = {
  t: number
  title?: string
  url?: string
};

type SendData = {
  t: number
  title?: string
  url?: string
  text?: string
};

export default defineBackground(() => {
  // console.log('Start background!', { id: browser.runtime.id });

  let excludeUrls: RegExp[] = [];
  let excludeUrlsStorage = storage.defineItem<string[]>("local:excludeUrls", {
      fallback: ["^(?!https?)", "^http://localhost"],
  });
  excludeUrlsStorage.getValue().then((value) => {
    excludeUrls = value ? value.map((re) => new RegExp(re)) : [];
  });
  excludeUrlsStorage.watch((value) => {
    excludeUrls = value ? value.map((re) => new RegExp(re)) : [];
  });

  let address = "";
  let addressStorage = storage.defineItem<string>("local:address", {
    fallback: "localhost:3296",
  });
  addressStorage.getValue().then((value) => {
    address = value;
  });
  addressStorage.watch((value) => {
    address = value ? value : "";
  });

  let api_key = "";
  let apiKeyStorage = storage.defineItem<string>("local:api_key", {
    fallback: "",
  });
  apiKeyStorage.getValue().then((value) => {
    api_key = value
  });
  apiKeyStorage.watch((value) => {
    api_key = value ? value : "";
  });

  function isExcludeUrl(url: string): boolean {
    return excludeUrls.some((re) => re.test(url));
  }

  function removeUtmParams(url: string): string {
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

  let lastUrl: string | undefined = "";

  async function sendData(value: SendData): Promise<Response> {
    if (lastUrl === value.url) {
      // console.log("Skip sending data to server, already sent");
      return Promise.resolve(new Response());
    }
    lastUrl = value.url;

    console.log("sendData", value);

    if (address === undefined) {
      let addr = await storage.getItem<string>("local:address")
      address = addr ? addr : "";
      if (!address) {
        console.error("No address found to send data to");
        return Promise.reject(new Error("No address found to send data to"));
      }
    }

    if (api_key === undefined || api_key === "") {
      let key = await storage.getItem<string>("local:api_key")
      api_key = key ? key : "";
      if (!api_key) {
        console.error("No token found");
        return Promise.reject(new Error("No token found"));
      }
    }

    const server = `http://${address}`;

    const data = {
      agent: "mnemnk-extension",
      kind: "browser",
      value: value,
    };

    const json_data = JSON.stringify(data);
    return fetch(`${server}/store`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${api_key}`,
      },
      body: json_data,
    });
  }

  const tabUpdated$ = new Subject<TabUpdatedEvent>();
  tabUpdated$
    .pipe(debounceTime(500))
    .subscribe(async (entry: TabUpdatedEvent) => {
      if (!entry.url || isExcludeUrl(entry.url)) {
        return;
      }
      let data = {
          t: entry.t,
          url: removeUtmParams(entry.url),
          title: entry.title,
          text: entry.url + " " + entry.title,
      }
      await sendData(data);
    });

  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // console.log('Tab updated', { tabId, changeInfo, tab });
    tabUpdated$.next({
      t: Date.now(),
      title: tab.title,
      url: tab.url,
    });
  });
});
