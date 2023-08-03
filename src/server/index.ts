import TestRunBatch from "./service/TestRunBatch";

const NR_RUNS_PER_COLLISION = 100;


(async () => {

	for (let i = 4; i <= 4; i++) {
		const testRunBatch = new TestRunBatch(i, NR_RUNS_PER_COLLISION);

		await testRunBatch.runTests();

	}

})();
