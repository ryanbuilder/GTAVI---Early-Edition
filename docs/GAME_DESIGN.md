# Game design document · EARLY CITY v0.2

## Vision

A small, accessible sandbox that captures the rhythm of exploration, driving and light delivery work in a living urban environment. This is a playable **top-down** vertical slice, not a AAA title.

## Pillars

1. **Immediate freedom:** walk in any direction at launch; no intro cutscene.
2. **Vehicles as traversal:** enter a nearby car, use roads, discover landmarks.
3. **A city with motion:** surrounding cars and pedestrians provide ambient activity.
4. **Short objectives:** waypoint-based deliveries and timed runs reward experimentation.
5. **Clarity:** all interaction happens through a small keyboard vocabulary and readable HUD.

## Core loop

Explore streets → follow the waypoint → drive or walk → finish job → collect payout → choose the next location.

## Current systems

- Walking: 165 units/sec. Sprint: 260 units/sec while stamina remains.
- Stamina: replenishes when not actively sprinting.
- Driving: simple momentum, acceleration, braking, reversing and turning. Units are game-space units, not physical SI units.
- Time: one real second advances 1.5 minutes in-game.
- Economy: pays fixed mission rewards. No shops, inventory or spending mechanic yet.
- Wanted rating: collisions increase a numerical heat counter, which decays over time. There are not yet active police chases.
- Damage: car health depletes after high-speed collisions. Vehicle destruction is not implemented.

## Balancing work

Current mission completion uses a 72-unit circular trigger. Timed mission allows 95 real seconds. Difficulty is not adaptive. No difficulty setting or procedural mission generator is implemented.

## Future design concepts, not shipped

3D movement and camera, parkour, vehicle garage, traffic lights, police AI, dialogue, inventory, side quests, interiors, ambient audio, controller input, accessibility settings, quest journal and co-op. These require explicit engineering work and are not claims of current functionality.
