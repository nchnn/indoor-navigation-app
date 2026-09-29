# Project Structure

Last Updated: 2026-09-30 07:47 AM

## Project Tree

```
Indoor Navigation App/
├── .agents/
├── .clinerules
├── .cursorrules
├── .gitignore
├── FILE_STRUCTURE.md
├── README.md
├── tsconfig.json
├── GuideMe-NEU-Obsidian/
│   ├── GOAL.md.md
│   ├── Identified Inefficiencies, Redundancies, and Bottlenecks.md
│   ├── Question on consultation.md
│   └── THEME_COLOR.md                        ← Design system & color specification
└── indoor-navigator/
    ├── .gitignore
    ├── App.tsx
    ├── LICENSE
    ├── THEME_COLOR.md                            ← Design system & color specification
    ├── app.json
    ├── babel.config.js
    ├── index.ts
    ├── package.json
    ├── pnpm-lock.yaml
    ├── tsconfig.json
    ├── assets/
    │   ├── adaptive-icon.png
    │   ├── favicon.png
    │   ├── icon.png
    │   └── splash-icon.png
    └── src/
        ├── theme.ts
        ├── types/
        │   ├── floor.ts                        ← Floor, room, and waypoint types
        │   └── user.ts                         ← Shared UserProfile type
        ├── constants/
        │   ├── features.ts                     ← FEATURES_LIST static data
        │   └── shortcuts.ts                    ← QUICK_SHORTCUTS static data
        ├── components/
        │   ├── common/
        │   │   └── Icon.tsx                    ← SVG icon library
        │   ├── auth/
        │   │   ├── LoginView.tsx               ← Full-screen login compositor
        │   │   ├── EduLoginModal.tsx           ← @neu.edu.ph email modal
        │   │   ├── GuestLoginModal.tsx         ← Guest nickname modal
        │   │   └── AuthModal.tsx               ← In-app account/profile modal
        │   ├── dashboard/
        │   │   ├── DashboardView.tsx           ← Dashboard compositor
        │   │   ├── DashboardHeader.tsx         ← Brand row + auth pill
        │   │   └── SearchBar.tsx               ← Search input + results dropdown
        │   ├── map/
        │   │   ├── BackgroundGrid.tsx          ← Two-tier SVG architectural background grid layer
        │   │   ├── DoubleFlightStairs.tsx      ← Architectural stairwell symbol component
        │   │   ├── FloorPlan.tsx               ← Modular static floor plan component
        │   │   ├── FloorPlanMap.tsx            ← SVG/canvas indoor floor plan
        │   │   ├── LiveTracker.tsx             ← Real-time PDR tracking UI
        │   │   ├── MapControls.tsx             ← Zoom / recenter / north buttons
        │   │   └── RoomCell.tsx                ← Classroom and wing room cell component
        │   └── navigation/
        │       ├── DestinationBar.tsx          ← Origin/destination top bar
        │       ├── RouteCard.tsx               ← Turn-by-turn route summary card
        │       └── PlaceSheet.tsx              ← Bottom sheet place picker
        ├── data/
        │   ├── floors/
        │   │   └── floor.ts                    ← Floor and room definition data
        │   └── old.dorm3F.ts                   ← Level 3 node graph backup
        ├── hooks/
        │   └── useLiveTracking.ts              ← PDR + GPS live tracking hook
        └── services/
            ├── positioning.ts                  ← Positioning math utilities
            ├── routing.ts                      ← A* pathfinding & route helpers
            ├── selfCheck.ts                    - Sensor self-diagnostics
            └── store.ts                        - AsyncStorage persistence
```

---

## History Log

### 2026-09-30

🕑 07:47 AM | 📄✨ Created File | .gitignore
🕑 07:47 AM | 📄✨ Created File | README.md

### 2026-09-29

🕑 09:37 PM | 📄✨ Created File | indoor-navigator/src/components/map/BackgroundGrid.tsx
🕑 09:37 PM | 📄✂️ Extracted File | indoor-navigator/src/components/map/BackgroundGrid.tsx (from FloorPlan)
🕑 09:37 PM | 📄✏️ Modified File | indoor-navigator/App.tsx (layered BackgroundGrid behind FloorPlan)
🕑 05:45 PM | 📄✨ Created File | GuideMe-NEU-Obsidian/THEME_COLOR.md
🕑 05:45 PM | 📄✨ Created File | indoor-navigator/THEME_COLOR.md
🕑 02:00 PM | 📄✏️ Renamed File | indoor-navigator/src/data/wingM101.ts → indoor-navigator/src/data/firstFloor.ts
🕑 02:00 PM | 📄✏️ Modified File | indoor-navigator/App.tsx (updated data import to firstFloor)
🕑 02:00 PM | 📄✏️ Modified File | indoor-navigator/src/components/map/RoomWingMap.tsx (updated data import to firstFloor)
🕑 02:00 PM | 📄✏️ Modified File | indoor-navigator/src/data/firstFloor.ts (updated header to first-floor school graph)
🕑 12:00 PM | 📁✨ Created Folder | projects/guideme-neu/context/core-domains/
🕑 12:00 PM | 📄✨ Created File | projects/guideme-neu/context/core-domains/product-requirements.md
🕑 12:00 PM | 📄✨ Created File | projects/guideme-neu/context/core-domains/system-architecture.md
🕑 12:00 PM | 📄✨ Created File | projects/guideme-neu/context/core-domains/database-schema.md
🕑 12:00 PM | 📄✨ Created File | projects/guideme-neu/context/core-domains/design-system.md
🕑 12:00 PM | 📄✨ Created File | projects/guideme-neu/context/core-domains/general-rules.md
🕑 12:00 PM | 📄✨ Created File | .agents/GUIDEME-NEU-SCOPE.md

