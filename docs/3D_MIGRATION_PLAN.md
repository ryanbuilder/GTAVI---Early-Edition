# Path from 2D prototype to real 3D game

A 3D game is **not** included in this repository. The following work is a proposed implementation plan.

## Milestone A: vertical slice
Choose a real 3D engine (Godot 4, Unreal Engine 5 or Unity) based on team skills. Build one 200m × 200m fictional block, one controllable character, third-person camera and one drivable vehicle. Use placeholder original/licensed art. Record footage from a running game, not text-to-video generation.

## Milestone B: systems parity
Port on-foot movement and camera, driving controller, collision and vehicle damage, objectives, HUD, economy, and save/load. Introduce a scene/entity management layer, animation graph and physically plausible vehicle dynamics.

## Milestone C: world simulation
Implement pedestrian navigation, traffic lights and intersections, police chase behavior, streaming grid, ambient sound, weather and day/night lighting. Add build reproducibility and automated gameplay smoke tests.

## Milestone D: release pipeline
Add graphics scalability, gamepad input, accessibility settings, QA sessions, packaging for target platforms, license reviews and publicly verifiable demonstrations.

### Reality check
A browser-based 2D game with moving cars does not demonstrate a GTA-scale 3D engine. Public clips should clearly distinguish concept footage, pre-rendered cinematics, and actual recorded gameplay.
