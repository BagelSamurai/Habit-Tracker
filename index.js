import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";
// 1. Import Auth functions
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// Replace the old appSettings with this new one, filling in YOUR actual keys
const appSettings = {
  apiKey: "AIzaSyBBuE6gIjLxAReBW6pNf_UOr34bTGxigMU",

  authDomain: "habitmate-cd360.firebaseapp.com",

  databaseURL: "https://habitmate-cd360-default-rtdb.firebaseio.com",

  projectId: "habitmate-cd360",

  storageBucket: "habitmate-cd360.firebasestorage.app",

  messagingSenderId: "401520283951",

  appId: "1:401520283951:web:0f6f5d537f9a8f8b4891da",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const auth = getAuth(app); // Initialize Auth

// Get DOM elements
const inputFieldEl = document.getElementById("input-field");
const dateFieldEl = document.getElementById("date-field");
const addButtonEl = document.getElementById("add-button");
const trackerListEl = document.getElementById("shopping-list"); // Reusing your existing ul ID

let userTrackersRef; // We will define this once the user is logged in

// 2. Handle Anonymous Authentication
signInAnonymously(auth).catch((error) => {
  console.error("Auth failed:", error.code, error.message);
});

// Listen for Auth state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    const uid = user.uid;
    // Create a database path unique to this user
    userTrackersRef = ref(database, `users/${uid}/trackers`);

    // Start listening for their specific data
    fetchUserTrackers(userTrackersRef);
  } else {
    trackerListEl.innerHTML = "Logging in...";
  }
});

// Add button logic
addButtonEl.addEventListener("click", function () {
  let eventName = inputFieldEl.value;
  let eventDate = dateFieldEl.value;

  if (eventName && eventDate) {
    // Push an object with name and date to the user's specific database path
    push(userTrackersRef, {
      name: eventName,
      date: eventDate,
    });
    clearInputFields();
  } else {
    alert("Please enter both a name and a date!");
  }
});

// Fetch and display logic
function fetchUserTrackers(dbRef) {
  onValue(dbRef, function (snapshot) {
    if (snapshot.exists()) {
      let itemsArray = Object.entries(snapshot.val());
      clearTrackerListEl();

      for (let i = 0; i < itemsArray.length; i++) {
        appendItemToTrackerListEl(itemsArray[i]);
      }
    } else {
      trackerListEl.innerHTML = "No trackers here... yet";
    }
  });
}

function clearTrackerListEl() {
  trackerListEl.innerHTML = "";
}

function clearInputFields() {
  inputFieldEl.value = "";
  dateFieldEl.value = "";
}

// 3. Countdown / Countup Logic
function appendItemToTrackerListEl(item) {
  let itemID = item[0];
  let itemData = item[1];

  let newEl = document.createElement("li");

  // Calculate days difference
  const targetDate = new Date(itemData.date);
  targetDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = targetDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Determine the number and the context text
  let numberText = "";
  let contextText = "";

  if (diffDays > 0) {
    numberText = diffDays;
    contextText = "days away";
  } else if (diffDays < 0) {
    numberText = Math.abs(diffDays);
    contextText = "days since";
  } else {
    numberText = "0";
    contextText = "Today!";
  }

  // Inject the structured HTML into the list item
  newEl.innerHTML = `
    <span class="tracker-name">${itemData.name}</span>
    <div class="tracker-numbers">
      <span class="huge-number">${numberText}</span>
      <span class="small-text">${contextText}</span>
    </div>
  `;

  // --- LONG PRESS LOGIC START ---
  let pressTimer;

  const performDelete = () => {
    // Keep it concise and clean
    if (confirm(`Delete "${itemData.name}"?`)) {
      const uid = auth.currentUser.uid;
      let exactLocationOfItemInDB = ref(
        database,
        `users/${uid}/trackers/${itemID}`,
      );
      remove(exactLocationOfItemInDB);
    }
  };

  const startPress = (e) => {
    pressTimer = setTimeout(performDelete, 800); // 800ms is standard for mobile long-press
  };

  const cancelPress = () => {
    clearTimeout(pressTimer);
  };

  newEl.addEventListener("mousedown", startPress);
  newEl.addEventListener("mouseup", cancelPress);
  newEl.addEventListener("mouseleave", cancelPress);

  newEl.addEventListener("touchstart", startPress, { passive: true });
  newEl.addEventListener("touchend", cancelPress);
  newEl.addEventListener("touchcancel", cancelPress);
  // --- LONG PRESS LOGIC END ---

  trackerListEl.append(newEl);
}
