// Initialize global variables
const debugMenu = document.getElementById("debug-menu");
const contentCard = document.getElementById("content-card");
const statsCard = document.getElementById("stats-card");
const statsList = document.getElementById("stats-list");
const contentButtons = document.querySelectorAll(".content-item");
const contentSelect = document.getElementById("content-select");

const debugSequence = ["d", "e", "b", "u", "g"];
let debugSequenceInput = [];
let debugMenuOpened = false;

// Stats Object (Tracking Relevant Data)
const stats = {
  "Clicks": 0, // How many times buttons were clicked
  "Opened Debug Menu": 0, // How many times the debug menu was opened
  "Hidden Items Toggled": 0, // Tracks toggles
  "Time Played": 0, // In Seconds
  "FUN": Math.floor(Math.random() * 100) // Just a reference, does nothing
};

// Update Time Played every second
setInterval(() => {
  stats["Time Played"]++;
  if (!statsCard.classList.contains("hidden")) {
    updateStatsCard();
  }
}, 1000);

// Populate the dropdown menu dynamically with content buttons
function populateDropdown() {
  contentSelect.innerHTML = ""; // Clear the dropdown
  contentButtons.forEach((button) => {
    const option = document.createElement("option");
    option.value = button.id;
    option.textContent = button.textContent;
    contentSelect.appendChild(option);
  });
}

// Open the Debug Menu (No longer toggles off)
function openDebugMenu() {
  if (!debugMenuOpened) {
    debugMenu.classList.remove("hidden");
    debugMenuOpened = true;
    stats["Opened Debug Menu"]++;
    populateDropdown();
  }
}

// Close the Debug Menu
function closeDebugMenu() {
  debugMenu.classList.add("hidden");
  debugMenuOpened = false;
}

// Function to toggle the content card visibility
function toggleContentCard() {
  const isHidden = contentCard.classList.toggle("hidden");
  if (isHidden) {
    contentButtons.forEach((button) => button.classList.add("hidden"));
  } else {
    restoreContentStates();
  }
}

// Toggle individual content buttons
function toggleContentItem(id) {
  const button = document.getElementById(id);
  if (!button) return;
  const isHidden = button.classList.toggle("hidden");
  localStorage.setItem(id, isHidden ? "hidden" : "visible");

  stats["Hidden Items Toggled"]++;

  // If all buttons are hidden, hide the content card as well
  const allHidden = Array.from(contentButtons).every((btn) => btn.classList.contains("hidden"));
  if (allHidden) {
    contentCard.classList.add("hidden");
  }
}

// Toggle selected content from dropdown
function toggleSelectedContent() {
  const selectedContent = contentSelect.value;
  if (selectedContent) {
    toggleContentItem(selectedContent);
  }
}

// Restore content button states from localStorage
function restoreContentStates() {
  let anyVisible = false;
  contentButtons.forEach((button) => {
    const state = localStorage.getItem(button.id);
    if (state === "visible") {
      button.classList.remove("hidden");
      anyVisible = true;
    } else {
      button.classList.add("hidden");
    }
  });

  if (!anyVisible) {
    contentCard.classList.add("hidden");
  }
}

// Detect Debug Sequence (Only Opens Debug Menu)
document.addEventListener("keydown", (event) => {
  debugSequenceInput.push(event.key.toLowerCase());
  if (debugSequenceInput.slice(-debugSequence.length).join("") === debugSequence.join("")) {
    openDebugMenu();
    debugSequenceInput = []; 
  }
  if (debugSequenceInput.length > debugSequence.length) {
    debugSequenceInput.shift();
  }
});

// Toggle Stats Card
function toggleStatsCard() {
  statsCard.classList.toggle("hidden");
  if (!statsCard.classList.contains("hidden")) {
    updateStatsCard();
  }
}

// Update Stats Card with current values
function updateStatsCard() {
  statsList.innerHTML = "";
  for (const key in stats) {
    let value = stats[key];

    // Format Time Played into HH:MM:SS
    if (key === "Time Played") {
      let hours = Math.floor(value / 3600);
      let minutes = Math.floor((value % 3600) / 60);
      let seconds = value % 60;
      value = `${hours}:${minutes}:${seconds}`;
    }

    const listItem = document.createElement("li");
    listItem.textContent = `${key}: ${value}`;
    statsList.appendChild(listItem);
  }
}

// Track clicks on content buttons
contentButtons.forEach((button) => {
  button.addEventListener("click", () => {
    stats["Clicks"]++;
  });
});

// Restore content visibility on page load
window.onload = function () {
  restoreContentStates();
};
