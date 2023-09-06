import {FC, useEffect, useRef, useState} from "react";
import InputConfig from "../../../../common/domain/InputConfig";
import {generateRandomPoints} from "../../../../common/lib/circles/PointsFactory";
import ThoroidalSpaceBrowser from "../../../lib/ThoroidalSpaceBrowser";
import {drawCircles, drawContactGraph} from "../../../draw/draw";
import {multiplyCircles, scaleCircles} from "./ThoroidalSpaceHelper";
import CanvasCmp from "../../canvas/CanvasCmp";
import ThoroidalInputConfigCmp from "../input_config/ThoroidalInputConfigCmp";
import './ThoroidalCircles.css';
import {useLocalStorage} from "../../../hooks/LocalStorage";
import {buildContactGraph} from "../../../../common/lib/geometrical_complexity/ComplexityIndexLib";
import {getCollisions, getDistance} from "../../../../common/lib/circles/CollisionLib";


const TIMEOUT_SPEED = 0; // Timeout milliseconds
const SCALE = 300;
const DEFAULT_NR_POINTS = 131;
const LOCAL_STORAGE_NR_POINTS = 'nr-points';
const LOCAL_STORAGE_INPUT_CFG = 'input-cfg';

const defaultInputCfg: InputConfig = {
	initRadius: 0.00001,
	speedFactor: 0.99,
	maxPrecision: 16,
	maxCollisions: 152
}

const ThoroidalCirclesCmp: FC = () => {

	const [nrPoints, setNrPoints] = useLocalStorage(LOCAL_STORAGE_NR_POINTS, DEFAULT_NR_POINTS);
	const [inputCfg, setInputCfg] = useLocalStorage(LOCAL_STORAGE_INPUT_CFG, defaultInputCfg);

	const canvasRef = useRef(null);

	let intervalId;

	const getCtx = () => {
		const canvas = canvasRef.current;
		return canvas.getContext('2d');
	}

	useEffect(() => {
		getCtx().clearRect(0, 0, 900, 900);
		getCtx().scale(3, 3);

	}, []);

	const handleClick = () => {
		const points = generateRandomPoints(nrPoints as number, inputCfg.maxPrecision);
		const thoroidalSpace = new ThoroidalSpaceBrowser(points, inputCfg as InputConfig);

		console.log('Trying to find max radius in thoroidal space for ' + points.length + ' points...');

		if (intervalId) {
			clearInterval(intervalId);
		}

		const fnGrowRadius = async (): Promise<any> => {
			let it: any = thoroidalSpace.growRadiusGenerator();

			return new Promise((resolve) => {
				intervalId = setInterval(() => {
					let {done, value} = it.next();

					if (!done) {
						const {data: {grownRadius, circles}} = value;
						console.log('grownRadius', grownRadius);

						drawCircles(getCtx(), scaleCircles(circles, SCALE), grownRadius * SCALE);
					}

					clearInterval(intervalId);
					resolve(value);

				}, TIMEOUT_SPEED);
			});

		}

		(async () => {
			const asyncGen = thoroidalSpace.findMaxRadius(fnGrowRadius);

			let next;
			while (!(next = await asyncGen.next()).done) {
				const {status} = next.value;

				switch (status) {
					case 'done':
						const {data: { radius, circles }} = next.value;

						console.log('circles', circles);
						// const collisions = getCollisions(circles, radius);
						// collisions.forEach(coll => {
						// 	const distance = getDistance(coll.deltaXY.dx, coll.deltaXY.dy);
						// 	console.log(coll.c0.id + ':' + coll.c1.id + ':' + Math.abs(2 * radius - distance));
						// });
						// console.log('collisions', collisions);
						const scaledRadius = radius * SCALE;
						drawCircles(getCtx(), multiplyCircles(circles, SCALE), scaledRadius);
						console.log('circles', circles);
						const contactGraph = buildContactGraph(scaleCircles(circles, 1/SCALE), scaledRadius, 1e-16);
						drawContactGraph(getCtx(), contactGraph, SCALE);
						console.log('contactGraph', contactGraph);
						console.log('max radius found: ', radius);
						break;

					case 'failed':
						const {msg} = next.value;
						console.log(msg);
						break;

				}
			}
		})();

	}

	return (
		<div>
			<h1 className="heading">Circles</h1>
			<div className='left-section'>
				<ThoroidalInputConfigCmp
					nrPoints={nrPoints as number}
					setNrPoints={(val) => setNrPoints(val)}
					inputConfig={inputCfg as InputConfig}
					setInputConfig={(cfg) => setInputCfg(cfg)}
				/>
				<div>
					<button onClick={handleClick}>Generate</button>
				</div>
			</div>
			<div className='thoroidal-circles float-left'>
				<CanvasCmp
					options={{
						context: '2d',
						canvasWidth: 900,
						canvasHeight: 900
					}}
					canvasRef={canvasRef}
				/>
			</div>
		</div>
	);
};

export default ThoroidalCirclesCmp;