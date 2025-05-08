import { writable } from "svelte/store";
import type { StorageItemKey } from "wxt/storage";

// In theory, it should be possible to remove the storageItem.watch call
// and only listen to changes in the svelte store,
// but then the changes don't propagate from popup to content/background.
// Improvements welcome!
function createStore<T>(value: T, storageKey: StorageItemKey) {
  const { subscribe, set } = writable(value);

  const storageItem = storage.defineItem<T>(storageKey, {
    fallback: value,
  });

  storageItem.getValue().then(set);

  const unwatch = storageItem.watch(set); // not sure when or where to call unwatch

  return {
    subscribe,
    set: (value: T) => {
      storageItem.setValue(value);
    },
  };
}

export const address = createStore("localhost:3296", "local:address");
export const api_key = createStore("", "local:api_key");
export const excludeUrls = createStore<string[]>(
  ["^(?!https?)", "^http://localhost"],
  "local:excludeUrls"
);

// custom action
export const customActions = createStore<string[]>(
  ["clip"],
  "local:customActions"
);
