# Pingu Nootifier

## Intro

This is a sample project which serves to demonstrate some of the capabilities of Chromium extensions. This readme contains information to get started, but you can also find comments in the code files. More extensive information can be found in the docs here: https://developer.chrome.com/docs/extensions/

Essentially, all you need to create an extension is a manifest.json file and a html file to display as the popup. This project goes a bit further and will show you how to inject resources into the pages that you view, how to save data persistently in the browser, and how to set up a communication channel between the extension and current page so the extension can trigger an action in the page (or vice versa of you want to).

Beware of your sound volume, as you will be noot nooted!

## Installing

You can clone this repo or download the files, and install the extension locally:

* In your Chromium brower (Chrome/Edge/...), go to "Manage Extensions" and enable "Developer mode".
* Press "Load unpacked" and select the /src folder of the extension.
* Enable the extension.

You only need to load in the extension once like this. Afterwards you can make changes to the source files and update the extension by simply pressing the reload or update button.

## Project structure

The manifest.json file needs to reside in the root folder. All the rest you can structure as you wish, but for this project it is set up as follows:

* The injected folder contains the script and stylesheet that will be injected in pages.
* The popup folder contains the html, css and script to display the extension popup.
* The resources folder contains the image (and audio) files we are using.
* The background.js file sets up a background worker process. In this project it's checking data saved on the extension and sending messages to the active page.
* The manifest.json is used to describe the extension and declare the resources and APIs we intend to use.

### Manifest.json

For the most basic extension it suffices to just include the fields that describe the extension and select what html to use as the default popup. In this extension we will do a bit more than that, so we need to declare a bit more. :)

```
{
  // Declare name, description and icons to display in the extensions tab
  "name": "Pingu Nootifier",
  "description": "Providing subtle nootifications for your betterment.",
  "version": "1.0",
  "manifest_version": 3,
  "icons": {
    "16": "resources/16.png",
    "32": "resources/32.png",
    "48": "resources/48.png",
    "128": "resources/128.png"
  },

  // Declare the html popup to display when opening the extension
  "action": {
    "default_popup": "popup/popup.html"
  },

  // Declare which Chrome extension APIs you want the extension to have access to
  "permissions": ["scripting", "tabs", "activeTab", "storage", "webRequest"],

  // Declare on what origins you allow the extension to be active
  "host_permissions": ["*://*/*"],

  // Declare a file to function as a backround service worker
  "background": {
    "service_worker": "background.js"
  },

  // Declare what resources you want to use on the active page, and on what origins it is allowed.
  "web_accessible_resources": [
    {
      "resources": ["resources/128.png", "resources/noot.mp3"],
      "matches": ["https://*/*", "file://*"]
    }
  ],

  // Declare what script/stylesheets you want to inject in the active page, on what origins it is allowed, and at what point in the DOM lifecycle they should be injected.
  "content_scripts": [
    {
      "matches": ["https://*/*", "file://*"],
      "css": ["injected/styling.css"],
      "js": ["injected/script.js"],
      "run_at": "document_idle"
    }
  ]
}
```
