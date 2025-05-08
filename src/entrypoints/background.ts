import { debounceTime, Subject } from "rxjs";
import { sendData, removeUtmParams, isExcludeUrl } from "@/lib/utils";

type TabUpdatedEvent = {
  t: number
  title?: string
  url?: string
};

export default defineBackground(() => {
  // console.log('Start background!', { id: browser.runtime.id });

  let lastUrl: string | undefined = "";

  // Listen for messages from the popup or content script
  browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "sendPageData") {
      (async () => {
        try {
          const result = await sendData({
            url: message.url,
            title: message.title,
            content: message.content,
            action: message.customAction
          });
          
          if (result.ok) {
            sendResponse({ success: true, status: result.status });
          } else {
            sendResponse({ success: false, error: result.status });
          }
        } catch (error) {
          console.error("Error sending data:", error);
          sendResponse({ 
            success: false, 
            error: error.message || "Unknown error occurred" 
          });
        }
      })();
      
      // Indicate that the response will be sent asynchronously
      return true;
    }
  });

  const tabUpdated$ = new Subject<TabUpdatedEvent>();
  tabUpdated$
    .pipe(debounceTime(500))
    .subscribe(async (entry: TabUpdatedEvent) => {
      if (!entry.url || await isExcludeUrl(entry.url)) {
        return;
      }
      let url = removeUtmParams(entry.url);
      if (lastUrl === url) {
        return;
      }
      lastUrl = url;
      
      try {
        await sendData({
          url: url,
          title: entry.title,
        });
      } catch (error) {
        console.error("Error in automatic tracking:", error);
      }
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
