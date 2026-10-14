# QA test plan

## Automated checks
Run `npm run check`, `npm test`, and `npm run build`. These are syntax/unit/build validations and **do not** establish interactive game correctness. The Node tests cover extracted pure utility functions only.

## Manual regression checklist
- Load the app and confirm a visible city and controllable player.
- Move in eight directions; sprint until stamina drains and recovers.
- Attempt walking through a building and check blocked collision.
- Enter a nearby car with E; steer, reverse, collide and exit.
- Check collisions decrease vehicle health and increase wanted stars.
- Locate both cyan garage circles; try G on foot, in an undamaged car, and in a damaged car with sufficient/insufficient cash.
- Complete a travel mission and verify cash increases only once.
- Complete a driving mission only while in a car.
- Let a timed mission expire and confirm it restarts its timer.
- Save with F5, refresh page and load with F9.
- Open/close map, pause, help; use keyboard shortcuts repeatedly.
- Resize the window and inspect HUD clipping at 1280x720 and 1920x1080.
- Leave tab for 30 seconds then return and check motion stability.

## Bug reporting
Include browser, OS, steps to reproduce, expected result, actual result and console output. Attach original project screenshots, not unrelated generated concept footage.
