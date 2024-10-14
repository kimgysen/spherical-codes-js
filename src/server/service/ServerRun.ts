import {ServerCfgInputItem, ServerInputCfg} from "../cfg/ServerCfg";
import {validateServerCfg} from "../cfg/ServerCfgValidator";
import {parseServerCfg} from "../cfg/ServerCfgMapper";
import {RangeOrSelectCfg} from "../../common/domain/RangeOrSelectCfg";
import {getStaticPool} from "../threadpool/StaticPool";
import {runTestBatch} from "./max_radius/MaxRadiusBatchService";

export const runTests = async (cfg: ServerInputCfg) => {

	const {isValid, errors} = validateServerCfg(cfg);

	if (!isValid) {
		console.error('The input config file is invalid.', errors);
	}

	const cfgItems = parseServerCfg(cfg);

	const nrTasks = countNumberTasks(cfgItems);
	const staticPool = getStaticPool({size: nrTasks, task: runTestBatch})

	for (const cfgItem of cfgItems) {
		try {
			await staticPool.exec(cfgItem);

		} catch (e) {

		}
	}

}

const countNumberTasks = (items: ServerCfgInputItem[]) => {
	const countItems = ({type, select = [], range = []}: RangeOrSelectCfg) => {
		return type === 'select'
			? select.length
			: range[range.length - 1] - range[0];

	}

	return items.reduce((acc, item) => {
		return acc +
			(item.maxCollisionsCfg
				? countItems(item.maxCollisionsCfg)
				: 1);
	}, 0);
}