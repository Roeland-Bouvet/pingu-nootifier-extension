// Here you can set up a service worker that will continue to work in the background as long as the extension is enabled
// You could use it to set up a web connection or an interval function, register certain events, save/load data, send or receive messages...
// In this project, the service worker will start an interval to check the total amount of tabs in the current window
// and send a message to trigger the alarm in the active tab if it exceeds the maximum.
let intervalID;

// Initialize the tabcheck when first installed
chrome.runtime.onInstalled.addListener(() => {
  console.log('Pingu Nootifier installed!');
  initTabCheck();
});

// Initialize the tabcheck when started up
chrome.runtime.onStartup.addListener(() => {
  console.log('Pingu Nootifier started up!');
  initTabCheck();
});

const initTabCheck = () => {
  // Set up the interval if it's not running yet
  if (!intervalID) {
    intervalID = setInterval(tabCheck, 3000);
  }
};

const tabCheck = async () => {
  // Get the values from the popup
  const result = await chrome.storage.local.get(["maxTabs", "alarmLevel", "soundEnabled", "totalNoots"]).then((result) => result);
  const maxTabs = result.maxTabs || 10;
  const alarmLevel = result.alarmLevel || 1;
  const soundEnabled = result.soundEnabled || false;
  let totalNoots = result.totalNoots || 0;

  // Get the tabs of the last focused window
  const allTabs = await chrome.tabs.query({ lastFocusedWindow: true });

  if (Array.isArray(allTabs) && allTabs.length > maxTabs) {
    // Get the currently active tab and send a message to trigger the alarm
    const activeTab = allTabs.filter((tab) => tab.active);
    // Checking if the active tab starts with a http to prevent sending messages to chrome// or edge// settings tabs
    if (activeTab.length > 0 && activeTab[0].url.startsWith("http")) {
      chrome.tabs.sendMessage(activeTab[0].id, { triggerAlarm: true, soundEnabled: soundEnabled, alarmLevel: alarmLevel });
      // Update total noots
      totalNoots++;
      chrome.storage.local.set({ totalNoots: totalNoots }).then(() => { console.log("Noots updated") });
    }
  }
};
