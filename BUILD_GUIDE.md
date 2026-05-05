# OnlyCarPool — Android APK Build Guide

This guide explains how to compile the OnlyCarPool application into a native Android APK using Capacitor and Android Studio.

## Prerequisites

1. **Node.js**: Installed on your system (v18+ recommended).
2. **Android Studio**: Download and install [Android Studio](https://developer.android.com/studio).
3. **Java Development Kit (JDK)**: Ensure JDK 17+ is installed (often bundled with Android Studio).

## Step-by-Step Instructions

### Step 1: Build the Web Assets
Before compiling for Android, you must build the production web assets. Open your terminal in the `D:\OnlyCarPool` directory and run:

```bash
npm run build
```
*This creates the `dist` folder containing the optimized React application.*

### Step 2: Sync with Capacitor
Sync the built web assets and native plugins with the Android platform project:

```bash
npx cap sync
```

### Step 3: Open Android Studio
Open the generated Android project directly in Android Studio from the terminal:

```bash
npx cap open android
```

### Step 4: Build the APK in Android Studio

1. Once Android Studio opens, wait for Gradle to finish syncing (watch the progress bar at the bottom right).
2. From the top menu bar, go to **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
3. Android Studio will begin compiling the APK.
4. Once completed, a notification will appear in the bottom right corner: "Build APK(s): APK(s) generated successfully".
5. Click **locate** in that notification, or navigate to `D:\OnlyCarPool\android\app\build\outputs\apk\debug\app-debug.apk`.

### Step 5: Install on Device

You can transfer `app-debug.apk` to your Android device via USB, email, or cloud storage, and install it. Ensure "Install from Unknown Sources" is enabled on your device.

> **Note on Permissions**: The app requests Location (`ACCESS_FINE_LOCATION`) and Notifications (`POST_NOTIFICATIONS`) per the AndroidManifest configuration.

### Troubleshooting
- **No `dist` folder error**: Make sure you ran `npm run build` before `npx cap sync`.
- **Gradle Sync Failed**: Check your JDK version in Android Studio (File > Settings > Build, Execution, Deployment > Build Tools > Gradle > Gradle JDK).
