import {ColumnSet, IDatabase, IMain} from "pg-promise";
import {TestRunModel} from "../model/models";


class TestRunRepository {
	private _cs: ColumnSet;

	constructor(private db: IDatabase<any>, private pgp: IMain) {
		this._cs = this.createColumnSets(db, pgp);
	}

	createColumnSets(db, pgp): ColumnSet {
		return new pgp.helpers.ColumnSet([
			'test_run_id', 'nr_circles', 'nr_collisions', 'max_radius', 'found_in_ms', 'timeout_ms', 'has_timed_out'], {table: 'test_run'});

	}

	async add(testRuns: TestRunModel[]): Promise<string[]> {
		// generating a multi-row insert query:
		const query = this.pgp.helpers.insert(testRuns, this._cs);
		return this.db.none(query);
	}

}

export default TestRunRepository;
