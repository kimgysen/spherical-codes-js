import Circle from "../../../../common/domain/Circle";
import {getShortestThoroidalDeltaXY} from "../../../../common/lib/CollisionLib";

export const scaleCircles = (circles: Circle[], scale: number) => {
	return circles.map(c => ({
		...c,
		x: c.x * scale,
		y: c.y * scale
	}));
}

export const getMissingCircles = (circles: Circle[], radius: number, scale: number) => {
	const addedCircles = [];

	const addMatchingCircles = (c: Circle, radius: number) => {
		if (c.x < radius) {
			addedCircles.push({...c, x: c.x + 1});
		}
		if ((1 - c.x) < radius) {
			addedCircles.push({...c, x: c.x - 1});
		}
		if (c.y < radius) {
			addedCircles.push({...c, y: c.y + 1});
		}
		if ((1 - c.y) < radius) {
			addedCircles.push({...c, y: c.y - 1});
		}

	}

}

export const multiplyCircles = (circles: Circle[], scale: number) => {
	return circles.reduce((acc, c) => {
		c.x *= scale;
		c.y *= scale;

		const ctl = {...c, x: c.x - scale, y: c.y - scale};
		const ctm = {...c, x: c.x, y: c.y - scale};
		const ctr = {...c, x: c.x + scale, y: c.y - scale};
		const cml = {...c, x: c.x - scale, y: c.y};
		const cmm = {...c, x: c.x, y: c.y};
		const cmr = {...c, x: c.x + scale, y: c.y};
		const cbl = {...c, x: c.x - scale, y: c.y + scale};
		const cbm = {...c, x: c.x, y: c.y + scale};
		const cbr = {...c, x: c.x + scale, y: c.y + scale};

		return acc.concat([ctl, ctm, ctr, cml, cmm, cmr, cbl, cbm, cbr]);

	}, []);

}