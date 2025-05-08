import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  extensionApi: 'chrome',
  modules: [
    '@wxt-dev/module-svelte',
    '@wxt-dev/auto-icons',
  ],
  manifest: {
    permissions: ['activeTab', 'scripting', 'storage', 'tabs',],
    host_permissions: ["*://*/*"],
    action: {
      default_popup: 'src/entrypoints/popup/index.html'
    }
  },
});
