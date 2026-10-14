# Technical architecture

## Platform

Single-player desktop browser app. Vanilla ECMAScript modules, HTML5 Canvas 2D and CSS. No framework, CDN, backend or external runtime dependencies.

## Runtime

`src/main.js` includes initialization, input, simulation, collision, missions, drawing and local persistence. The `requestAnimationFrame` loop calculates frame delta capped at 0.05 seconds, then calls `update(dt)` and `render()`.

## Simulation state

`game.player` stores position, heading, health, stamina and vehicle occupancy. `game.car` points to the currently controlled car. `game.owned` contains the starter vehicle; `worldCars` stores ambient traffic. `pedestrians` stores ambient NPCs. `game.missionIndex` controls mission progression. `game.money`, `wanted`, `time` and other values power the HUD.

## World

3600x2880 simulation rectangle with 360-unit grid cells, 102-unit roads, building polygons approximated as AABBs, park cells and lamp positions. City generation uses a seeded linear congruential pseudorandom generator for stable placement.

## Rendering

Canvas draw order: grass base → roads → blocks and parks → landmarks → mission marker → pedestrians → cars → protagonist → optional night tint → minimap. Camera follows player with lerp smoothing. UI is DOM over the Canvas.

## Collisions and limitations

Building collision tests entity radius against rectangles. Ambient traffic follows simple fixed corridors and is not obstacle-aware. Car-to-car contact is detected between the player vehicle and NPC vehicles using distance thresholds. It intentionally does not model rigid-body physics. NPC pedestrians wander locally and may clip through vehicles. The code currently lives in one main module; a component/ECS split is a future refactor, not existing infrastructure.

## Storage

Manual state saved to `localStorage['earlycity-save-v2']`; periodic autosave to `localStorage['earlycity-autosave-v2']`. Manual load restores the explicit manual save only. Save formats are not version-migrated. Browser storage can be disabled, cleared or quota limited.

## Security and data

No account authentication, analytics, cookies, uploads, calls to third-party APIs or remote multiplayer. There is no server-side trust boundary because all state resides on the local client.
