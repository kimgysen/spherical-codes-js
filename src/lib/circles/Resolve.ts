import Circle from "../../domain/Circle";

const offset = [
	[-100, -100], [-100, 0], [-100, 100],
	[0, -100], [0, 0], [0, 100],
	[100, -100], [100, 0], [100, 100],
]

const numCircles = 19;


const distanceSqr = (x0, y0, x1, y1) => {
	return (x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0)
}

const thoroidalDistance = () => {

}

export const minDistance = (circles: Circle[]) => {
	let ret = 10000;
	for (let i = 0; i < numCircles; i++) {
		for (let j = i + 1; j < numCircles; j++) {
			for (let k = 0; k < 9; k++) {
				let d = distanceSqr(circles[i].x, circles[i].y, circles[j].x - offset[k][0], circles[j].y - offset[k][1]);
				if (d < ret) {
					ret = d
				}
				d = distanceSqr(circles[i].x - offset[k][0], circles[i].y - offset[k][1], circles[j].x, circles[j].y);
				if (d < ret) {
					ret = d

				}
			}
		}
	}

	return Math.sqrt(ret) / 2;

}

const circlesCollide = (c0: Circle, c1: Circle, radius) => {
	let ret = -1
	for (let i = 0; i < 9; i++) {
		if (c0.x - c1.x + offset[i][0] < 2 * radius) {
			if (distanceSqr(c0.x, c0.y, c1.x - offset[i][0], c1.y - offset[i][1]) < 4 * radius * radius) {
				ret = i;

			}
		}
	}

	return ret

}

const removeCollision = (c0: Circle, c1: Circle, offsetId, radius) => {

	const distance = Math.sqrt(distanceSqr(c0.x, c0.y, c1.x - offset[offsetId][0], c1.y - offset[offsetId][1]));
	const displacement = radius - distance / 2;
	const Ux = (c1.x - offset[offsetId][0] - c0.x) / distance
	const Uy = (c1.y - offset[offsetId][1] - c0.y) / distance

	c0.x = c0.x - displacement * Ux;
	c0.y = c0.y - displacement * Uy;
	c1.x = c1.x + displacement * Ux;
	c1.y = c1.y + displacement * Uy;

	c1.color = 'red';

}

export const removeCollisions = (radius: number, circles: Circle[]) => {
	for (let i = 0; i < numCircles; i++) {
		for (let j = i + 1; j < numCircles; j++) {
			let offsetId = circlesCollide(circles[i], circles[j], radius);

			if (offsetId > -1) {
				// console.log('remove collision', radius);
				removeCollision(circles[i], circles[j], offsetId, radius);
			}

		}
	}
}

export const grow = (radius, dr, circles: Circle[]) => {
	radius = radius + dr;
	for (let i = 0; i < 10; i++) {
		removeCollisions(radius, circles);

	}
	return radius;
}

const collisionsCount = (circles: Circle[], c: Circle, radius: number, collisionStr: string) => {
	let ret = 0;
	for (let i = 0; i < 10; i++) {
		if ((circles[i] != c) && (circlesCollide(c, circles[i], radius) > -1)) {
			ret = ret + 1
			collisionStr += c.id + '-' + circles[i].id + ','
		}
	}

	return [ret, collisionStr];
}


// def
// fullCollision(radius, collisionStr)
// :
// nColls = 0
// for i in range(0, numCircles):
// [count, collisionStr] = collisionsCount(i, radius, collisionStr)
// nColls = nColls + count
// return [nColls, collisionStr]

export const fullCollision = (circles: Circle[], radius, collisionStr) => {
	let nColls = 0;
	let count;
	for (let i = 0; i < numCircles; i++) {
		[count, collisionStr] = collisionsCount(circles, circles[i], radius, collisionStr);
		nColls += count;
	}
	// console.log('collisions', nColls);
	return [nColls, collisionStr];
}
