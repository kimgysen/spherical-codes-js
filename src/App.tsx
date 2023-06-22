import {FC, useEffect, useRef} from "react";
import Canvas from "./component/canvas/Canvas";
import Circle from "./domain/Circle";
import OffscreenCanvas from "./lib/circles/OffscreenCanvas";

const App: FC = () => {

	const NR_POINTS = 19;

	const canvasRef = useRef(null)

	const getCtx = () => {
		const canvas = canvasRef.current;
		return canvas.getContext('2d');
	}

	let offScreenCanvas = new OffscreenCanvas(NR_POINTS);

	const drawCircle = (ctx: any, c: Circle, idx: number) => {

		ctx.beginPath();
		ctx.arc(c.x, c.y, c.radius, 0, 2 * Math.PI, false);
		ctx.lineWidth = 1;
		ctx.strokeStyle = c.color || '#003300';
		// ctx.fillStyle = circle.getColor() || 'white';
		// ctx.fill();
		ctx.font = '10px Arial';
		ctx.textAlign = 'center';
		ctx.fillStyle = 'black';
		ctx.fillText(c.id, c.x, c.y);
		ctx.stroke();
	}

	const drawCircles = (circles: Circle[]) => {
		getCtx().clearRect(0, 0, 300, 300);
		circles.map((circle: Circle, idx: number) =>
			drawCircle(getCtx(), circle, idx));
	}

	useEffect(() => {
		// const startTime = new Date().getTime();
		//
		// offScreenCanvas.resolveCollisions();
		//
		// const endTime = new Date().getTime();
		// const timeDiff = endTime - startTime; //in ms
		//
		// console.log('Found in ' + timeDiff + 'milliseconds');
		//
		// getCtx().clearRect(0, 0, 300, 300);
		// getCtx().scale(3, 3);
		getCtx().clearRect(0, 0, 300, 300);
		getCtx().scale(3, 3);

		// offScreenCanvas.getCircles()
		// 	.map((circle: Circle, idx: number) => drawCircle(getCtx(), circle, idx));

	}, []);

	const handleClick = () => {
		const tryRadius = async (radius: number): Promise<any> => {
			let it: any = offScreenCanvas.resolveGenerator(radius);

			return new Promise((resolve) => {
				let intervalId = setInterval(() => {
					let val = it.next();

					if (!val.done && val.value) {
						const {status, detail} = val.value;

						if (status === 'collision_solved') {
							// drawCircles(detail);

						} else if (status === 'done') {
							clearInterval(intervalId);
							drawCircles(val.value.circles);

							resolve(val.value);

						}

					} else if (val.done) {
						clearInterval(intervalId);

						resolve(val.value);

					}

				}, 0);
			});

		}

		(async () => {

			const asyncGen = offScreenCanvas.findOptimalRadius(tryRadius, drawCircles);

			let next;
			while (!(next = await asyncGen.next()).done) {
				console.log('** next **', next);
				if (next.value.status === 'done') {
					const radius = next.value;

					// console.log('final', radius);
					// getCtx().clearRect(0, 0, 300, 300);
					// offScreenCanvas.getAllCircles(radius).map((circle: Circle, idx: number) =>
					// 	drawCircle(getCtx(), circle, idx));

					// const res = await tryRadius(radius, 5000);
					//
					// if (res.value.status === 'done') {
					// 	console.log('Solution found', res.value.attempts);
					//
					// } else {
					// 	console.log('No solution found');
					//
					// }

				} else {
					console.log('not done', next);

				}
			}

		})();

	}

	return (
		<div>
			<h1 className="heading">Circles</h1>
			<Canvas
				options={{
					context: '2d',
					canvasWidth: 300,
					canvasHeight: 300
				}}
				canvasRef={canvasRef}
			/>
			<button onClick={handleClick}>Next collision</button>
		</div>
	);
};

export default App;