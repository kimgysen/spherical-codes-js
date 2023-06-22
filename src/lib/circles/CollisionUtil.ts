// import {Point} from "./index";
// import Circle from "../../domain/Circle";
// import {Collision, Intersection} from "../../domain/Intersection";
//
//
// export type Displacement = {
// 	x: number,
// 	y: number
// }
//
// const offset = [
// 	[-1, -1], [-1, 0], [-1, 1],
// 	[0, -1], [0, 0], [0, 1],
// 	[1, -1], [1, 0], [1, 1],
// ]
//
// // export const hasCollision = (c1: Circle, c2: Circle, radius: number): boolean => {
// // 	const diffX = Math.abs(c1.getCenter().x - c2.getCenter().x);
// // 	const diffY = Math.abs(c1.getCenter().y - c2.getCenter().y);
// //
// // 	const d = +(Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2))).toPrecision(11);
// //
// // 	return d < 2 * radius;
// // }
//
// export const getCollision = (distance: number, radius: number): Collision => {
//
// 	const collisionSize = distance - (2 * radius);
//
// 	return {
// 		size: collisionSize,
// 		hasCollision: collisionSize < 0 || collisionSize === 0
// 	};
// }
//
// export const getIntersections = (circles: Circle[], radius: number): Intersection[] => {
// 	const intersections = [];
//
// 	for (let i = 0; i < circles.length; i++) {
// 		for (let j = 0; j < circles.length; j++) {
//
// 			if (j != i) {
// 				const d = getDistance(circles[i].center, circles[j].getCenter());
// 				const collision = getCollision(d.length, radius);
//
// 				if (collision.hasCollision) {
// 					intersections.push({
// 						orig: circles[i],
// 						target: circles[j],
// 						collision
// 					});
//
// 				}
// 			}
// 		}
// 	}
//
// 	return intersections;
// }
//
// export const getDisplacement = (p1: Point, p2: Point, radius: number, c?: Circle): Displacement => {
// 	let dx = p2.x - p1.x;
// 	let dy = p2.y - p1.y;
//
// 	const {length: d, direction: {x: dirX, y: dirY}} = getDistance(p1, p2);
//
// 	const displacementX = d === 0 ? radius : (dx * dirX) / (2 * d) * (2 * radius - d);
// 	const displacementY = d === 0 ? 0 : (dy * dirY) / (2 * d) * (2 * radius - d);
//
// 	return {
// 		x: displacementX,
// 		y: displacementY
// 	}
//
// }
//
// export type Distance = {
// 	points: Point[];
// 	length: number;
// 	direction: {
// 		x: number,
// 		y: number
// 	}
// }
// //
// // export const getTop3ShortestDistances = (circles: Circle[]): Distance[] => {
// // 	const TopThreeDistanceLengths = [];
// // 	const TopThreeDistances = [];
// //
// // 	for (let i = 0; i < circles.length; i++) {
// // 		for (let j = 0; j < circles.length; j++) {
// // 			if (j > i) {
// // 				const d = getDistance(circles[i].getCenter(), circles[j].getCenter());
// //
// // 				if (TopThreeDistanceLengths.length < 3) {
// // 					TopThreeDistanceLengths.push(d.length);
// // 					TopThreeDistances.push(d);
// //
// // 				} else {
// // 					const idx = TopThreeDistanceLengths.findIndex(() => Math.min(...TopThreeDistanceLengths) > d.length);
// // 					if (idx > -1) {
// // 						TopThreeDistanceLengths[idx] = d.length;
// // 						TopThreeDistances[idx] = d;
// // 					}
// // 				}
// // 			}
// // 		}
// // 	}
// //
// // 	return TopThreeDistances;
// // }
//
//
// export const getDistance = (p1: Point, p2: Point): Distance => {
//
// 	const dx = Math.abs(p2.x - p1.x);
// 	const dy = Math.abs(p2.y - p1.y);
//
// 	const dxShort = Math.min(dx, Math.abs(100 - dx));
// 	const dyShort = Math.min(dy, Math.abs(100 - dy));
//
// 	// Big(dxShort).pow(2).plus(Big(dyShort).pow(2)).sqrt().toFixed(10) as unknown as number
//
// 	// console.log('dyShort', dyShort);
// 	const length = Math.sqrt(Math.pow(dxShort, 2) + (Math.pow(dyShort, 2)));
// 	// console.log('length', length);
//
// 	return {
// 		points: [p1, p2],
// 		length,
// 		direction: {
// 			x: dx > dxShort ? -1 : 1,
// 			y: dy > dyShort ? -1 : 1
// 		}
// 	};
// }
//
// export const getMinDistance = (points: Point[], maxRadius?: number): number => {
// 	let minDistance = maxRadius ? maxRadius / 2: getDistance(points[0], points[1]).length ;
//
// 	for (let i = 0; i < points.length - 1; i++) {
// 		minDistance = Math.min(minDistance, getDistance(points[i], points[i + 1]).length);
//
// 	}
//
// 	return minDistance / 2;
// }
