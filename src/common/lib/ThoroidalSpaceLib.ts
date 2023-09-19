import Circle from "../domain/Circle";
import {growRadius, minDistance, removeCollisions} from "./CollisionLib";
import TimeoutError from "../../server/lib/error/TimeoutError";
import InputConfig from "../domain/InputConfig";
import {sleep} from "./util/SleepUtil";
import {Point} from "./factory/PointsFactory";
import {precisionAsDecimal} from "./util/PrecisionUtil";


export interface MaxRadiusParams{
	circles: Array<Circle|Point>;
	cfg: InputConfig;
}

export interface MaxRadiusOpts {
	useTimeout: boolean;
	timeoutMs?: number;
	callbackFn?: (radius: number, circles: Circle[]) => any;
	sleepMs?: number;
}

export const findMaxRadius = async (params: MaxRadiusParams, opts?: MaxRadiusOpts) => {
	const {circles, cfg} = params;
	let {initRadius: radius, initDr: dr, maxCollisions, speedFactor, maxPrecision} = cfg;
	const {useTimeout} = opts;

	const start = new Date().getTime();
	let elapsedTime;

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

		if (opts.callbackFn) {
			if (opts.sleepMs)
				await sleep(opts.sleepMs);

			opts.callbackFn(radius, circles);
		}

		if (useTimeout && elapsedTime > opts.timeoutMs) {
			throw new TimeoutError("Timeout has been reached.");

		}

	} while (dr > precisionAsDecimal(maxPrecision));

	return {radius, circles, elapsedTime};

}
