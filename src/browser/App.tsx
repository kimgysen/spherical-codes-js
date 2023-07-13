import {FC, useEffect, useRef} from "react";
import Canvas from "./component/Canvas";
import ThoroidalSpaceBrowser from "./lib/ThoroidalSpaceBrowser";
import {generateRandomPoints} from "../lib/circles/PointsFactory";
import {drawCircles} from "./draw/draw";
import InputConfig from "../domain/InputConfig";


const NR_POINTS = 10;

const inputConfig: InputConfig = {
	initRadius: 5,
	speedFactor: 0.90,
	maxPrecision: 1e-12,
	maxCollisions: 19
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
							drawCircles(getCtx(), circles);
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
					console.log('Max radius foud is: ', radius);
					console.log('Circles: ', circles);

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