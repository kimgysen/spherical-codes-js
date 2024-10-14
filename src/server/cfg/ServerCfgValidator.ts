import {ServerCfgItem, ServerInputCfg} from "./ServerCfg";

const requiredKeys = [
	'nrPoints',
	'initRadius',
	'initDr',
	'speedFactor',
	'maxPrecision',
	'maxCollisions',
	'nrRunsPerCollision',
	'batchSize',
	'shouldPersist',
	'maxCollisions',
	'timeoutMs'
];


export interface CfgValidation {
	isValid: boolean;
	errors: ServerCfgItem[]
}

export const validateServerCfg = (cfg: ServerInputCfg): CfgValidation => {
	const errors = [];

	cfg.items.forEach((cfgItem: ServerCfgItem) => {
		const areKeysPresent = requiredKeys.every(key => ({...cfg, item: cfgItem}.hasOwnProperty(key)));

		if (!areKeysPresent) {
			errors.push(cfgItem);
		}
	});

	return {
		isValid: errors.length === 0,
		errors
	};
}
