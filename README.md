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

1. Download `mnemnk-X.Y.Z-chrome.zip` from the release page.

2. Open Chrome Extensions page [chrome://extensions/](chrome://extensions/), and turn on "Developer mode" at the top right corner.

3. Drag and drop the downloaded `mnemnk-X.Y.Z-chrome.zip` onto the Chrome Extensions page.

<details>
  <summary><strong>Build from the repo</strong></summary>

1. Clone the repo

   ```shell
   git clone https://github.com/mnemnk/mnemnk-browser-extension.git
   ```
2. (optional) Modify the code and debug.

   ```shell
   npm run dev
   ```

3. Create a zip

   ```shell
   npm install
   npm run build
   npm run zip
   ```

4. Open `.output/chrome-mv3/`. You can find `mnemnk-X.Y.Z-chrome.zip`.

</details>

## Settings

You can configure the `address` and `API key` from the extension's options.

Make sure the settings match the API settings on the Settings page of the Mnemnk App (they are the same by default).

![](/docs/assets/options.png)

## Acknowledgments

* [WXT](https://wxt.dev/)
* [RxJS](https://rxjs.dev/)

<!----------------------------------------------------------------------------->

[License]: LICENSE

<!----------------------------------{ Badges }--------------------------------->

[Badge Language]: https://img.shields.io/github/languages/top/mnemnk/mnemnk-browser-extension
[Badge License]: https://img.shields.io/github/license/mnemnk/mnemnk-browser-extension
