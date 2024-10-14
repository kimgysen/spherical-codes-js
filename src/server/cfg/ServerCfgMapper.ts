import {ServerCfgInputItem, ServerCfgItem, ServerInputCfg} from "./ServerCfg";
import {iterateRangeOrSelect} from "../../common/lib/util/IterateUtil";


/**
 * Parse config to translate convenient external api
 * 	to a convenient internal api
 */
export const parseServerCfg = ({defaults, items}: ServerInputCfg): ServerCfgInputItem[] => {
	return items
		.reduce((acc, item) => acc.concat(parseMaxCollisionsCfg(item)), [])
		.map(item => ({...defaults, ...item}));
}

/**
 * Transform config item into an array of items,
 * 	where max collisions cfg is transformed into an array of items
 * 	and every item has one maxCollisions property
 */
export const parseMaxCollisionsCfg = (item: ServerCfgInputItem): ServerCfgItem[] => {
	const [arr, iterate] = iterateRangeOrSelect(item.maxCollisionsCfg);

	return iterate(arr, (i) => ({...item, maxCollisions: i}), []);

}
