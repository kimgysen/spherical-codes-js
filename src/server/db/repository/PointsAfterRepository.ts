import {ColumnSet, IDatabase, IMain} from "pg-promise";
import {PointDbModel} from "../model/models";


class PointsBeforeRepository {
	private readonly _cs: ColumnSet;

	constructor(private db: IDatabase<any>, private pgp: IMain) {
		this._cs = this.createColumnSets(db, pgp);
	}

	createColumnSets(db, pgp): ColumnSet {
		return new pgp.helpers.ColumnSet([
			'x', 'y', 'test_run_id'], {table: 'points_after'});

	}

	async add(points: PointDbModel[]): Promise<string[]> {
		const query = this.pgp.helpers.insert(points, this._cs);

		return this.db.none(query);
	}

}

export default PointsBeforeRepository;
