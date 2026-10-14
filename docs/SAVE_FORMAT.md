# Local save format

`earlycity-save-v2` stores a JSON object in browser localStorage.

| Field | Meaning |
|---|---|
| player | x/y, facing, health, stamina, inCar |
| car | selected vehicle transform and health |
| owned | starter vehicle and other cars serialized in list |
| money | local in-game cash balance |
| wanted | approximate wanted meter |
| missionIndex | index of active sequential mission |
| completed | number of finished missions |
| missionsPassed | log of completed missions (added v0.3) |
| distance | total internal world movement |
| time | accumulated simulated seconds |
| dayOffset | starting in-game time |

Do not put secrets, real personal details or account credentials in this storage. Local saves are user-editable and not appropriate for competitive leaderboards. The v2 key remains for basic compatibility. A full migration/versioning layer is planned; never assume the current shape is stable.
