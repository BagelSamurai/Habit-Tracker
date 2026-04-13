# HabitTracker 🎯

A sleek, minimalistic web application designed to track upcoming events (countdowns) or past habits (countups). Built with a focus on high-contrast, distraction-free UI, secure user-specific data storage, and modern web development practices.

![App Preview](placeholder-for-your-screenshot.png)

## ✨ Features

* **Dynamic Time Tracking:** Automatically calculates days *until* a future event (countdown) or days *since* a past event (countup).
* **Frictionless Onboarding:** Uses Firebase Anonymous Authentication. Users can start saving data immediately without filling out a signup form.
* **Secure Cloud Storage:** Powered by Firebase Realtime Database. Security rules ensure users can only access and modify their own trackers.
* **Mobile-First UX:** Clean, card-based UI with a native-feeling "long-press to delete" safety feature.
* **PWA Ready:** Includes a `manifest.json` and custom favicons, allowing users to install the app directly to their iOS or Android home screens as a standalone app.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6 Modules)
* **Bundler:** Vite
* **Backend:** Firebase Realtime Database
* **Authentication:** Firebase Auth (Anonymous)
* **Hosting:** Firebase Hosting

## 📱 Install as a Mobile App

This project is a **Progressive Web App (PWA)**, meaning you can install it directly to your phone's home screen for a full-screen, native experience without using an App Store.

### For iOS (iPhone/iPad)
1. Open the app link in **Safari**.
2. Tap the **Share** icon (square with an up arrow) at the bottom.
3. Scroll down and tap **"Add to Home Screen"**.
4. Tap **Add** in the top right corner.

### For Android
1. Open the app link in **Chrome**.
2. Tap the **Three Dots (⋮)** in the top right corner.
3. Tap **"Install app"** or **"Add to Home screen"**.
4. Follow the on-screen prompts to confirm.

## 🚀 Getting Started (Local Development)

To run this project locally, you will need [Node.js](https://nodejs.org/) installed on your machine and your own Firebase project.

### 1. Project Setup
Clone this repository and install the required dependencies:
```bash
npm install
```

### 2. Firebase Setup
1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Navigate to **Authentication** -> **Sign-in method** and enable **Anonymous**.
3. Navigate to **Realtime Database** and create a new database.
4. Register a "Web App" in your Firebase Project Settings to get your configuration keys.

### 3. Connect Your App
Open `index.js` and replace the `appSettings` object with your unique Firebase keys:

```javascript
const appSettings = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 4. Run the Local Server
Start the Vite development server to see your changes live:
```bash
npm run dev
```

## 🔒 Database Security Rules

To ensure users can only access their own data, navigate to the **Rules** tab of your Firebase Realtime Database and paste the following:

```json
{
  "rules": {
    ".read": false,
    ".write": false,
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    }
  }
}
```

## 📦 Building & Deployment

This project uses Vite to bundle the code and Firebase Hosting to serve it. 

1. **Build the project:** This command compiles your code and outputs it to a `dist` folder.
   ```bash
   npm run build
   ```
2. **Deploy to Firebase:** Ensure your `firebase.json` has its public directory set to `"dist"`, then run:
   ```bash
   firebase deploy
   ```

## 🗺️ Roadmap

### 🔜 Upcoming
* **Dedicated Landing Page:** A polished website to showcase features and onboarding.
* **Smart Installation Prompt:** In-app triggers to easily guide users to "Add to Home Screen."

### 🚀 Near Future
* **Framework Migration:** Rebuilding with a modern web framework (e.g., React or Next.js) for better state management.
* **App Store Deployment:** Utilizing tools like Capacitor or Tauri to package the app for the Apple App Store and Google Play Store.

---

<p align="center">
  Made with ❤️ by <b>Rohan</b>
</p>
