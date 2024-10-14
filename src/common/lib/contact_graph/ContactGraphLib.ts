import Circle from "../../domain/Circle";
import {getDistance, getShortestThoroidalDeltaXY, minDistanceCircles} from "../CollisionLib";
import {iterateAllCirclePairs, iterateUniqueCirclePairs, mapObjectToArray} from "../util/IterateUtil";
import {precisionAsDecimal} from "../util/PrecisionUtil";
import {ContactGraph, Edge} from "../../domain/ContactGraph";
import DeltaXY from "../../domain/DeltaXY";


const getSlope = ({dx, dy}, precision) => {
	const slope = Math.abs(dy / dx);

	return parseFloat(slope.toFixed(precision));
}

export const buildContactGraph = (pCircles: Circle[], precision: number, uniqueEdges?: boolean): ContactGraph => {
	const edges = [];
	const minD = minDistanceCircles(pCircles);
	const circlesMap = {};

	const iterate = uniqueEdges
		? iterateUniqueCirclePairs
		: iterateAllCirclePairs;

	iterate(pCircles, (c0, c1) => {
		const deltaXY = getShortestThoroidalDeltaXY(c0, c1),
			{dx, dy, isExt} = deltaXY;

		const d = getDistance(deltaXY);
		if (d - minD < precisionAsDecimal(precision)) {
			if (isExt && !uniqueEdges) {
				c1 = {
					id: c1.id,
					x: c0.x + dx,
					y: c0.y + dy,
					isExt
				};
			}

			edges.push({id: `${c0.id}_${c1.id}`, c0, c1, deltaXY, distance: d});
			circlesMap[c0.id] = c0;
			circlesMap[c1.id] = c1;
		}

	});

	return {
		edges,
		circles: mapObjectToArray(circlesMap)
	};
}