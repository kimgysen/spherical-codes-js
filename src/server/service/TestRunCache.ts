import {PointModel, TestRunModel} from "../db/model/models";
import {Point} from "../../lib/circles/PointsFactory";
import Circle from "../../domain/Circle";
import {v4 as uuidv4} from "uuid";
import {db} from "../db";

class TestRunCache {

	private _nrPoints: number;
	private _timeOutMs: number;

	private _testRunCache: TestRunModel[] = [];
	private _pointsBeforeCache: PointModel[] = [];
	private _pointsAfterCache: PointModel[] = [];


	constructor(nrPoints: number, timeOutMs: number) {
		this._nrPoints = nrPoints;
		this._timeOutMs = timeOutMs;
	}

	public saveSuccess(nrCollisions: number, maxRadius: number, foundInMs: number, pointsBefore: Point[], circlesAfter: Circle[]) {
		this._save(nrCollisions, maxRadius, foundInMs, pointsBefore, circlesAfter);
	}

	public saveFail(nrCollisions: number, pointsBefore: Point[]) {
		this._save(nrCollisions, null, null, pointsBefore, null);

	}

	private _save(nrCollisions: number, maxRadius: number, foundInMs: number, pointsBefore: Point[], circlesAfter: Circle[]) {
		const test_run_id = uuidv4().toString();

		this._testRunCache.push({
			test_run_id,
			nr_circles: this._nrPoints,
			nr_collisions: nrCollisions,
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

	}

	public async syncDb() {
		if (this._testRunCache.length > 0) {
			await db.testRuns.add(this._testRunCache);
			await db.pointsBefore.add(this._pointsBeforeCache);
			await db.pointsAfter.add(this._pointsAfterCache);

		}
	}

}

export default TestRunCache;
