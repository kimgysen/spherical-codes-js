import Circle from "../domain/Circle";
import Collision from "../domain/Collision";
import DeltaXY from "../domain/DeltaXY";
import {iterateUniqueCirclePairs} from "./util/IterateUtil";
import Distance from "../domain/Distance";


/**
 * Grow the radius with dr and get newly created collisions
 */
export const growRadius = (circles: Circle[], radius: number, dr: number) => {
	const grownRadius = radius + dr;
	const collisions = getCollisions(circles, grownRadius);

	return {grownRadius, collisions};
}

/**
 * Get shortest deltaXY between two points
 */
export const getShortestThoroidalDeltaXY = (c0: Circle, c1: Circle): DeltaXY => {
	const abs = Math.abs, sign = Math.sign;

	const dxInt = c1.x - c0.x;
	const dyInt = c1.y - c0.y;

	const dxExt = (1 - abs(dxInt)) * -sign(dxInt);
	const dyExt = (1 - abs(dyInt)) * -sign(dyInt);

	const dx = abs(dxInt) < abs(dxExt) ? dxInt : dxExt;
	const dy = abs(dyInt) < abs(dyExt) ? dyInt : dyExt;

	return {
		dx,
		dy,
		int: {dx: dxInt, dy: dyInt},
		ext: {dx: dxExt, dy: dyExt},
		isInt: dx === dxInt && dy === dyInt,
		isExt: !(dx === dxInt && dy === dyInt)
	}

}

/**
 * Get the shortest thoroidal distance between two points
 */
export const getShortestThoroidalDistance = (c0: Circle, c1: Circle): number => {
	const deltaXY = getShortestThoroidalDeltaXY(c0, c1);

	return getDistance(deltaXY);
}

/**
 * Get collisions for all unique circle pairs
 */
export const getCollisions = (circles: Circle[], radius: number): Collision[] => {
	const collisions = [];

	iterateUniqueCirclePairs(circles, (c0: Circle, c1: Circle) => {
		const deltaXY = getShortestThoroidalDeltaXY(c0, c1);

		if (hasCollision(deltaXY, radius)) {
			collisions.push({c0, c1, deltaXY});
		}
	});

	return collisions;
}

/**
 * Calculate distance based on deltaXY
 */
export const getDistance = ({dx, dy}: DeltaXY) => {
	return Math.sqrt(dx ** 2 + dy ** 2);
}

/**
 * Remove all collisions
 */
export const removeCollisions = (collisions: any[], radius: number) => {
	collisions.forEach(coll => removeCollision(coll, radius));
}

/**
 * Remove a single collision
 */
const removeCollision = (collision: Collision, radius: number) => {
	const {c0, c1, deltaXY: {dx, dy}} = collision;

	const distance = getDistance({dx, dy});
	const displacement = radius - distance / 2;

	let [ux, uy] = [dx, dy].map(d => d / distance);

	c0.x = ((c0.x - displacement * ux) + 1) % 1;
	c1.x = ((c1.x + displacement * ux) + 1) % 1;
	c0.y = ((c0.y - displacement * uy) + 1) % 1;
	c1.y = ((c1.y + displacement * uy) + 1) % 1;

}

/**
 * Find the min distance between two points in an array of collisions
 */
export const minDistance = (collisions: Collision[], maxRadius?: number): number => {
	let minDistance = maxRadius || 9999999;

	return collisions
		.reduce((min, {deltaXY}) =>
			Math.min(min, getDistance(deltaXY)), minDistance)

}

/**
 * Find the min distance between two points in an array of circles
 */
export const minDistanceCircles = (circles: Circle[], minDistance: number = 99999): number => {
	iterateUniqueCirclePairs(circles, (c0, c1) => {
		const deltaXY = getShortestThoroidalDeltaXY(c0, c1);

		minDistance = Math.min(minDistance, getDistance(deltaXY));
	});

	return minDistance;
}

/**
 * Check if two circles have a collision based on their deltaXY
 */
export const hasCollision = ({dx, dy}: DeltaXY, radius: number): boolean => {
	return (dx ** 2 + dy ** 2) < 4 * radius ** 2;

}

/**
 * Final check to verify if there is an infinite collision.
 */
export const hasInfiniteCollision = (circles: Circle[], radius: number, maxPrecision: number) => {
	const collisions = getCollisions(circles, radius);

	return collisions.length > 0
		&& (2 * radius - minDistance(collisions)) > maxPrecision * 10;

}

