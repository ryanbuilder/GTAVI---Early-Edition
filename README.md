# EARLY CITY

**A playable, independent browser-based open-world crime-game prototype.** Explore a large top-down city, drive vehicles, interact with traffic, pursue missions, earn money, and save your progress.

> **Status: v0.2.0 playable 2D vertical slice.** This is an original experimental project. It is not GTA VI, a Rockstar Games product, an early Rockstar build, or software compiled from CyberLeak/Cyberleek materials. No proprietary or leaked assets are included. Any AI-generated 3D video is **concept footage**, not captured gameplay.

## Launch the game

Download this repository and run a local static server from the project root:

```sh
python -m http.server 8000
```

Open http://localhost:8000 in a desktop browser. No `npm install`, commercial engine, account, or network assets required.

For GitHub Pages, select **Settings > Pages > Deploy from a branch**, then `main` and `/ (root)`. The game loads as a static website.

## Current playable features

| System | Current implementation |
| --- | --- |
| Open world | 3,600 × 2,880 px city with roads, apartments, shops, parks, decorative street lights |
| Character | Directional movement, sprinting, stamina, basic collision |
| Vehicles | Enter/exit nearby vehicles, steering, acceleration, braking, reversing, structural collision |
| Traffic | 38 autonomous moving cars, basic lane paths, collision feedback |
| Pedestrians | 75 roaming NPCs with rudimentary path movement and obstacle avoidance |
| Mission progression | 5 ordered missions, waypoint marker, completion rewards, timed challenge |
| Economy | Starting money, cash payouts, persistent money state |
| Heat | Simplified wanted rating increased by vehicle collisions, gradual decay |
| Vehicle condition | Damage when colliding with structures or traffic |
| Time | Accelerated in-game clock, visual day/night tint |
| HUD | Minimap, full city map, money, time, health, stamina, speed, vehicle condition, current objective |
| Persistence | Manual save/load using browser localStorage and lightweight periodic autosave |
| Performance | Canvas2D game loop, clamped frame delta, no external dependencies |

## Controls

| Key | Function |
| --- | --- |
| W A S D / arrow keys | Move on foot / accelerate, steer, brake while driving |
| Shift | Sprint on foot (drains stamina) |
| E | Enter nearest vehicle / exit current vehicle |
| M | Toggle city map |
| H | Toggle help screen |
| P or Escape | Pause / unpause |
| F5 | Save manually (replaces browser refresh shortcut within game) |
| F9 | Load manual save |
| N | Skip current mission, no reward (development shortcut) |
| Ctrl+R | Reset current game session (development shortcut) |

## Mission campaign

| ID | Objective | Reward |
| --- | --- | ---: |
| 01 Welcome to Early City | Travel to city center | $250 |
| 02 First Wheels | Drive to the garage | $650 |
| 03 Courier Shift | Drive to the warehouse | $900 |
| 04 Night Run | Reach the north checkpoint within 95 seconds | $1,400 |
| 05 City Explorer | Visit the west lookout | $1,800 |

Mission behavior is intentionally simple. This is not a full narrative campaign, multiplayer product, or 3D game.

## Repository contents

```text
early-city-prototype/
├── index.html                  Game canvas, interface, game shell
├── src/
│   ├── main.js                 World generation, simulation, interactions, missions, rendering, saves
│   └── style.css               Responsive HUD and menu styles
├── docs/
│   ├── ARCHITECTURE.md         Engine, simulation, data, limitations
│   ├── GAME_DESIGN.md          Design pillars, gameplay loop, missions and economy
│   ├── WORLD.md                City layout, navigation, density and districts
│   ├── ROADMAP.md              Prioritized milestones, future features
│   ├── TESTING.md              Manual acceptance and regression tests
│   ├── CONTRIBUTING.md         Development and change guidelines
│   └── ASSET_POLICY.md         Original-asset and provenance requirements
├── .github/ISSUE_TEMPLATE/     Bug and feature report forms
├── .gitignore
└── LICENSE                    MIT license for repository code
```

## Engineering notes

The prototype runs in a single `requestAnimationFrame` loop. Update uses delta time capped to 50 milliseconds. Input is tracked through an event-driven set. World data and geometry are deterministic from a seeded pseudorandom generator. Collision uses axis-aligned rectangles with radii approximations. Traffic currently follows straight road corridors rather than traffic-light-controlled routes. NPC logic uses random direction changes and obstacle checks; it does not implement NavMesh pathfinding or social AI. There is no server or authoritative networking, no combat system, no interior exploration, no police entities, no voice acting, and no actual 3D renderer.

## Development

Use a recent version of Node.js for a quick JavaScript syntax check:

```sh
node --check src/main.js
```

Test in Chromium and Firefox. The main target is a desktop keyboard and mouse environment. See [TESTING.md](docs/TESTING.md) for an acceptance checklist and known limitations.

## Contributing

Read [CONTRIBUTING.md](docs/CONTRIBUTING.md). Please submit original code, artwork, sound effects, or properly licensed contributions. Do not upload extracted files from unreleased commercial games.

## Legal

EARLY CITY is an independent fan-style technical experiment. No affiliation with Take-Two Interactive or Rockstar Games is claimed or implied. Trademarks belong to their owners. Code in this repository uses the included MIT license. Third-party contributions must respect their own licenses.
