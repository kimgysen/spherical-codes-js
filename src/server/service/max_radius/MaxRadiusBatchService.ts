import {ServerCfgItem} from "../../cfg/ServerCfg";
import {runMaxRadiusTest} from "./MaxRadiusService";
import {generateRandomPoints} from "../../../common/lib/factory/PointsFactory";
import {addModel, addRecord, defineBatchSize, getRecordValue} from "../../cache/Cache";
import {TestRunDbModel} from "../../db/model/models";
import {v4 as uuidv4} from "uuid";
import Point from "../../../common/domain/Point";
import Circle from "../../../common/domain/Circle";

export const runTestBatch = async (cfg: ServerCfgItem) => {

	const {batchSize, shouldPersist, nrRunsPerCollision, ...c} = cfg;

	const cacheKey = buildCacheKey(c.nrPoints, c.maxCollisions);

	defineBatchSize(cacheKey, batchSize);

	for (let i = 0; i < nrRunsPerCollision; i++) {
		const points = generateRandomPoints(c.nrPoints, c.maxPrecision);

		const result = await runMaxRadiusTest(points, c);

		if (shouldPersist) {
			const model = {
				nr_points: c.nrPoints,
				max_collisions: c.maxCollisions,
				timeout_ms: c.timeoutMs,
				max_radius: result.success?.maxRadius,
				found_in_ms: result.success?.foundInMs,
				has_timed_out: ['timeout', 'infiniteCollision'].includes(result.error?.type)
			}

			await saveTestRun(cacheKey, model, points, result.success?.circles);

		}
	}

}

const buildCacheKey = (nrPoints: number, nrCollisions: number): string => {
	return `${nrPoints}:${nrCollisions}`;
}

const saveTestRun = async (cacheKey: string, model: TestRunDbModel, pointsBefore: Point[], circlesAfter: Circle[]) => {
	const val = getRecordValue(cacheKey);

	if (!val) {
		addRecord(cacheKey, {testRuns: [], pointsBefore: [], pointsAfter: []});
	}

	const testRunId = uuidv4().toString()

	model.test_run_id = testRunId;

	await addModel(cacheKey, 'testRun', model);
	await addModel(cacheKey, 'pointsBefore', pointsBefore.map(p => ({...p, point_id: uuidv4(), test_run_id: testRunId})));
	await addModel(cacheKey, 'pointsAfter', circlesAfter.map(c => ({...c, point_id: uuidv4(), test_run_id: testRunId})));

}

