import Circle from "../../domain/Circle";
import {ContactGraph, Edge} from "../../domain/ContactGraph";
import TimeoutError from "../../error/TimeoutError";
import DeltaXY from "../../domain/DeltaXY";
import {getDistance, getShortestThoroidalDeltaXY, getShortestThoroidalDistance} from "../CollisionLib";

const meanDistance = (edges: Edge[]): number => {
	let d = 0;

	for (let e of edges) {
		d += getShortestThoroidalDistance(e.c0, e.c1);
	}

	return d / edges.length;
}

const variance = (edges: Edge[]): number => {
	const meanDist = meanDistance(edges);
	let variance = 0;

	for (let e of edges) {
		const distance = getShortestThoroidalDistance(e.c0, e.c1);
		variance += Math.pow((distance - meanDist), 2);
	}

	return variance;
	
}

const gradient = (nrCircles: number, edges: Edge[]): DeltaXY[] => {
	const meanDist = meanDistance(edges);

	const learnRate = 4.5;

	const gradient = Array.from({length: nrCircles}, () => ({dx: 0, dy: 0}));

	for (let e of edges) {
		const dXY = getShortestThoroidalDeltaXY(e.c0, e.c1);
		const distance = getDistance(dXY);
		const l = learnRate * (1 - meanDist / distance);

		gradient[e.c0.id].dx -= dXY.dx * l;
		gradient[e.c0.id].dy -= dXY.dy * l;
		gradient[e.c1.id].dx += dXY.dx * l;
		gradient[e.c1.id].dy += dXY.dy * l;

	}

	return gradient;

}

const descent = (circles: Circle[], gradient: DeltaXY[]): Circle[] => {
	const speed = 0.01;

	return circles.map(c => {
		const gr = gradient[c.id];

		c.x = c.x - (gr.dx * speed);
		c.y = c.y - (gr.dy * speed);

		return c;
	});

}

export const gradientDescent = ({edges, circles}: ContactGraph, timeoutMs: number): Circle[] => {
	console.log('start gradient descent');

	const start = new Date().getTime();
	let v = variance(edges);
	let cnt = 0;

	while (v > 1e-25) {
		const gradientMap = gradient(circles.length, edges);
		descent(circles, gradientMap);

		v = variance(edges);

		if (cnt % 50000 === 0) {
			console.log('v', v);

		}

		const elapsedTime = new Date().getTime() - start;

		if (elapsedTime > timeoutMs) {
			throw new TimeoutError("Time out!");
		}

		cnt++;
	}

	console.log('md', meanDistance(edges) / 2);
	console.log(`gradient descent found in: ${new Date().getTime() - start} ms`)

	return circles;
}