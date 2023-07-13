import Circle from "../../domain/Circle";


export const drawCircle = (ctx: any, c: Circle, idx: number) => {
	ctx.beginPath();
	ctx.arc(c.x, c.y, c.radius, 0, 2 * Math.PI, false);
	ctx.lineWidth = 0.5;
	ctx.strokeStyle = c.color || '#003300';
	// ctx.fillStyle = circle.getColor() || 'white';
	// ctx.fill();
	ctx.font = '10px Arial';
	ctx.textAlign = 'center';
	ctx.fillStyle = 'black';
	ctx.fillText(c.id, c.x, c.y);
	ctx.stroke();
}

export const drawCircles = (ctx: any, circles: Circle[]) => {
	ctx.clearRect(0, 0, 300, 300);
	circles.map((circle: Circle, idx: number) => drawCircle(ctx, circle, idx));
}
