# Indoor Navigation System — Project Goal & Feature Plan

## 1. Project Overview

The goal of this project is to develop a **web-based indoor navigation system** designed for a specific building or campus, such as a school. The system will allow users to explore an interactive digital representation of the building, search for rooms and facilities, view different floors, and receive step-by-step navigation to their desired destination.

The system will aim to provide an experience similar to modern indoor mapping platforms such as Mappedin, while being **custom-built specifically for the selected school/building**.

The project will support both **2D and 3D map visualization**, with the possibility of adding **real-time user positioning** in later development stages.

---

# 2. Main Goal

> **To develop an interactive indoor navigation system that digitally represents a school's buildings and facilities, allowing users to easily locate places, switch between 2D and 3D views, search for destinations, and navigate from one location to another through an optimized indoor route.**

The system should eventually allow a user to open the website on their phone, select a destination such as:

```text
New Era University
        ↓
Building
        ↓
Floor
        ↓
Room / Facility
```

and receive a visual route:

```text
             YOU
              ●
              │
              ↓
        ┌───────────┐
        │ Hallway   │
        └─────┬─────┘
              │
              ↓
        ┌───────────┐
        │ Stairs    │
        └─────┬─────┘
              │
              ↓
        ┌───────────┐
        │ Room 204  │
        └───────────┘
```

---

# 3. Project Objectives

The project should accomplish the following:

### 3.1 Digitalize the Building

Create an accurate digital representation of the selected school/building, including:

- Rooms
    
- Classrooms
    
- Offices
    
- Laboratories
    
- Libraries
    
- Restrooms
    
- Staircases
    
- Elevators
    
- Entrances and exits
    
- Hallways
    
- Other important facilities
    

### 3.2 Provide Interactive Maps

Users should be able to interact with the map by:

- Zooming
    
- Panning
    
- Clicking locations
    
- Selecting floors
    
- Rotating the 3D view
    
- Searching locations
    
- Viewing location information
    

### 3.3 Provide Indoor Navigation

Users should be able to select:

```text
Starting Point
      +
Destination
      ↓
Calculate Route
      ↓
Display Shortest / Best Route
```

The system should consider:

- Hallways
    
- Doors
    
- Stairs
    
- Elevators
    
- Restricted areas
    
- Different floors
    

### 3.4 Support 2D and 3D

Users should be able to switch between:

```text
┌──────────┐
│    2D    │
└──────────┘
      ↕
┌──────────┐
│    3D    │
└──────────┘
```

The 2D and 3D representations should use the **same underlying building data**.

### 3.5 Prepare for Real-Time Positioning

The architecture should be designed so that real-time positioning can be added later.

Eventually:

```text
User's Phone
     ↓
Position Detection
     ↓
X / Y / Floor
     ↓
Indoor Map
     ↓
     🔵
   YOU ARE HERE
```

---

# 4. Core Features

## 4.1 Interactive Floor Plan

The system should display a detailed floor plan.

Example:

```text
┌─────────────────────────────────┐
│ Classroom 101 │ Classroom 102   │
│               │                 │
├───────────────┴─────────────────┤
│                                 │
│            HALLWAY              │
│                                 │
├───────────────┬─────────────────┤
│ Laboratory    │    Library      │
│               │                 │
└───────────────┴─────────────────┘
```

Each location should be an interactive object rather than simply part of an image.

---

## 4.2 Floor Selection

For buildings with multiple floors:

```text
┌──────────────┐
│ Level 5      │
│ Level 4      │
│ Level 3      │
│ Level 2      │
│ Level 1  ✓   │
└──────────────┘
```

Selecting a floor changes the displayed map.

---

## 4.3 Location Search

Users can search for:

```text
Search locations...

[ Library                ]
[ Classroom 204          ]
[ Computer Laboratory    ]
[ Registrar's Office     ]
```

Search results should show:

- Location name
    
- Building
    
- Floor
    
- Location type
    
- Optional description
    

---

## 4.4 Location Details

When a user clicks a location:

```text
┌──────────────────────────┐
│ Computer Laboratory      │
│                          │
│ Building A - Floor 2     │
│                          │
│ Computer Laboratory      │
│ 40 computer units        │
│                          │
│ [ Navigate Here ]        │
└──────────────────────────┘
```

---

# 5. Navigation System

