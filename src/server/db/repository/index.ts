// Database Interface Extensions:
import TestRunRepository from "./TestRunRepository";
import PointsBeforeRepository from "./PointsBeforeRepository";
import PointsAfterRepository from "./PointsAfterRepository";

interface IExtensions {
	testRuns: TestRunRepository;
	pointsBefore: PointsBeforeRepository;
	pointsAfter: PointsAfterRepository;
}

export {
	IExtensions,
	TestRunRepository,
	PointsBeforeRepository,
	PointsAfterRepository
};
