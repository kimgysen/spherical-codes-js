import {PointModel, TestRunModel} from "../db/model/models";
import {Point} from "../../common/lib/circles/PointsFactory";
import Circle from "../../common/domain/Circle";
import {v4 as uuidv4} from "uuid";
import {db} from "../db";

class TestRunCache {

	private _nrPoints: number;
	private _nrCollisions: number;
	private _timeOutMs: number;
	private _batchSize: number;

	private _testRunCache: TestRunModel[] = [];
	private _pointsBeforeCache: PointModel[] = [];
	private _pointsAfterCache: PointModel[] = [];


	constructor(nrPoints: number, nrCollisions: number, timeOutMs: number, batchSize: number) {
		this._nrPoints = nrPoints;
		this._nrCollisions = nrCollisions;
		this._timeOutMs = timeOutMs;
		this._batchSize = batchSize;
	}

	public async saveSuccess(maxRadius: number, foundInMs: number, pointsBefore: Point[], circlesAfter: Circle[]) {
		await this._save(maxRadius, foundInMs, pointsBefore, circlesAfter);
	}

	public async saveFail(nrCollisions: number, pointsBefore: Point[]) {
		await this._save(null, null, pointsBefore, null);

	}

	private async _save(maxRadius: number, foundInMs: number, pointsBefore: Point[], circlesAfter: Circle[]) {
		const test_run_id = uuidv4().toString();

		this._testRunCache.push({
			test_run_id,
			nr_circles: this._nrPoints,
			nr_collisions: this._nrCollisions,
			max_radius: maxRadius,
			found_in_ms: foundInMs,
			timeout_ms: this._timeOutMs,
			has_timed_out: !Boolean(maxRadius)
		});

		this._pointsBeforeCache = this._pointsBeforeCache.concat(
			pointsBefore.map(p => ({x: p.x, y: p.y, test_run_id})));

		if (circlesAfter)
			this._pointsAfterCache = this._pointsAfterCache.concat(
				circlesAfter.map(c => ({x: c.x, y: c.y, test_run_id})));

		if (this._testRunCache.length >= this._batchSize) {
			await this.flush();
		}

	}

	public async flush() {
		await this._syncDb();
		this._clearCache();
	}

	private async _syncDb() {
		if (this._testRunCache.length > 0 && this._pointsAfterCache.length > 0) {
			await db.testRuns.add(this._testRunCache);
			await db.pointsBefore.add(this._pointsBeforeCache);
			await db.pointsAfter.add(this._pointsAfterCache);

		}
	}

	private _clearCache = () => {
		this._testRunCache = [];
		this._pointsBeforeCache = [];
		this._pointsAfterCache = [];

	}

}

export default TestRunCache;
