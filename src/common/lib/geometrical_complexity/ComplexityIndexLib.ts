import Circle from "../../domain/Circle";
import {getDistance, getShortestThoroidalDeltaXY} from "../CollisionLib";
import {trimToDecimals} from "../util/PrecisionUtil";
import {iterateUniqueCirclePairs} from "../util/IterateCirclesUtil";

export interface Edge {
	c0: Circle,
	c1: Circle,
	slope: number
}

export interface ContactGraph {
	edges: Edge[];
}

const addExternalCircles = (circles: Circle[], radius: number) => {
	const missing = [];

	iterateUniqueCirclePairs(circles, (c0: Circle, c1: Circle) => {
		const {dx, dy, ext} = getShortestThoroidalDeltaXY(c0, c1);

	});


}

export const getGeometryComplexityIndex = (circles: Circle[], radius: number, precision: number) => {
	const contactGraph = buildContactGraph(circles, radius, precision);
	const nrEdges = contactGraph.edges.length;
	const slopeFrequencies = getSortedSlopeFrequencies(contactGraph, precision);

	const total = slopeFrequencies.reduce((sum, freq) => {
		const p = freq / nrEdges;

		return sum + p * Math.log(p);
	}, 0);

	return (-1 / Math.log(2)) * total;
}

export const buildContactGraph = (circles: Circle[], radius, precision: number): ContactGraph => {
	const isAdjacent = (radius: number, distance: number, precision: number): boolean => {
		return Math.abs(2 * radius - distance) <= (precision * 100);
	}

	const getSlope = ({dx, dy}, precision) => {
		const slope = Math.abs(dy / dx);
		return parseFloat(slope.toFixed(precision));
	}

	const addToContactGraph = ({edges}: ContactGraph, radius: number, precision: number, c0: Circle, c1: Circle) => {
		const {dx, dy, int, ext} = getShortestThoroidalDeltaXY(c0, c1);
		const distance = getDistance({dx, dy});
		// if (Math.abs(distance - 2 * radius) < 0.01) {
		// 	console.log(c0.id + ':' + c1.id + ': ' + Math.abs(distance - 2 * radius));
		//
		// }

		if (isAdjacent(radius, distance, precision)) {
			edges.push({c0, c1, slope: getSlope({dx, dy}, 8)});
		}
	}

	const buildContactGraph = (circles: Circle[], radius, precision):ContactGraph  => {
		const contactGraph = {edges: []};

		for (let i = 0; i < circles.length; i++) {
			for (let j = i + 1; j < circles.length; j++) {
				addToContactGraph(contactGraph, radius, precision, circles[i], circles[j]);
			}
		}

		return contactGraph;
	}

	return buildContactGraph(circles, radius, precision);
}


const getSortedSlopeFrequencies = ({edges}: ContactGraph, precision: number): number[] => {

	const trimSlopeToPrecision = (e: Edge) => {
		e.slope = trimToDecimals(e.slope, precision);

		return e;
	}

	const setFrequencyBySlope = (slopes: Map<number, number>, {slope}, idx) => {
		const slopeFreq = (slopes.get(slope) ?? 0) + 1;
		slopes.set(slope, slopeFreq);

		return slopes;
	}

	const slopesMap = edges
		.map(e => trimSlopeToPrecision(e))
		.sort((e0, e1) => e0.slope - e1.slope)
		.reduce(setFrequencyBySlope, new Map());

	return Array.from(slopesMap.values());

}

