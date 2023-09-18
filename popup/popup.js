const maxTabsInput = document.getElementById("maxTabs");
const alarmLevelInput = document.getElementById("alarmLevel");
const soundEnabledInput = document.getElementById("soundEnabled");
const totalNootsEl = document.getElementById("totalNoots");

const loadInputValues = async () => {
  const result = await chrome.storage.local.get(["maxTabs", "alarmLevel", "soundEnabled", "totalNoots"]);
  const maxTabs = result.maxTabs || 10;
  const alarmLevel = result.alarmLevel || 1;
  const soundEnabled = result.soundEnabled || false;
  const totalNoots = result.totalNoots || "0";

  maxTabsInput.value = maxTabs;
  alarmLevelInput.value = alarmLevel;
  soundEnabledInput.checked = soundEnabled;
  totalNootsEl.innerText = totalNoots;
};

// Load initial values from storage
loadInputValues();

// Set input event listeners
maxTabsInput.addEventListener("keyup", () => {
  chrome.storage.local.set({ maxTabs: maxTabsInput.value }).then(() => {
    console.log("maxTabs updated")});
});

maxTabsInput.addEventListener("change", () => {
  chrome.storage.local.set({ maxTabs: maxTabsInput.value }).then(() => {
    console.log("maxTabs updated")});
});

alarmLevelInput.addEventListener("change", () => {
  chrome.storage.local.set({ alarmLevel: alarmLevelInput.value }).then(() => {
    console.log("alarmLevel updated")});
});

soundEnabledInput.addEventListener("change", () => {
  chrome.storage.local.set({ soundEnabled: soundEnabledInput.checked }).then(() => {
    console.log("soundEnabled updated")});
});
