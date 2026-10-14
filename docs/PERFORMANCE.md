# Performance and rendering

The build draws a full top-down 3600 × 2880 city every frame onto a 2D canvas and overlays HUD DOM components. This is a deliberate prototype tradeoff.

## Current limitations
- World geometry is rebuilt each frame rather than cached in static tile layers.
- Some entities receive a distance cull but vehicles still render globally.
- AI entities update whether or not they are on screen.
- Collision tests scan an array of building bounds.
- There is no spatial grid, streaming, occlusion culling, renderer worker or GPU instancing.

## Optimization roadmap
1. Tile-cache static world art into offscreen canvases.
2. Partition entities and collision polygons using spatial hashing.
3. Cull AI updates and render calls by distance.
4. Add a visible performance stats switch and repeatable FPS benchmarks.
5. If migrating to 3D, prototype asset budgets, level streaming and profiling before building a full city.

## Supported environment
Modern desktop browsers with Canvas 2D and localStorage enabled. Keyboard is the only fully implemented control scheme. No confirmed mobile/touch, controller, accessibility-reader or multi-browser QA matrix exists yet.
