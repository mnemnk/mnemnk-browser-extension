<div align="center">
  <h3 align="center">Mnemnk Browser Extension</h3>

![Badge Language] 
[![Badge License]][License]

  <a href="https://github.com/mnemnk/mnemnk-browser-extension">
    <img src="https://github.com/mnemnk/mnemnk-browser-extension/blob/main/docs/assets/Logo.png?raw=true" alt="Logo" width="71" height="71">
  </a>

  <p align="center">
    Browser extension for Mnemnk to record your web browsing history.
  </p>
</div>

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/)
* [Mnemnk App](https://github.com/mnemnk/mnemnk-app)
* [Mnemnk Lifelogging Agents](https://github.com/mnemnk/mnemnk-lifelogging-agents)

### Installation


1. Clone the repo

   ```shell
   npm install
   npm run build
   npm run zip
   ```

2. Open Chrome Extensions page [chrome://extensions/](chrome://extensions/), and turn on "Developer mode" at the top right corner.

3. Drag and drop `.output/chrome-mv3/mnemnk-X.Y.Z-chrome.zip` onto the Chrome Extensions page.


## Settings

You can configure the `address` and `API key` from the extension's options.

Make sure the settings match the API settings on the Settings page of the Mnemnk App (they are the same by default).

## Acknowledgments

* [WXT](https://wxt.dev/)
* [RxJS](https://rxjs.dev/)

<!----------------------------------------------------------------------------->

[License]: LICENSE

<!----------------------------------{ Badges }--------------------------------->

[Badge Language]: https://img.shields.io/github/languages/top/mnemnk/mnemnk-browser-extension
[Badge License]: https://img.shields.io/github/license/mnemnk/mnemnk-browser-extension
