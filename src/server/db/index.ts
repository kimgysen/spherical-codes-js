import dbConfig from './db-config'; // db connection details
import pgPromise, {IInitOptions, IDatabase, IMain} from 'pg-promise';
import {IExtensions, PointsBeforeRepository, TestRunRepository} from './repository';
import PointsAfterRepository from "./repository/PointsAfterRepository";

type ExtendedProtocol = IDatabase<IExtensions> & IExtensions;



// pg-promise initialization options:
const initOptions: IInitOptions<IExtensions> = {
    // Extending the database protocol with our custom repositories;
    // API: http://vitaly-t.github.io/pg-promise/global.html#event:extend
    extend(obj: ExtendedProtocol, dc: any) {
        // Database Context (dc) is mainly needed for extending multiple databases with different access API.

        // Do not use 'require()' here, because this event occurs for every task and transaction being executed,
        // which should be as fast as possible.
        obj.testRuns = new TestRunRepository(obj, pgp);
        obj.pointsBefore = new PointsBeforeRepository(obj, pgp);
        obj.pointsAfter = new PointsAfterRepository(obj, pgp);
    }
};

// Initializing the library:
const pgp: IMain = pgPromise(initOptions);

// Creating the database instance with extensions:
const db: ExtendedProtocol = pgp(dbConfig);

// Alternatively, you can get access to pgp via db.$config.pgp
// See: https://vitaly-t.github.io/pg-promise/Database.html#$config
export {db, pgp};
