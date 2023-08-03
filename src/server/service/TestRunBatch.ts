import {generateRandomPoints} from "../../lib/circles/PointsFactory";
import ThoroidalSpaceServer from "../lib/ThoroidalSpaceServer";
import InputConfig from "../../domain/InputConfig";
import TimeoutError from "../lib/error/TimeoutError";
import TestRunCache from "./TestRunCache";
import {trimToDecimals} from "../util/Precision";

const TIMEOUT_MS = 3_000;
const TRIM_TO_PRECISION = 14;

const inputConfig: InputConfig = {
	initRadius: 0.01,
	speedFactor: 0.90,
	maxPrecision: 1e-14,
	maxCollisions: 1
}


class TestRunBatch {
	private _cache: TestRunCache;

	private readonly _nrPoints: number;
	private readonly _nrRunsPerCollision: number;
	private readonly _nrCollisionsMin: number;
	private readonly _nrCollisionsMax: number;

	constructor(nrPoints, nrRunsPerCollision) {
		this._nrPoints = nrPoints;
		this._nrRunsPerCollision = nrRunsPerCollision;
		this._nrCollisionsMin = Math.trunc(1 * nrPoints);
		this._nrCollisionsMax = Math.trunc(3 * nrPoints);

		this._cache = new TestRunCache(nrPoints, TIMEOUT_MS);

	}

	public async runTests() {
		let failCnt = 0;

		for (let collisionCnt = this._nrCollisionsMin; collisionCnt < this._nrCollisionsMax; collisionCnt++) {
			failCnt = 0;
			for (let runCnt = 0; runCnt < this._nrRunsPerCollision; runCnt++) {
				const hasSolution: boolean = this.runTest(collisionCnt);

				if (!hasSolution)
					failCnt++;
			}

			// If all test runs fail with timeout, there is no use in continuing
			if (failCnt >= this._nrRunsPerCollision || failCnt >= 100)
				break;

		}

		// await this._cache.syncDb();
	}


	public runTest(nrCollisions: number): boolean {
		const pointsBefore = generateRandomPoints(this._nrPoints);

		try {
			console.log('Trying to find max radius in thoroidal space for ' + this._nrPoints + ' points with max collisions: ' + nrCollisions + '...');
			const thoroidalSpace = new ThoroidalSpaceServer(pointsBefore, {...inputConfig, maxCollisions: nrCollisions});

			const start = new Date().getTime();
			const maxRadius = thoroidalSpace.findMaxRadius(TIMEOUT_MS);
			const elapsed = new Date().getTime() - start;

			const circlesAfter = thoroidalSpace.getCirclesAfter();

			const maxRadiusWithPrecision = trimToDecimals(maxRadius, TRIM_TO_PRECISION);
			console.log('Max radius found: ', maxRadiusWithPrecision);

			this._cache.saveSuccess(nrCollisions, maxRadiusWithPrecision, elapsed, pointsBefore, circlesAfter);

			return true;

		} catch (e) {
			if (e instanceof TimeoutError) {
				console.log('Timed out');
				this._cache.saveFail(nrCollisions, pointsBefore);

			}

			return false;
		}
	}


}

export default TestRunBatch;
