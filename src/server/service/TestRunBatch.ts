import {generateRandomPoints} from "../../common/lib/factory/PointsFactory";
import ThoroidalSpaceServer from "../lib/ThoroidalSpaceServer";
import InputConfig from "../../common/domain/InputConfig";
import TimeoutError from "../lib/error/TimeoutError";
import TestRunCache from "./TestRunCache";
import {trimToDecimals} from "../../common/lib/util/PrecisionUtil";
import InfiniteCollisionError from "../lib/error/InfiniteCollisionError";

const TIMEOUT_MS = 500_000;
const TRIM_TO_PRECISION = 14;
const DB_BATCH_SIZE = 2;

const inputConfig: InputConfig = {
	initRadius: 0.01,
	initDr: 0.01,
	speedFactor: 0.9999,
	maxPrecision: 14
}


class TestRunBatch {
	private readonly _nrPoints: number;
	private readonly _nrRunsPerCollision: number;
	private readonly _nrCollisionsMin: number;
	private readonly _nrCollisionsMax: number;

	private _cache: TestRunCache;

	constructor(nrPoints, nrRunsPerCollision) {
		this._nrPoints = nrPoints;
		this._nrRunsPerCollision = nrRunsPerCollision;
		// this._nrCollisionsMin = Math.trunc(1 * nrPoints);
		// this._nrCollisionsMax = Math.trunc(3 * nrPoints);
		this._nrCollisionsMin = 51;
		this._nrCollisionsMax = 52;
	}

	public async runTests() {

		let failCnt = 0;

		for (let collisionCnt = this._nrCollisionsMin; collisionCnt < this._nrCollisionsMax; collisionCnt++) {
			this._cache = new TestRunCache(this._nrPoints, collisionCnt, TIMEOUT_MS, DB_BATCH_SIZE);

			failCnt = 0;
			for (let runCnt = 0; runCnt < this._nrRunsPerCollision; runCnt++) {
				const hasSolution: boolean = await this.runTest(collisionCnt);

				if (!hasSolution)
					failCnt++;

			}

			// If all test runs fail with timeout, there is no use in continuing
			if (failCnt >= this._nrRunsPerCollision)
				break;

		}
	}

	public runTest(nrCollisions: number): Promise<boolean> {

		const pointsBefore = generateRandomPoints(this._nrPoints, TRIM_TO_PRECISION);

		return new Promise(async (resolve, reject) => {
			try {
				console.log('Trying to find max radius in thoroidal space for ' + this._nrPoints + ' points with max collisions: ' + nrCollisions + '...');
				const thoroidalSpace = new ThoroidalSpaceServer(pointsBefore, {...inputConfig, maxCollisions: nrCollisions});

				const start = new Date().getTime();
				const maxRadius = thoroidalSpace.findMaxRadius(TIMEOUT_MS);
				const elapsed = new Date().getTime() - start;

				const circlesAfter = thoroidalSpace.getCirclesAfter();

				const maxRadiusWithPrecision = trimToDecimals(maxRadius, TRIM_TO_PRECISION);
				console.log('Max radius found: ', maxRadiusWithPrecision);
				console.log('Elapsed', elapsed);

				await this._cache.saveSuccess(maxRadiusWithPrecision, elapsed, pointsBefore, circlesAfter);

				resolve(true);

			} catch (e) {
				if (e instanceof TimeoutError) {
					console.log('Timed out');

				} else if (e instanceof InfiniteCollisionError) {
					console.log('Infinite collision');

				} else {
					console.log(e);

				}

				resolve(false);

			}
		})
	}


}

export default TestRunBatch;
