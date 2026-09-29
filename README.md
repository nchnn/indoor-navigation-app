/*
 * File: README.md
 * Created: 2026-09-30 07:47 AM
 * Last Modified: 2026-09-30 07:47 AM
 */

# 🧭 GuideMe NEU — Indoor Navigation System

An indoor positioning and navigation mobile application designed for **New Era University (NEU)**, built with **React Native**, **Expo**, and **TypeScript**. It provides high-precision indoor mapping, dead reckoning (PDR), node-graph pathfinding, and an architectural-themed user experience.

---

## 🚀 Key Features

- **Interactive Vector Floor Maps**: Detailed SVG rendering of campus layouts, including ground-floor academic wings (M101–M106), dormitories, and multi-tier architectural grids.
- **Pedestrian Dead Reckoning (PDR)**: Real-time sensor-driven indoor position estimation and orientation tracking with automatic sensor self-diagnostics.
- **A\* Pathfinding & Turn-by-Turn Guidance**: Intelligent shortest-path routing between rooms, stairwells, and campus points of interest with live destination bars and route summary cards.
- **Smart Campus Search**: Quick search modal and autocomplete for rooms, buildings, labs, and essential facilities.
- **Institutional Auth**: Supports both institutional `@neu.edu.ph` login and instant guest access with profile management.
- **Design System & Theme Engine**: Elegant light/dark architectural palette matching the NEU institutional brand guidelines.

---

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev) (React Native 0.74+)
- **Language**: TypeScript 5.3+
- **Graphics & Vectors**: `react-native-svg`
- **Sensors & Device APIs**: `expo-sensors`, `expo-location`
- **Storage**: `@react-native-async-storage/async-storage`
- **Package Manager**: `pnpm`

---

## 📂 Project Structure

```
Indoor Navigation App/
├── .agents/                 # AI agent rules, guards, and governance specs
├── GuideMe-NEU-Obsidian/    # System architecture, PRDs, and documentation
├── indoor-navigator/        # Expo React Native mobile application
│   ├── assets/              # App branding, icons, and splash screens
│   └── src/
│       ├── components/      # UI components (auth, dashboard, map, navigation)
│       ├── constants/       # Feature definitions & quick shortcuts
│       ├── data/            # Campus floor node graphs and coordinates
│       ├── hooks/           # Custom React hooks (e.g. useLiveTracking)
│       ├── services/        # Positioning, A* routing, diagnostics, storage
│       ├── types/           # Shared TypeScript interfaces & models
│       └── theme.ts         # Single source of truth for color palette & styling
├── FILE_STRUCTURE.md        # Authoritative project file tree & history log
└── README.md                # Project documentation & overview
```

---

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (v18 or higher recommended)
- [pnpm](https://pnpm.io) (`npm install -g pnpm`)
- [Expo Go](https://expo.dev/go) app on iOS or Android for physical device testing

### Installation

1. Navigate to the mobile app directory:
   ```bash
   cd indoor-navigator
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the Expo development server:
   ```bash
   npx expo start
   ```

4. Scan the QR code using **Expo Go** (Android) or the default Camera app (iOS).

---

## 🔒 Security & Privacy

- **No Secrets in Repo**: All environment tokens, private keys, and credential stores are strictly ignored via `.gitignore`.
- **Local Persistence**: User profiles and offline cached maps are held securely in client-side storage without transmitting unauthorized telemetry.
