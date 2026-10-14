# Gameplay systems reference

## Frame loop
The app uses requestAnimationFrame and caps delta time at 0.05 seconds to avoid large jumps when the tab was suspended. Each frame handles player controls, traffic, pedestrians, missions, decay of wanted level, camera and UI. Rendering uses HTML Canvas 2D. It is not a 3D renderer.

## World
City dimensions are 3600 × 2880 internal world units. 10 by 8 blocks, each 360 units, contain roads, buildings and green spaces. Seeded random placement creates repeatable scenery. Blocking tests use axis-aligned building rectangles. Coordinates are not real-world GPS.

## Walking
WASD/arrow keys move. Shift sprints until stamina runs out. Collision resolves axes independently so characters can slide around walls. Movement speed is expressed in arbitrary world units per second.

## Vehicles
E finds the nearest car within 64 units. When occupied, WASD drive/steer and E exits when space permits. Acceleration, friction, reverse speed and steering are intentionally arcade-style, not physics-simulator accurate. Vehicles have 0–100 health; crashes can damage them and raise the wanted indicator. Vehicle damage does not yet disable steering or lead to a failure state.

## Garage and cash
Two cyan garage markers exist at (235,155) and (2920,1840). Drive a vehicle within 115 units and press G to restore its health for $8 per point of damage. The game checks affordability. Jobs award cash when completed. There is currently no purchasing, selling, banking or inventory system.

## Traffic and pedestrians
38 AI cars move along simple routes and 75 pedestrians wander. They do not use navigation meshes, traffic signals, sophisticated avoidance or dialogue trees. Performance is primarily CPU/canvas dependent.

## Missions
Nine sequential missions contain travel, driving and timed objectives. A player receives a payout on success. N is a debug shortcut that skips the current mission without reward. Missions are not branching quests and currently have no cutscenes.

## Wanted level
Hard vehicle collisions raise a numeric wanted meter and it cools down over time. The star readout is an indicator only; no police pursuit AI exists.

## Saving
F5 saves a JSON snapshot to browser localStorage under `earlycity-save-v2`; F9 loads it. The prototype also attempts periodic autosave under a separate key, but F9 currently restores the manual save. Saves are local to the browser origin and are not cloud-synced. Editing localStorage can change progress; no anti-cheat is present.

## Day and night
The clock advances by 1.5 in-game minutes per real second. A transparent fullscreen tint illustrates nighttime and evening, rather than physically based lighting.
