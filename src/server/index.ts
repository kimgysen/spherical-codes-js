import ThoroidalSpaceServer from "./lib/ThoroidalSpaceServer";
import InputConfig from "../domain/InputConfig";
import {generateRandomPoints} from "../lib/circles/PointsFactory";

const NR_POINTS = 10;

const points = generateRandomPoints(NR_POINTS);

const inputConfig: InputConfig = {
	initRadius: 5,
	speedFactor: 0.90,
	maxPrecision: 1e-16,
	maxCollisions: 19
}

const thoroidalSpace = new ThoroidalSpaceServer(points, inputConfig);

console.log('Trying to find max radius in thoroidal space for ' + points.length + ' points...');

const start = new Date().getTime();
const maxRadius = thoroidalSpace.findMaxRadius();
let elapsed = new Date().getTime() - start;

console.log('maxRadius', maxRadius);
console.log('time elapsed', elapsed + "ms");

