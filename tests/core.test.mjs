import test from "node:test";
import assert from "node:assert/strict";
import {clamp,distance,speedKmh,repairCost,inRange} from "../src/core/math.js";
test("clamp bounds values",()=>{assert.equal(clamp(-1,0,5),0);assert.equal(clamp(6,0,5),5);});
test("distance computes a 3-4-5 triangle",()=>assert.equal(distance({x:0,y:0},{x:3,y:4}),5));
test("repair price uses bounded damage",()=>{assert.equal(repairCost(100),0);assert.equal(repairCost(75),200);assert.equal(repairCost(-5),800);});
test("garage interaction threshold",()=>{assert.equal(inRange({x:0,y:0},{x:10,y:0},10),true);assert.equal(inRange({x:0,y:0},{x:11,y:0},10),false);});
test("speed readout",()=>assert.equal(speedKmh(100),25));
