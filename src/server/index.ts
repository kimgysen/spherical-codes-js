import TestRunBatch from "./service/TestRunBatch";

const NR_RUNS_PER_COLLISION = 100;


(async () => {

	for (let i = 128; i <= 128; i++) {
		const testRunBatch = new TestRunBatch(i, NR_RUNS_PER_COLLISION);

		await testRunBatch.runTests();
	}

})();
