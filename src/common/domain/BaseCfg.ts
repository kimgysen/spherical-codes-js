import {RangeOrSelectCfg} from "./RangeOrSelectCfg";

export interface BaseCfg {
	nrPoints: number;
	initRadius: number;
	initDr: number;
	speedFactor: number;
	maxPrecision: number;
	maxCollisions: number;
}

// Browser config

export interface BrowserCfg extends BaseCfg {
}