This will be one of the most important components.

## Basic Navigation

```text
Start:
Classroom 101

Destination:
Library

        ↓

Calculate Route

        ↓

Display Route
```

The system should visually highlight the route.

Example:

```text
       ┌────────────┐
       │ Classroom  │
       │    101     │
       └─────┬──────┘
             │
             │
═════════════╪══════════════
             │
             └──────────┐
                        │
                   ┌────▼─────┐
                   │ Library  │
                   └──────────┘
```

---

# 6. Pathfinding

The navigation engine should use a pathfinding algorithm such as **A***.

The building can be represented as a graph:

```text
       Room 101
          ●
          │
          ●
          │
          ●──────● Library
          │
          ●
          │
       Stairs
```

The system calculates:

```text
Current Location
       ↓
Navigation Graph
       ↓
A* Pathfinding
       ↓
Best Route
       ↓
Visual Route
```

The navigation system should eventually support:

- Shortest route
    
- Accessible route
    
- Stairs
    
- Elevators
    
- Multiple floors
    
- Blocked paths
    
- Restricted areas
    

---

# 7. Multi-Floor Navigation

The system should understand that floors are connected.

Example:

```text
Floor 3
   │
   │ Staircase
   ↓
Floor 2
   │
   │ Elevator
   ↓
Floor 1
```

A route could therefore be:

```text
Classroom 301
      ↓
Hallway
      ↓
Stairs
      ↓
Floor 2
      ↓
Hallway
      ↓
Library
```

---

# 8. 2D Map

The 2D mode should provide a clean top-down view.

Possible implementation:

```text
React
  │
  └── SVG / Map Rendering
          │
          ├── Rooms
          ├── Walls
          ├── Hallways
          ├── Doors
          └── Navigation Path
```

The 2D map should prioritize:

- Clarity
    
- Fast loading
    
- Easy navigation
    
- Mobile usability
    

---

# 9. 3D Map

The 3D mode should provide a more immersive representation.

Possible implementation:

```text
React
  ↓
React Three Fiber
  ↓
Three.js
  ↓
3D Building
```

The user should eventually be able to:

- Rotate the building
    
- Zoom
    
- Pan
    
- View floors
    
- Hide/show floors
    
- Select rooms
    
- Follow navigation routes
    

Example:

```text
             ┌───────────┐
            /           /|
           / Classroom / |
          /___________/  |
          |           |  |
          |  Hallway  | /
          |___________|/
```

---

# 10. 3D Floor Visibility

A useful feature would be the ability to hide upper floors.

Example:

```text
Building

☑ Floor 4
☑ Floor 3
☑ Floor 2
☑ Floor 1
```

Or:

```text
        Floor 3
        ███████
        ███████

        Floor 2
        ███████
        ███████

        Floor 1
        ███████
        ███████
```

Selecting Floor 2 could make the other floors transparent or hidden.

---

# 11. User Position Tracking

This should be considered an **advanced feature** rather than something required for the first version.

### Initial Version

Simulate the user's movement:

```text
🔵 ────────→ ────────→ 🏁
YOU                    DESTINATION
```

### Later Version

Use the user's actual device position.

Possible technologies include:

- GPS
    
- Wi-Fi positioning
    
- Bluetooth Low Energy (BLE)
    
- UWB
    
- Accelerometer
    
- Gyroscope
    
- Magnetometer
    
- Sensor fusion
    

The system should eventually display:

```text
             🔵
            YOU
             │
             ↓
        ┌───────────┐
        │ Hallway   │
        └─────┬─────┘
              │
              ↓
        ┌───────────┐
        │ Library   │
        └───────────┘
```

---

# 12. Turn-by-Turn Navigation

A more advanced version can provide instructions such as:

```text
1. Walk straight for 20 meters.

2. Turn right at the hallway.

3. Continue straight.

4. Take the stairs to Floor 2.

5. Turn left.

6. Your destination is on the right.
```

The instructions should update as the user moves.

---

# 13. "You Are Here" Feature

The map should display the user's current position:

```text
        🔵
       YOU ARE
        HERE
```

When positioning becomes available, the marker should update continuously.

---

# 14. Accessibility Navigation

An important future feature is an **accessible route**.

Instead of:

```text
Shortest Route
     ↓
Stairs
```

the user can select:

