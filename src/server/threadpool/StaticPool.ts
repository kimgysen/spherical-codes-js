const {StaticPool} = require('node-worker-threads-pool');

export interface StaticPoolParams {
	size: number;
	task: Function;
}

export const getStaticPool = ({size, task}: StaticPoolParams) => {
	return new StaticPool({size, task});

}
