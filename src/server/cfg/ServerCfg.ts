import {RangeOrSelectCfg} from "../../common/domain/RangeOrSelectCfg";
import {BaseCfg} from "../../common/domain/BaseCfg";

export interface ServerCfgDefaults extends Partial<BaseCfg> {
	nrRunsPerCollision?: number;
	batchSize?: number;
	shouldPersist?: boolean;
	timeoutMs?: number;
}

export interface ServerCfgItem extends ServerCfgDefaults {}

export interface ServerCfgInputItem extends Partial<ServerCfgDefaults> {
	maxCollisionsCfg: RangeOrSelectCfg;
}

export interface ServerInputCfg {
	defaults: ServerCfgDefaults;
	items: ServerCfgInputItem[];
}