```text
♿ Accessible Route
```

and the system calculates:

```text
Elevator
   ↓
Hallway
   ↓
Destination
```

The system can avoid:

- Stairs
    
- Narrow paths
    
- Restricted areas
    
- Inaccessible entrances
    

---

# 15. Building/Floor Data Management

An administrator should eventually be able to manage the map.

### Admin features

- Add building
    
- Add floor
    
- Add room
    
- Edit room
    
- Delete room
    
- Add entrance
    
- Add stairs
    
- Add elevator
    
- Modify paths
    
- Mark areas as restricted
    
- Update room information
    

This prevents developers from having to modify the source code every time a room changes.

---

# 16. Admin Dashboard

Possible structure:

```text
ADMIN DASHBOARD

┌──────────────────────────────────┐
│ Buildings                    +   │
├──────────────────────────────────┤
│ Building A                      │
│ Building B                      │
└──────────────────────────────────┘

Selected Building: Building A

Floors:
[ 1 ] [ 2 ] [ 3 ] [ 4 ]

[ Edit Floor Plan ]
[ Manage Locations ]
[ Manage Routes ]
```

---

# 17. Database

The system should store building information in a database instead of hardcoding everything.

Possible structure:

```text
users
buildings
floors
locations
rooms
doors
paths
nodes
edges
navigation_settings
```

Example:

```text
BUILDING
   │
   ├── FLOOR
   │     │
   │     ├── ROOM
   │     ├── HALLWAY
   │     ├── STAIRS
   │     └── ELEVATOR
   │
   └── NAVIGATION GRAPH
          │
          ├── NODE
          └── EDGE
```

---

# 18. Suggested Technology Stack

## Frontend

```text
React
Vite
TypeScript
```

### 2D

```text
SVG
MapLibre GL JS
```

### 3D

```text
Three.js
React Three Fiber
```

### State Management

```text
Zustand
```

---

## Backend

```text
Node.js
Express.js
```

## Database

```text
MySQL
```

## Navigation

```text
A* Pathfinding
```

---

# 19. Proposed System Architecture

```text
                         USER
                           │
                           ↓
                    React Frontend
                           │
             ┌─────────────┴─────────────┐
             ↓                           ↓
          2D Map                       3D Map
       SVG / MapLibre              Three.js / R3F
             │                           │
             └─────────────┬─────────────┘
                           ↓
                    Navigation Engine
                           │
                        A* Graph
                           │
                           ↓
                     REST API
                           │
                    Node.js / Express
                           │
                           ↓
                         MySQL
```

---

# 20. Project Development Phases

The project should **not attempt to build everything at once**.

## Phase 1 — Foundation

- Create React + Vite project
    
- Set up project structure
    
- Create basic UI
    
- Create navigation layout
    
- Create map container
    

**Goal:** Get the application running.

---

## Phase 2 — Floor Plan

- Create the first floor plan
    
- Draw rooms
    
- Draw hallways
    
- Add doors
    
- Add stairs
    
- Add facilities
    
- Add room labels
    

**Goal:** Create a usable digital floor plan.

---

## Phase 3 — Interactive Map

- Click rooms
    
- Select locations
    
- Search locations
    
- Zoom
    
- Pan
    
- Floor switching
    

**Goal:** Turn the floor plan into an interactive map.

---

## Phase 4 — Navigation

- Create navigation nodes
    
- Create edges
    
- Implement A*
    
- Select starting point
    
- Select destination
    
- Draw route
    

**Goal:** Make the system actually navigate.

---

## Phase 5 — Multi-Floor Navigation

- Connect floors
    
- Add stairs
    
- Add elevators
    
- Calculate routes between floors
    

**Goal:** Navigate throughout the entire building.

---

## Phase 6 — 3D

- Create 3D rooms
    
- Create walls
    
- Create floors
    
- Add 3D facilities
    
- Add camera controls
    
- Implement 2D/3D toggle
    

**Goal:** Create the Mappedin-style 3D experience.

---

## Phase 7 — Backend

- Create API
    
- Create database
    
- Store building data
    
- Store rooms
    
- Store floors
    
- Store navigation nodes
    
- Create admin management
    

**Goal:** Make the system dynamic instead of hardcoded.

---

## Phase 8 — Position Tracking

Start with:

```text
Simulated Position
       ↓
GPS
       ↓
Indoor Positioning
```

