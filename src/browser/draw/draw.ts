import Circle from "../../common/domain/Circle";
import {ContactGraph} from "../../common/lib/geometrical_complexity/ComplexityIndexLib";


export const drawCircle = (ctx: any, c: Circle, radius: number) => {
	ctx.beginPath();
	ctx.arc(c.x, c.y, radius, 0, 2 * Math.PI, false);
	ctx.lineWidth = 0.5;
	ctx.strokeStyle = c.color || '#003300';
	// ctx.fillStyle = circle.getColor() || 'white';
	// ctx.fill();
	// ctx.font = '10px Arial';
	// ctx.textAlign = 'center';
	ctx.fillStyle = 'black';
	// ctx.fillText(c.id, c.x, c.y);
	ctx.stroke();
}

export const drawCircles = (ctx: any, circles: Circle[], radius) => {
	ctx.clearRect(0, 0, 300, 300);
	circles.map((circle: Circle) => drawCircle(ctx, circle, radius));
}

const drawLine = (ctx: any, {x: xFrom, y: yFrom}, {x: xTo, y: yTo}) => {
	ctx.beginPath();
	ctx.moveTo(xFrom, yFrom);
	ctx.lineTo(xTo, yTo);

	ctx.stroke();
}

export const drawContactGraph = (ctx: any, contactGraph: ContactGraph, scale) => {
	const {edges} = contactGraph;

	edges.forEach(e =>  {
		const {x: xC0, y: yC0 } = e.c0;
		const {x: xC1, y: yC1 } = e.c1;

		drawLine(ctx,
			{ x: xC0 * scale, y: yC0 * scale},
			{x: xC1 * scale, y: yC1 * scale});
	})
}