# QA and acceptance checklist

## Smoke test

1. Start `python -m http.server 8000`; navigate to http://localhost:8000.
2. Confirm HUD, streets, vehicles, NPCs and minimap render without a console error.
3. Move with WASD and arrow keys; verify collision against buildings and boundaries.
4. Hold Shift while moving; confirm stamina decreases and regenerates when released.
5. Approach a car; press E. Drive with WASD; press E to exit where space permits.
6. Reach the first yellow marker; confirm mission count increments and $250 is paid.
7. Open M map and H help; close them; pause with P.
8. Press F5; reload the tab using browser UI; press F9 and check restored location and cash.
9. Drive into a building at speed; verify reduced vehicle condition.
10. Reach mission 4 and test timer expiry and reset.

## Browser test matrix

- Chromium desktop: target
- Firefox desktop: target
- Safari desktop: not verified
- Mobile touch: not supported

## Known gaps

- Car traffic moves on simple fixed paths without intersection rules.
- NPC pedestrian behavior is rudimentary; no navmesh or animation sprites.
- No audio, combat, interior level, police chase, multiplayer or 3D model.
- Manual load accesses the manual save; autosave exists as a separate safety snapshot.
- Screen layout targets desktop; narrow-screen layout is informational rather than touch-playable.

## Before merging

Run `node --check src/main.js`, test in a browser, record a short actual gameplay capture for changes to motion/collision, and update README if features change.
