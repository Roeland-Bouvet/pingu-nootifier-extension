// This script will be injected in the active page.
// Avoid variable name conflicts by making everything function scoped.

const initPinguNootifier = () => {
  console.log("Pingu Nootifier initialized!");

  // Variables
  const positions = [20, 30, 40, 50, 60, 70, 80];
  let alarmTriggered = false;

  // Setup injected resources
  const pinguSound = new Audio(chrome.runtime.getURL("resources/noot.mp3"));
  const pinguImageUrl = chrome.runtime.getURL("resources/128.png");
  const pinguImage = document.createElement("img");
  const pinguImageLarge = document.createElement("img");
  pinguImage.src = pinguImageUrl;
  pinguImageLarge.src = pinguImageUrl;
  pinguImage.id = "pingu-popup";
  pinguImageLarge.id= "pingu-popup-large";
  document.body.appendChild(pinguImage);
  document.body.appendChild(pinguImageLarge);

  // Helper functions
  const getRandom = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  // Create a listener to check for messages coming from the extension popup or background service
  // It's also possible to send messages from this script to the extension if need be
  // More info about messaging here https://developer.chrome.com/docs/extensions/mv3/messaging/
  chrome.runtime.onMessage.addListener(
    (request) => {
      if (request.triggerAlarm === true && !alarmTriggered) {
        alarmTriggered = true;
        // Show Pingu
        if (request.alarmLevel == 2) {
          pinguSound.playbackRate = 0.35;
          pinguImageLarge.classList.add("show-pingu");
          setTimeout(() => {
            pinguImageLarge.classList.remove("show-pingu");
          }, "2500");
          setTimeout(() => {
            alarmTriggered = false;
          }, "5000");
        } else {
          pinguSound.playbackRate = 1;
          pinguImage.style.left = "calc(" + getRandom(positions) + "% - 60px)";
          pinguImage.classList.add("show-pingu");
          setTimeout(() => {
            pinguImage.classList.remove("show-pingu");
          }, "1000");
          setTimeout(() => {
            alarmTriggered = false;
          }, "1200");
        }

        // Play noot
        if (request.soundEnabled === true) {
          playSound();
        }
      }
    }
  );

  // play() is blocked by browsers if there hasn't been any user activity on a page, so catch these errors to prevent error spam
  async function playSound() {
    try {
      await pinguSound.play();
    } catch (err) {}
  }
}

// We could check the DOM lifecycle here or run the function at a specific event, but in this case we can run it when it gets injected
initPinguNootifier();
