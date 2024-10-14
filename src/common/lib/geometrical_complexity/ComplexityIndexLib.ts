import Circle from "../../domain/Circle";
import {getShortestThoroidalDeltaXY} from "../CollisionLib";
import {iterateUniqueCirclePairs} from "../util/IterateUtil";
import {Edge} from "../../domain/ContactGraph";


export interface ContactGraph {
	edges: Edge[];
}

const addExternalCircles = (circles: Circle[], radius: number) => {
	const missing = [];

	iterateUniqueCirclePairs(circles, (c0: Circle, c1: Circle) => {
		const {dx, dy, ext} = getShortestThoroidalDeltaXY(c0, c1);

	});


}

// export const getGeometryComplexityIndex = (circles: Circle[], radius: number, precision: number) => {
// 	const contactGraph = buildContactGraph(circles, radius, precision);
// 	const nrEdges = contactGraph.edges.length;
// 	const slopeFrequencies = getSortedSlopeFrequencies(contactGraph, precision);
//
// 	const total = slopeFrequencies.reduce((sum, freq) => {
// 		const p = freq / nrEdges;
//
// 		return sum + p * Math.log(p);
// 	}, 0);
//
// 	return (-1 / Math.log(2)) * total;
// }

//
// const getSortedSlopeFrequencies = ({edges}: ContactGraphLib, precision: number): number[] => {
//
// 	const trimSlopeToPrecision = (e: Edge) => {
// 		e.slope = trimToDecimals(e.slope, precision);
//
// 		return e;
// 	}
//
// 	const setFrequencyBySlope = (slopes: Map<number, number>, {slope}, idx) => {
// 		const slopeFreq = (slopes.get(slope) ?? 0) + 1;
// 		slopes.set(slope, slopeFreq);
//
// 		return slopes;
// 	}
//
// 	const slopesMap = edges
// 		.map(e => trimSlopeToPrecision(e))
// 		.sort((e0, e1) => e0.slope - e1.slope)
// 		.reduce(setFrequencyBySlope, new Map());
//
// 	return Array.from(slopesMap.values());
//
// }
//