**Goal:** Eventually allow the map to follow the user while walking.

---

## Phase 9 — Advanced Features

Possible additions:

- Turn-by-turn navigation
    
- Accessible routes
    
- QR-code starting locations
    
- BLE positioning
    
- UWB positioning
    
- Emergency exits
    
- Room availability
    
- Events
    
- Building information
    
- Offline maps
    
- Mobile/PWA support
    
- Analytics
    

---

# 21. QR Code Navigation

This could be a particularly useful feature for a school.

Place a QR code at locations such as:

```text
Building Entrance
      ↓
   [ QR CODE ]
      ↓
"Start navigation from here"
```

A student scans it and the system automatically knows:

```text
Starting Location:
Main Entrance
```

Then they select:

```text
Destination:
Computer Laboratory
```

and navigation starts immediately.

---

# 22. Emergency Navigation

An advanced feature could provide:

```text
🚨 Emergency Mode
```

The system could display:

```text
YOU ARE HERE
     🔵
     │
     ↓
Nearest Exit
     🚪
```

It could calculate an appropriate route to:

- Emergency exits
    
- Fire exits
    
- Assembly areas
    

This would make the project more useful beyond ordinary room navigation.

---

# 23. Performance Requirements

The system should be designed to work smoothly on:

- Desktop
    
- Laptop
    
- Tablet
    
- Mobile phone
    

The 2D map should be lightweight, while the 3D mode can use more resources.

The application should avoid loading the entire campus/building unnecessarily.

For example:

```text
Building A
   ↓
Floor 2
   ↓
Only load required map data
```

---

# 24. Security

The system should also consider:

- Admin authentication
    
- Role-based access
    
- API authentication
    
- Input validation
    
- Database security
    
- Protected administrative endpoints
    
- Secure handling of user positioning data
    

Real-time location data should be treated carefully because it can reveal where a person is inside the building.

---

# 25. Final Project Vision

The final system should feel something like:

```text
┌──────────────────────────────────────────────┐
│ 🏫 SCHOOL INDOOR NAVIGATION                  │
│                                              │
│ 🔍 Search classroom, office, facility...     │
│                                              │
│             ┌─────────────────────┐          │
│             │                     │          │
│             │      SCHOOL MAP     │          │
│             │                     │          │
│             │        🔵 YOU       │          │
│             │          │          │          │
│             │          └──────→   │          │
│             │             📍      │          │
│             │                     │          │
│             └─────────────────────┘          │
│                                              │
│ Floor: [ 1 ] [ 2 ] [ 3 ]                    │
│                                              │
│ View: [ 2D ] [ 3D ]                          │
│                                              │
│ Destination: Computer Laboratory             │
│                                              │
│ [ Start Navigation ]                         │
└──────────────────────────────────────────────┘
```

Eventually:

```text
              ┌──────────────────────┐
              │  INDOOR NAVIGATION   │
              ├──────────────────────┤
              │                      │
              │       🏫 3D MAP      │
              │                      │
              │          🔵          │
              │          │           │
              │          ↓           │
              │      ┌───────┐       │
              │      │ LAB   │       │
              │      └───────┘       │
              │                      │
              ├──────────────────────┤
              │ Floor 2               │
              │                      │
              │ 🧭 12m to destination │
              │ ↱ Turn right          │
              └──────────────────────┘
```

# 26. MVP — Minimum Viable Product

To prevent the project from becoming too large, the **first working version should only contain:**

-  React + Vite application
    
-  One school building
    
-  One floor
    
-  Custom floor plan
    
-  Rooms and facilities
    
-  Clickable locations
    
-  Search
    
-  Floor plan zoom/pan
    
-  Starting location
    
-  Destination selection
    
-  A* route calculation
    
-  Visual route
    
-  Basic 2D/3D toggle
    

Then everything else can be added progressively.

> **Important:** Real-time indoor tracking should **not be part of the first milestone**. It is one of the hardest parts of the entire system. First prove that your **map → locations → navigation graph → route → 2D/3D rendering** works. Once that foundation is solid, adding a live "🔵 You Are Here" position becomes much more manageable.

This gives you a project that is not just a **3D map**, but a complete **Indoor Mapping + Navigation Platform** with a clear path from a simple prototype to a Mappedin-like system.