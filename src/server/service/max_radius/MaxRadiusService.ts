import {findMaxRadius, MaxRadiusResult} from "../../../common/lib/MaxRadiusLib";
import TimeoutError from "../../../common/error/TimeoutError";
import InfiniteCollisionError from "../../../common/error/InfiniteCollisionError";
import {cloneArray} from "../../../common/lib/util/CloneUtil";
import Point from "../../../common/domain/Point";
import {ServerCfgItem} from "../../cfg/ServerCfg";


export interface TestRunResult {
	pointsBefore: Point[],
	success?: MaxRadiusResult,
	error?: {
		type: 'timeout' | 'infiniteCollision';
	}
}

export const runMaxRadiusTest = async (pointsBefore: Point[], cfg: ServerCfgItem): Promise<TestRunResult> => {
	const {nrPoints, initRadius, initDr, speedFactor, maxPrecision, maxCollisions, timeoutMs} = cfg;

	const circlesBefore = cloneArray(pointsBefore);

	console.debug('Trying to find max radius in thoroidal space for ' + nrPoints + ' points with max collisions: ' + maxCollisions + '...');

	try {
		const {maxRadius, circles: circlesAfter, foundInMs} = await findMaxRadius({
			circles: circlesBefore,
			cfg: {nrPoints, initRadius, initDr, maxCollisions, speedFactor, maxPrecision},
			opts: {useTimeout: true, timeoutMs}
		});

		return {pointsBefore, success: {maxRadius, circles: circlesAfter, foundInMs: foundInMs}};

	} catch (e) {
		if (e instanceof TimeoutError) {
			return {pointsBefore, error: {type: 'timeout'}};

		} else if (e instanceof InfiniteCollisionError) {
			return {pointsBefore, error: {type: 'infiniteCollision'}};

		}

		console.log(e);
	}

}
