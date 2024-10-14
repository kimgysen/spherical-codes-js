import Circle from "../domain/Circle";
import {growRadius, minDistance, removeCollisions} from "./CollisionLib";
import TimeoutError from "../error/TimeoutError";
import {sleep} from "./util/SleepUtil";
import {precisionAsDecimal, trimToDecimals} from "./util/PrecisionUtil";
import Point from "../domain/Point";
import {BaseCfg} from "../domain/BaseCfg";


export interface MaxRadiusParams {
	circles: Array<Circle | Point>;
	cfg: BaseCfg;
	opts?: MaxRadiusOpts;
}

export interface MaxRadiusOpts {
	useTimeout?: boolean;
	timeoutMs?: number;
	useCallback?: boolean;
	callbackFn?: (radius: number, circles: Circle[]) => any;
	stepIntervalMs?: number;
}

export interface MaxRadiusResult {
	maxRadius: number;
	circles: Circle[];
	foundInMs: number;
}


export const findMaxRadius = async (params: MaxRadiusParams): Promise<MaxRadiusResult> => {
	let {circles, cfg: {initRadius: radius, initDr: dr, maxCollisions, speedFactor, maxPrecision}, opts = {}} = params;

	const start = new Date().getTime();
	let elapsedTime = 0;

	do {
		let {grownRadius, collisions} = growRadius(circles, radius, dr);

		removeCollisions(collisions, grownRadius);

		if (collisions.length >= maxCollisions) {
			radius = minDistance(collisions) / 2;
			dr *= speedFactor;

		} else {
			radius = grownRadius;

		}

		elapsedTime = new Date().getTime() - start;

		await applyMaxRadiusOpts({radius, circles, elapsedTime, opts});

	} while (dr > precisionAsDecimal(maxPrecision));

	return {maxRadius: trimToDecimals(radius, maxPrecision), circles, foundInMs: elapsedTime};

}


interface MaxRadiusOptsParams {
	radius: number;
	circles: Circle[];
	elapsedTime: number;
	opts: MaxRadiusOpts
}

const applyMaxRadiusOpts = async (params: MaxRadiusOptsParams) => {
	const {radius, circles, elapsedTime, opts} = params;
	const {
		useTimeout = false,
		timeoutMs = 0,
		useCallback = false,
		callbackFn = () => {},
		stepIntervalMs = 1
	} = opts;

	if (useCallback) {
		await sleep(stepIntervalMs);

		callbackFn(radius, circles);
	}

	if (useTimeout && elapsedTime > timeoutMs) {
		throw new TimeoutError("Timeout has been reached.");

	}
}