### 2026-09-23

🕑 12:44 AM | 🗂️✨ Created Folder   | src/types/
🕑 12:44 AM | 📄✨ Created File     | src/types/user.ts
🕑 12:44 AM | 🗂️✨ Created Folder   | src/constants/
🕑 12:44 AM | 📄✨ Created File     | src/constants/shortcuts.ts
🕑 12:44 AM | 📄✨ Created File     | src/constants/features.ts
🕑 12:44 AM | 🗂️✨ Created Folder   | src/components/common/
🕑 12:44 AM | 📄🚚 Moved File       | src/components/Icon.tsx → src/components/common/Icon.tsx
🕑 12:44 AM | 🗂️✨ Created Folder   | src/components/auth/
🕑 12:44 AM | 📄🚚 Moved File       | src/components/LoginView.tsx → src/components/auth/LoginView.tsx
🕑 12:44 AM | 📄✂️ Extracted File   | src/components/auth/EduLoginModal.tsx (from LoginView)
🕑 12:44 AM | 📄✂️ Extracted File   | src/components/auth/GuestLoginModal.tsx (from LoginView)
🕑 12:44 AM | 📄🚚 Moved File       | src/components/AuthModal.tsx → src/components/auth/AuthModal.tsx
🕑 12:44 AM | 🗂️✨ Created Folder   | src/components/dashboard/
🕑 12:44 AM | 📄🚚 Moved File       | src/components/DashboardView.tsx → src/components/dashboard/DashboardView.tsx
🕑 12:44 AM | 📄✂️ Extracted File   | src/components/dashboard/DashboardHeader.tsx (from DashboardView)
🕑 12:44 AM | 📄✂️ Extracted File   | src/components/dashboard/SearchBar.tsx (from DashboardView)
🕑 12:44 AM | 🗂️✨ Created Folder   | src/components/map/
🕑 12:44 AM | 📄🚚 Moved File       | src/components/FloorPlanMap.tsx → src/components/map/FloorPlanMap.tsx
🕑 12:44 AM | 📄🚚 Moved File       | src/components/MapControls.tsx → src/components/map/MapControls.tsx
🕑 12:44 AM | 📄🚚 Moved File       | src/components/LiveTracker.tsx → src/components/map/LiveTracker.tsx
🕑 12:44 AM | 🗂️✨ Created Folder   | src/components/navigation/
🕑 12:44 AM | 📄🚚 Moved File       | src/components/DestinationBar.tsx → src/components/navigation/DestinationBar.tsx
🕑 12:44 AM | 📄🚚 Moved File       | src/components/RouteCard.tsx → src/components/navigation/RouteCard.tsx
🕑 12:44 AM | 📄🚚 Moved File       | src/components/PlaceSheet.tsx → src/components/navigation/PlaceSheet.tsx
🕑 12:44 AM | 📄✏️ Modified File    | App.tsx (updated all import paths to feature subfolders)
🕑 12:44 AM | 📄✏️ Modified File    | src/services/store.ts (re-exports UserProfile from types/user)
🕑 02:26 AM | 📄✏️ Modified File    | src/components/common/Icon.tsx (added plus/minus/locate icons, theme token compliance)
🕑 02:26 AM | 📄✏️ Modified File    | src/components/map/MapControls.tsx (replaced text symbols with Lucide SVG Icons, theme tokens)
🕑 02:26 AM | 📄✏️ Modified File    | src/components/map/LiveTracker.tsx (fixed dorm3F import path, cleaned text and symbols)
🕑 02:26 AM | 📄✏️ Modified File    | src/components/navigation/RouteCard.tsx (fixed routing import path, cleaned text)
🕑 02:26 AM | 📄✏️ Modified File    | src/components/navigation/PlaceSheet.tsx (replaced mode symbols with SVG icons, clean text)
🕑 02:26 AM | 📄✏️ Modified File    | src/components/navigation/DestinationBar.tsx (standardized theme tokens and text)
🕑 02:26 AM | 📄✏️ Modified File    | src/components/map/FloorPlanMap.tsx (switched legacy pinkGlow to primaryGlow)


### 2026-09-22

🕑 11:58 PM | 📄✨ Created File     | src/components/LoginView.tsx
🕑 11:53 PM | 📄✨ Created File     | FILE_STRUCTURE.md
🕑 11:50 PM | 📄✨ Created File     | src/components/DashboardView.tsx
🕑 11:49 PM | 📄✨ Created File     | src/components/AuthModal.tsx
