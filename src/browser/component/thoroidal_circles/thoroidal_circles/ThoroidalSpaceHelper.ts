import Circle from "../../../../common/domain/Circle";
import {getShortestThoroidalDeltaXY} from "../../../../common/lib/CollisionLib";
import {drawCircles} from "../../../draw/draw";
import {cloneArray} from "../../../../common/lib/util/CloneUtil";

export const initCanvas = (ctx: any, scaleFactor: number, scalePx: number) => {
	ctx.clearRect(0, 0, scaleFactor * scalePx, scaleFactor * scalePx);
	ctx.scale(scaleFactor, scaleFactor);

}

export const drawAllCircles = (ctx: any, radius: number, circles: Circle[], scalePx: number) => {
	drawCircles(ctx, multiplyCircles(cloneArray(circles), scalePx), radius * scalePx, scalePx);
}

export const scaleCircles = (circles: Circle[], scale: number) => {
	return circles.map(c => ({
		...c,
		x: c.x * scale,
		y: c.y * scale
	}));
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