import Circle from "../../domain/Circle";
import {RangeOrSelectCfg} from "../../domain/RangeOrSelectCfg";

export const iterateUniqueCirclePairs = (circles: Circle[], fn: (c0: Circle, c1: Circle) => void) => {
	for (let i = 0; i < circles.length; i++) {
		for (let j = i + 1; j < circles.length; j++) {
			const [c0, c1] = [circles[i], circles[j]];
			if (c0.id !== c1.id) {
				fn(c0, c1);

			}
		}
	}
}

export const iterateAllCirclePairs = (circles: Circle[], fn: (c0: Circle, c1: Circle) => void) => {
	for (let i = 0; i < circles.length; i++) {
		for (let j = 0; j < circles.length; j++) {
			const [c0, c1] = [circles[i], circles[j]];
			if (c0.id !== c1.id) {
				fn(c0, c1);

			}
		}
	}
}

export const mapObjectToArray = (obj: object) => {
	return Object.keys(obj).map(e => obj[e]);
}

export const iterateRangeOrSelect = (cfg: RangeOrSelectCfg): [number[], Function] => {
	const {type, range = [], select = []} = cfg;

	return type === 'range'
		? [range, iterateRange]
		: [select, iterateSelect];
}

export const iterateRange = (arr: number[], fn: (i: number) => any, acc?: any[]): () => void => {
	return () => {
		for (let i = arr[0]; i <= arr[1]; i++) {
			const res =	fn(i);
			acc?.push(res);
		}
	}
}

export const iterateSelect = (arr: number[], fn: (i: number) => any, acc?: any[]) => {
	return () => {
		for (const i of arr) {
			const res = fn(i);
			acc?.push(res);
		}
	}
}