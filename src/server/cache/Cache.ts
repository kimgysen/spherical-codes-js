import {db} from "../db";


export interface RecordValue {
	[key: string]: object[];
}

const cache = new Map<string, RecordValue>();
const batchCache = new Map<string, number>();


export const defineBatchSize = (key: string, batchSize: number) => {
	batchCache.set(key, batchSize);
}

export const getRecordValue = (key: string): RecordValue => {
	return cache.get(key);
}

export const addRecord = (key: string, model: RecordValue) => {
	cache.set(key, model);
}

export const addModel = async (key: string, modelKey: string, obj: object) => {
	const record = getRecordValue(key);
	const collection = record[modelKey];

	Array.isArray(obj)
		? collection.concat(obj)
		: collection.push(obj);

	const batchSize = getBatchSize(key);

	if (collection.length >= batchSize) {
		await flush(record);
	}
}

const getBatchSize = (key: string) => {
	return batchCache.get(key);
}

const resetRecordValue = (val: RecordValue) => {
	if (val) {
		Object.keys(val).forEach(key => val[key] = []);

	}
}

const flush = async (val: RecordValue) => {
	await syncDb(val);

	resetRecordValue(val);
}

const syncDb = async (val: RecordValue) => {
	const promises = Object.keys(val).map(key => db[key].add(val[key]));

	await Promise.all(promises);
}
