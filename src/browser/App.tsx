import {FC, useEffect, useRef} from "react";
import Canvas from "./component/Canvas";
import ThoroidalSpaceBrowser from "./lib/ThoroidalSpaceBrowser";
import {generateRandomPoints} from "../lib/circles/PointsFactory";
import {drawCircles} from "./draw/draw";
import InputConfig from "../domain/InputConfig";
import Circle from "../domain/Circle";


const SCALE = 100;
const NR_POINTS = 4;

const inputConfig: InputConfig = {
	initRadius: 0.10,
	speedFactor: 0.90,
	maxPrecision: 1e-14,
	maxCollisions: 4
}

const App: FC = () => {

	const canvasRef = useRef(null)

	let intervalId;

	const getCtx = () => {
		const canvas = canvasRef.current;
		return canvas.getContext('2d');
	}

	useEffect(() => {
		getCtx().clearRect(0, 0, 300, 300);
		getCtx().scale(3, 3);

	}, []);

	const handleClick = () => {
		const points = generateRandomPoints(NR_POINTS);
		const thoroidalSpace = new ThoroidalSpaceBrowser(points, inputConfig);

		console.log('Trying to find max radius in thoroidal space for ' + points.length + ' points...');

		if (intervalId) {
			clearInterval(intervalId);
		}

		const fnGrowRadius = async (): Promise<any> => {
			let it: any = thoroidalSpace.growRadiusGenerator();

			return new Promise((resolve) => {
				intervalId = setInterval(() => {
					let val = it.next();

					if (!val.done && val.value) {
						const {status, data: {circles}} = val.value;

						if (status === 'done') {
							const mapped = circles.map(c => ({
								id: c.id,
								x: c.x * SCALE,
								y: c.y * SCALE,
								radius: c.radius * 100
							}));

							drawCircles(getCtx(), mapped);
						}
					}

					clearInterval(intervalId);
					resolve(val.value);

				}, 0);
			});

		}

		(async () => {

			const asyncGen = thoroidalSpace.findMaxRadius(fnGrowRadius);

			let next;
			while (!(next = await asyncGen.next()).done) {
				const {radius, circles} = next.value.data;

				if (next.value.status === 'done') {
					const allCircles = multiplyCircles(circles);
					drawCircles(getCtx(), allCircles);

					console.log('Max radius foud is: ', radius);
					console.log('Circles: ', allCircles);

				}
			}

		})();

	}

	function multiplyCircles(circles: Circle[]) {
		return circles.reduce((acc, c) => {
			c.radius *= SCALE;
			c.x *= SCALE;
			c.y *= SCALE;

			const ctl = {...c, x: c.x - SCALE, y: c.y - SCALE};
			const ctm = {...c, x: c.x, y: c.y - SCALE};
			const ctr = {...c, x: c.x + SCALE, y: c.y - SCALE};
			const cml = {...c, x: c.x - SCALE, y: c.y};
			const cmm = {...c, x: c.x, y: c.y};
			const cmr = {...c, x: c.x + SCALE, y: c.y};
			const cbl = {...c, x: c.x - SCALE, y: c.y + SCALE};
			const cbm = {...c, x: c.x, y: c.y + SCALE};
			const cbr = {...c, x: c.x + SCALE, y: c.y + SCALE};

			return acc.concat([ctl, ctm, ctr, cml, cmm, cmr, cbl, cbm, cbr]);

		}, []);
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