// Here you can set up a service worker that will continue to work in the background as long as the extension is enabled
// You could use it to set up a web connection or an interval function, register certain events, save/load data, send or receive messages...
// In this project, the service worker will start an interval to check the total amount of tabs in the current window
// and send a message to trigger the alarm in the active tab if it exceeds the maximum.

let intervalID;

// Initialize the tabcheck when first installed
chrome.runtime.onInstalled.addListener(() => {
  console.log("Pingu Nootifier installed!");
  initTabCheck();
});

// Initialize the tabcheck when started up
chrome.runtime.onStartup.addListener(() => {
  console.log("Pingu Nootifier started up!");
  initTabCheck();
});

const initTabCheck = async () => {
  // The approach below starts up a regular interval function.
  // Generally this works fine, but if there is a period of inactivity from the user, the service worker can become inactive causing the interval to stop.
  // Google generally wants to deactivate workers when possible to save resources. So we need to find ways to keep it alive.
  // There are some different hacky methods. But it's currently recommended to use the Alarms API to set up repeating functions.
  // https://developer.chrome.com/docs/extensions/migrating/to-service-workers/#convert-timers
  if (!intervalID) {
    intervalID = setInterval(tabCheck, 3000);
  }

  // Create a repeating alarm (trigger once every minute) to keep the service alive and reset the interval if needed.
  // If you only need to repeat your function once every minute or longer, then you can just use this instead of setInterval.
  await chrome.alarms.create("tabCheckAlarm", { periodInMinutes: 1 });
};

// Listen for the alarm and reset the interval if it's undefined
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "tabCheckAlarm" && !intervalID) {
    intervalID = setInterval(tabCheck, 3000);
  }
});

const tabCheck = async () => {
  // Get the values from the popup
  const result = await chrome.storage.local.get(["maxTabs", "alarmLevel", "soundEnabled", "totalNoots"]);
  const maxTabs = result.maxTabs || 10;
  const alarmLevel = result.alarmLevel || 1;
  const soundEnabled = result.soundEnabled || false;
  let totalNoots = result.totalNoots || 0;

  // Get the tabs of the last focused window
  const allTabs = await chrome.tabs.query({ lastFocusedWindow: true });

  if (Array.isArray(allTabs) && allTabs.length > maxTabs) {
    // Get the currently active tab and send a message to trigger the alarm
    const activeTab = allTabs.filter((tab) => tab.active);
    // Checking url of the active tab to prevent sending messages to chrome// or edge// settings tabs
    if (activeTab.length > 0 && (activeTab[0].url.startsWith("https://") || activeTab[0].url.startsWith("file://"))) {
      chrome.tabs.sendMessage(activeTab[0].id, { triggerAlarm: true, soundEnabled: soundEnabled, alarmLevel: alarmLevel });
      // Update total noots
      totalNoots++;
      chrome.storage.local.set({ totalNoots: totalNoots });
    }
  }
};
