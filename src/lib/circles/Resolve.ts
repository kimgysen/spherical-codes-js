import Circle from "../../domain/Circle";


const SCALE = 100;
const NUM_CIRCLES = 2;
let NR_REMOVE_COLLISIONS = 1;


/**
 * Get distance between two points, taken into account Thoroidal space & vector direction
 */
const getDeltaXY = (c0: Circle, c1: Circle, scale = 100): any => {
	const [dxInt, dyInt] = [c1.x - c0.x, c1.y - c0.y];
	const [dxIntAbs, dyIntAbs] = [Math.abs(dxInt), Math.abs(dyInt)];

	const [dirX, dirY] = [dxInt / dxInt, dyInt / dyInt]; // Vector direction
	const [dxExt, dyExt] = [(scale - dxIntAbs) * -dirX, (scale - dyIntAbs) * -dirY];
	const [dxExtAbs, dyExtAbs] = [Math.abs(dxExt), Math.abs(dyExt)];

	return {
		dx: dxIntAbs < dxExtAbs ? dxInt : dxExt,
		dy: dyIntAbs < dyExtAbs ? dyInt : dyExt
	}

}

export const minDistance = (circles: Circle[], maxRadius?: number): number => {
	let minDistance = maxRadius || 10000;

	for (let i = 0; i < circles.length - 1; i++) {
		const {dx, dy} = getDeltaXY(circles[i], circles[i + 1]);
		const distance = Math.sqrt(dx ** 2 + dy ** 2);

		minDistance = Math.min(minDistance, distance);

	}

	return minDistance / 2;
}

export const hasCollision = (c0: Circle, c1: Circle, radius: number): boolean => {
	const {dx, dy} = getDeltaXY(c0, c1);

	console.log('hasCollision dx', dx);
	console.log('hasCollision dy', dy);

	return (dx ** 2 + dy ** 2) < 4 * radius ** 2;

}


const removeCollision = (c0: Circle, c1: Circle, radius, scale = 100) => {
	const {dx, dy} = getDeltaXY(c0, c1);

	console.log('dx', dx);
	console.log('dy', dy);

	const distance = Math.sqrt(dx ** 2 + dy ** 2);
	// const displacement = Math.abs((distance - 2 * radius) / 2);
	const displacement = radius - distance / 2;

	console.log('distance', distance);
	console.log('displacement', displacement);

	let ux = dx / distance;
	let uy = dy / distance;

	console.log('ux', ux);
	console.log('uy', uy);
	console.log('ux * displacement', ux * displacement);
	console.log('c0.x - displacement * ux', c0.x - displacement * ux);
	console.log('c1.x + displacement * ux', c1.x + displacement * ux);
	console.log('c0.y - displacement * uy', c0.y - displacement * uy);
	console.log('c1.y + displacement * uy', c1.y + displacement * uy);

	c0.x = c0.x - displacement * ux;
	c1.x = c1.x + displacement * ux;
	c0.y = c0.y + displacement * uy;
	c0.y = c1.y - displacement * uy;

}

export const removeCollisions = (radius: number, circles: Circle[]) => {
	console.log('*** removeCollisions', radius);
	for (let i = 0; i < NUM_CIRCLES; i++) {
		for (let j = i + 1; j < NUM_CIRCLES; j++) {
			if (hasCollision(circles[i], circles[j], radius)) {
				console.log('!!!removeCollision: ');
				console.log('circles[i].id', circles[i]);
				console.log(' circles[j].id', circles[j])

				removeCollision(circles[i], circles[j], radius);
			}

		}
	}
}

export const grow = (radius, dr, circles: Circle[]) => {
	radius = radius + dr;
	for (let i = 0; i < NR_REMOVE_COLLISIONS; i++) {
		removeCollisions(radius, circles);
	}
	return radius;
}

const collisionsCount = (circles: Circle[], c: Circle, radius: number, collisionStr: string) => {
	let ret = 0;
	for (let i = 0; i < NUM_CIRCLES; i++) {
		if ((circles[i] != c) && (hasCollision(c, circles[i], radius))) {
			ret = ret + 1
			collisionStr += c.id + '-' + circles[i].id + ','
		}
	}

	return [ret, collisionStr];
}

export const fullCollision = (circles: Circle[], radius, collisionStr) => {
	let nColls = 0;
	let count;
		[count, collisionStr] = collisionsCount(circles, circles[0], radius, collisionStr);
		console.log('collisionStr', collisionStr);
		nColls += count;
	// for (let i = 0; i < NUM_CIRCLES; i++) {
	// 	[count, collisionStr] = collisionsCount(circles, circles[i], radius, collisionStr);
	// 	console.log('collisionStr', collisionStr);
	// 	nColls += count;
	// }
	// console.log('collisions', nColls);
	return [nColls, collisionStr];
}
