# World and level design

## Map

Playable rectangle: 3600 x 2880 internal units. Road strips repeat every 360 units and occupy 102 units per cell. Building lots fill most of the cell interiors. Park cells appear at deterministic intervals. A simple seeded generator picks facade colors and floor counts.

## Places used by jobs

- Central District: first travel marker (1860, 1110)
- Eastern Garage: first driving destination (2920, 1840)
- Southern Warehouse: second driving destination (680, 2450)
- Northern Passage: timed checkpoint (3220, 75)
- West Lookout: exploration marker (84, 2200)

These names identify waypoint regions. They do **not** yet have unique modeled interiors, cutscenes or scripted characters.

## Populations

38 traffic vehicles move along lanes. 75 pedestrians perform wandering behavior and basic building avoidance. This creates ambient city motion, not full traffic simulation. Population settings are constants in the source and will need profiling on low-powered laptops.

## World upgrades planned

District-specific streets, procedural props, traffic signals, pedestrian crossings, local navigation graphs, landmark assets, interiors, signage systems and a coherent waterfront. Build original asset provenance records before importing external material.
