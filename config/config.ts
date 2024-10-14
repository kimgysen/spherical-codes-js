// Browser

import {BrowserCfg} from "../src/common/domain/BaseCfg";
import {MaxRadiusOpts} from "../src/common/lib/MaxRadiusLib";
import {ServerInputCfg} from "../src/server/cfg/ServerCfg";

/*************/
/** Browser **/
/*************/
export const DefaultBrowserInputCfg: BrowserCfg = {
	nrPoints: 10,
	initRadius: 0.01,
	initDr: 0.05,
	speedFactor: 0.999,
	maxPrecision: 16,
	maxCollisions: 18
}

export const DefaultBrowserOpts: MaxRadiusOpts = {
	useCallback: false,
	useTimeout: true,
	timeoutMs: 1000,
	stepIntervalMs: 1
}

/************/
/** Server **/
/************/

export const serverCfg: ServerInputCfg = {
	defaults: {
		nrPoints: 16,
		initRadius: 0.01,
		initDr: 0.05,
		speedFactor: 0.99,
		maxPrecision: 16,
		nrRunsPerCollision: 10,
		batchSize: 5,
		shouldPersist: true
	},
	items: [
		{
			nrPoints: 12,
			maxCollisionsCfg: {
				type: 'select',
				range: [10, 12],
			},
			timeoutMs: 3_000
		},
		{
			nrPoints: 14,
			maxCollisionsCfg: {
				type: 'select',
				select: [10, 12, 14]
			},
			timeoutMs: 10_000
		}
	]
}
