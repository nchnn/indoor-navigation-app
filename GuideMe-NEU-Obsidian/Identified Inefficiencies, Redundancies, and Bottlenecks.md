
The proposed indoor navigation system may encounter several inefficiencies, redundancies, and bottlenecks during development and actual use. Identifying these early can help keep the system lightweight, accurate, and easier to maintain.

### 1. Inefficiencies

| Area                  | Inefficiency                                                                                                      | Proposed Solution                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Map Loading**       | Loading an entire school/campus map at once can consume unnecessary resources.                                    | Load only the required building and floor.                                          |
| **3D Rendering**      | Rendering every room, wall, object, and floor in 3D can affect performance, especially on mobile devices.         | Use optimized 3D models and load only visible floors/areas.                         |
| **Pathfinding**       | Recalculating routes unnecessarily can waste processing time.                                                     | Recalculate only when the destination, starting point, or route conditions change.  |
| **Search**            | Searching through every map object repeatedly can become inefficient as locations increase.                       | Use indexed/searchable location data.                                               |
| **Database Requests** | Repeatedly requesting the same building or floor information from the server creates unnecessary network traffic. | Cache frequently used map data on the client.                                       |
| **Position Tracking** | Continuously requesting position updates at a high frequency can drain the user's battery.                        | Update the position at an appropriate interval or when significant movement occurs. |

---

### 2. Redundancies

### Duplicate Map Data

One major redundancy to avoid is creating completely separate data for the 2D and 3D maps.

**Bad approach:**

```text
2D Map
 ├── Room 101
 ├── Room 102
 └── Library

3D Map
 ├── Room 101
 ├── Room 102
 └── Library
```

This means that changing Room 101 would require updating it twice.

**Better approach:**

```text
             Building Data
                  │
          ┌───────┴───────┐
          ↓               ↓
        2D Map          3D Map
```

Both views should use the **same underlying building data**.

---

### Duplicate Location Information

Room information should not be repeated in multiple places.

Instead of:

```js
// 2D
room101.name = "Room 101"

// 3D
room101_3d.name = "Room 101"

// Search
room101_search.name = "Room 101"
```

Use one source:

```js
{
    id: "room-101",
    name: "Room 101",
    floor: 1,
    type: "classroom"
}
```

Then the 2D map, 3D map, search, and navigation system all reference it.

---

### Redundant Positioning Technologies (Optional Feature)

Another potential redundancy is implementing several positioning technologies at the beginning:

```text
GPS
BLE
Wi-Fi
UWB
QR
Phone Sensors
```

This would make the project unnecessarily complicated.

For the initial system, a better approach is:

```text
Manual Starting Point
        ↓
       QR Code
        ↓
Advanced Indoor Positioning
```

Positioning technologies can be introduced progressively.

---

# 3. Bottlenecks

### 3.1 Creating the Floor Plan

This may become one of the biggest bottlenecks.

The system requires accurate information about:

* Room locations
* Hallways
* Doors
* Stairs
* Elevators
* Building dimensions
* Floor connections

If the floor plan is inaccurate, the navigation will also be inaccurate.

```text
Incorrect Floor Plan
        ↓
Incorrect Navigation Graph
        ↓
Incorrect Route
        ↓
User gets lost
```

**Solution:** Establish an accurate floor-plan data source before implementing navigation.

---

### 3.2 Creating the Navigation Graph

The map itself is not enough.

The system needs to know where people can actually walk.

```text
Floor Plan
     +
Walkable Areas
     ↓
Navigation Graph
     ↓
A* Pathfinding
```

Manually creating nodes and connections for a large building can become time-consuming.

**Solution:** Start with one building/floor and develop tools that allow navigation nodes and connections to be created visually.

---

### 3.3 Multi-Floor Navigation

Navigating within one floor is relatively simple.

Navigating between floors introduces additional complexity:

```text
Floor 1
   ↓
Stairs / Elevator
   ↓
Floor 2
   ↓
Destination
```

The system must understand that a staircase or elevator connects two different navigation graphs.

**Solution:** Treat stairs and elevators as special **vertical connections** between floors.

---

### 3.4 Real-Time Indoor Positioning

This is potentially the **largest technical bottleneck**.

GPS cannot reliably provide the precision required for indoor navigation, while technologies such as BLE, Wi-Fi positioning, UWB, and sensor fusion require additional development and potentially hardware.

Therefore:

> **Real-time positioning should be treated as an advanced feature, not a requirement for the MVP.**

Start with:

```text
User selects starting point
        ↓
Navigation
```

Then:

```text
QR Code
   ↓
Known starting position
   ↓
Navigation
```

And only later:

```text
Indoor Positioning
        ↓
Real-time 🔵
        ↓
Dynamic navigation
```

---

### 3.5 3D Performance

A detailed 3D school model can become heavy.

For example:

```text
Too many:
Rooms
Walls
Furniture
Textures
Lighting
3D objects
        ↓
High GPU/CPU usage
        ↓
Low FPS
```

**Solution:**

* Use low-poly models.
* Avoid unnecessary furniture/details.
* Hide floors that aren't needed.
* Load 3D assets progressively.
* Optimize textures.
* Use level-of-detail techniques where appropriate.

---

# 4. Main Bottlenecks to Prioritize

I would rank the project's major bottlenecks like this:

| Priority | Bottleneck                   | Severity   |
| -------- | ---------------------------- | ---------- |
| 🔴 1     | Accurate floor-plan creation | Very High  |
| 🔴 2     | Navigation graph creation    | Very High  |
| 🔴 3     | Real-time indoor positioning | Very High  |
| 🟠 4     | Multi-floor routing          | High       |
| 🟠 5     | 3D performance               | High       |
| 🟡 6     | Backend/database scaling     | Medium     |
| 🟡 7     | Search optimization          | Low–Medium |

---

# 5. Overall Problem Analysis

The biggest issue with the project is **not actually React, Three.js, or the database**.

The difficult part is converting a **real physical building into structured spatial data** that a computer can understand.

The overall process is:

```text
REAL BUILDING
      ↓
FLOOR PLAN
      ↓
DIGITAL MAP
      ↓
LOCATION DATA
      ↓
WALKABLE AREAS
      ↓
NAVIGATION GRAPH
      ↓
PATHFINDING
      ↓
2D / 3D VISUALIZATION
      ↓
OPTIONAL USER POSITIONING
```

Therefore, the project should prioritize **accurate map data and navigation logic first**, rather than starting with the visually impressive 3D or real-time tracking features.

### Recommended MVP boundary

```text
                MVP
                 │
       ┌─────────┴─────────┐
       ↓                   ↓
   2D Floor Plan       Navigation
       │                   │
       ↓                   ↓
   Locations             A*
       │                   │
       └─────────┬─────────┘
                 ↓
             Route
                 ↓
               3D
```

Then later:

```text
             Advanced
                 ↓
       ┌─────────┴─────────┐
       ↓                   ↓
 Real-time Positioning   Accessibility
       ↓                   ↓
 BLE / Wi-Fi / UWB       Accessible Routes
```

This keeps the project **realistic, maintainable, and achievable** while still leaving room for the advanced features that would make it comparable to systems like Mappedin.



