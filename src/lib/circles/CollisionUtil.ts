import Circle from "../../domain/Circle";


/**
 * Grow the radius with dr and remove collisions one time
 */
export const growRadius = (circles: any[], radius, dr) => {
	const newRadius = radius + dr;
	const collisions = getCollisions(circles, newRadius);

	removeCollisions(collisions, newRadius);

	return [newRadius, collisions];
}

/**
 * Get distance between two points, taken into account Thoroidal space & vector direction
 */
const getDeltaXY = (c0: Circle, c1: Circle, scale = 100): any => {
	const [dxInt, dyInt] = [c1.x - c0.x, c1.y - c0.y];
	const [dxIntAbs, dyIntAbs] = [Math.abs(dxInt), Math.abs(dyInt)];

	const [dirX, dirY] = [Math.sign(dxInt), Math.sign(dyInt)]; // Vector direction
	const [dxExt, dyExt] = [(scale - dxIntAbs) * -dirX, (scale - dyIntAbs) * -dirY];
	const [dxExtAbs, dyExtAbs] = [Math.abs(dxExt), Math.abs(dyExt)];

	return {
		dx: dxIntAbs < dxExtAbs ? dxInt : dxExt,
		dy: dyIntAbs < dyExtAbs ? dyInt : dyExt
	}

}

/**
 * Get collisions between all circles
 * Store c0, c1 and deltaXY for each collision
 */
export const getCollisions = (circles: Circle[], radius: number) => {
	const collisions = [];

	function saveCollision(c0: Circle, c1: Circle) {
		const deltaXY = getDeltaXY(c0, c1);

		if (c0.id !== c1.id && hasCollision(deltaXY, radius)) {
			collisions.push({c0, c1, deltaXY: getDeltaXY(c0, c1)});
		}
	}

	for (let i = 0; i < circles.length; i++) {
		for (let j = i + 1; j < circles.length; j++) {
			saveCollision(circles[i], circles[j]);
		}
	}

	return collisions;
}

/**
 * Remove all collisions
 */
export const removeCollisions = (collisions: any[], radius: number) => {
	collisions.forEach(
		collision => removeCollision(collision, radius));

}

/**
 * Remove a single collision
 */
const removeCollision = (collision: any, radius, scale = 100) => {
	const {c0, c1, deltaXY: {dx, dy}} = collision;

	const distance = Math.sqrt(dx ** 2 + dy ** 2);
	const displacement = radius - distance / 2;

	let ux = dx / distance;
	let uy = dy / distance;

	c0.x = ((c0.x - displacement * ux) + scale) % scale;
	c1.x = ((c1.x + displacement * ux) + scale) % scale;
	c0.y = ((c0.y - displacement * uy) + scale) % scale;
	c1.y = ((c1.y + displacement * uy) + scale) % scale;

}

/**
 * Find the min distance
 */
export const minDistance = (collisions: any, maxRadius: number): number => {
	let minDistance = maxRadius;

	return collisions.reduce((min,{deltaXY: {dx, dy}}) => {
		const distance = Math.sqrt(dx ** 2 + dy ** 2);

		return Math.min(minDistance, distance) / 2;

	}, maxRadius)

}

/**
 * Check if two circles have a collision based on its deltaXY
 */
export const hasCollision = (deltaXY: any, radius: number): boolean => {
	const {dx, dy} = deltaXY;

	return (dx ** 2 + dy ** 2) < 4 * radius ** 2;

}


