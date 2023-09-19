import {FC, useEffect, useRef} from "react";
import InputConfig from "../../../../common/domain/InputConfig";
import {generateRandomPoints} from "../../../../common/lib/factory/PointsFactory";
import CanvasCmp from "../../canvas/CanvasCmp";
import ThoroidalInputConfigCmp from "../input_config/ThoroidalInputConfigCmp";
import './ThoroidalCircles.css';
import {useLocalStorage} from "../../../hooks/LocalStorage";
import {findMaxRadius} from "../../../../common/lib/ThoroidalSpaceLib";
import {drawCircles} from "../../../draw/draw";
import {multiplyCircles, scaleCircles} from "./ThoroidalSpaceHelper";
import Circle from "../../../../common/domain/Circle";


const INTERVAL_MS = .00001;
const SCALE = 300;
const DEFAULT_NR_POINTS = 131;
const LOCAL_STORAGE_NR_POINTS = 'nr-points';
const LOCAL_STORAGE_INPUT_CFG = 'input-cfg';

const defaultInputCfg: InputConfig = {
	initRadius: 0.00001,
	initDr: 0.01,
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

		console.log('Trying to find max radius in thoroidal space for ' + points.length + ' points...');

		const callbackFn = (radius: number, circles: Circle[]) => {
			console.log('radius', radius);
			drawCircles(getCtx(), scaleCircles(circles, SCALE), radius * SCALE);
		}

		(async () => {
			const params = {circles: points as Circle[], cfg: {...inputCfg, initDr: 0.01} as InputConfig};
			const opts = {
				useTimeout: false,
				callbackFn,
				sleepMs: INTERVAL_MS
			};

			const {radius, circles, elapsedTime} = await findMaxRadius(params, opts);
			const scaledRadius = radius * SCALE;
			drawCircles(getCtx(), multiplyCircles(circles, SCALE), scaledRadius);

			// 				const contactGraph = buildContactGraph(scaleCircles(circles, 1/SCALE), scaledRadius, 1e-16);
			// 				drawContactGraph(getCtx(), contactGraph, SCALE);


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