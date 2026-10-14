export const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));
export const distance = (a,b) => Math.hypot(a.x-b.x,a.y-b.y);
export const speedKmh = unitsPerSecond => Math.round(Math.abs(unitsPerSecond)*0.25);
export const repairCost = health => Math.ceil((100-clamp(health,0,100))*8);
export const inRange = (a,b,radius) => distance(a,b) <= radius;
