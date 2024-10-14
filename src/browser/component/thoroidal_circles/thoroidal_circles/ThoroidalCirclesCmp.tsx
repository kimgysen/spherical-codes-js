import {FC, useEffect, useRef, useState} from "react";
import {generateRandomPoints} from "../../../../common/lib/factory/PointsFactory";
import CanvasCmp from "../../canvas/CanvasCmp";
import './ThoroidalCirclesCmp.css';
import {useLocalStorage} from "../../../hooks/LocalStorage";
import {findMaxRadius, MaxRadiusOpts, MaxRadiusResult} from "../../../../common/lib/MaxRadiusLib";
import {drawAllCircles, initCanvas, scaleCircles} from "./ThoroidalSpaceHelper";
import Circle from "../../../../common/domain/Circle";
import {DefaultBrowserInputCfg, DefaultBrowserOpts} from "../../../../../config/config";
import InputConfigCmp from "../config/InputConfigCmp";
import {clearCanvas, drawCircles, drawContactGraph} from "../../../draw/draw";
import {BrowserCfg} from "../../../../common/domain/BaseCfg";
import '../../../style/button.css';
import OptionsConfigCmp from "../config/OptionsConfigCmp";
import TimeoutError from "../../../../common/error/TimeoutError";
import ThreeColumnLayout from "../../layout/ThreeColumnLayout";
import ThoroidalResultCmp from "../result/ThoroidalResultCmp";
import Point from "../../../../common/domain/Point";
import {cloneArray} from "../../../../common/lib/util/CloneUtil";
import {buildContactGraph} from "../../../../common/lib/contact_graph/ContactGraphLib";
import {gradientDescent} from "../../../../common/lib/contact_graph/GradientDescentLib";


const SCALE_PX = 250;
const SCALE_FACTOR = 2.5;
const KEY_INPUT_CFG = 'input-cfg';
const KEY_OPTS_CFG = 'opts-cfg'

const ThoroidalCirclesCmp: FC = () => {

	const [isRunning, setRunning] = useState(false);
	const [cfg, setCfg] = useLocalStorage(KEY_INPUT_CFG, DefaultBrowserInputCfg) as [BrowserCfg, Function];
	const [opts, setOpts] = useLocalStorage(KEY_OPTS_CFG, DefaultBrowserOpts) as [MaxRadiusOpts, Function];
	const [points, setPoints] = useState<Point[]>([]);
	const [result, setResult] = useState<MaxRadiusResult>(null);

	const canvasRef = useRef(null);

	const getCtx = () => {
		const canvas = canvasRef.current;

		return canvas.getContext('2d');
	}

	useEffect(() => {
		initCanvas(getCtx(), SCALE_FACTOR, SCALE_PX);

	}, []);

	useEffect(() => {
		(async () => {
			if (isRunning) {
				clearCanvas(getCtx(), SCALE_PX);

				await execFindMaxRadius();
			}

		})();
	}, [isRunning]);

	useEffect(() => {
		if (result) {
			const {maxRadius, circles, foundInMs} = result;

			console.log('Final radius by removeCollisions', maxRadius);
			console.log('Found in: ' + foundInMs + ' ms');

			const visualCg = buildContactGraph(circles, 3);
			drawAllCircles(getCtx(), maxRadius, circles, SCALE_PX);
			drawContactGraph(getCtx(), visualCg, SCALE_PX);

			// drawContactGraph(getCtx(), contactGraph, SCALE_PX);
			const gradientCg = buildContactGraph(circles, 4, true);
			console.log(gradientCg);
			try {
				gradientDescent(gradientCg, 15000);

			} catch (e) {
				if (e instanceof TimeoutError) {
					console.log('timeout');

				} else {
					console.log(e);
				}
			}

			// runEl();

			// try {
			// 	const newCircles = gradientDescent(contactGraph, opts.timeoutMs);
			// 	const c0 = newCircles[0];
			// 	const c1 = newCircles[1];
			// 	const distance = getShortestThoroidalDistance(c0, c1);
			// 	console.log('After gradient descent', distance / 2);
			//
			// } catch(e) {
			// 	console.log(e.message);
			// }
			//
			// const newCg = buildContactGraph(newCircles, 3);

			// drawContactGraph(getCtx(), newCg, SCALE_PX);

			setRunning(false);


		}
	}, [result]);

	const execFindMaxRadius = async () => {
		const points = generateRandomPoints(cfg.nrPoints, cfg.maxPrecision) as Circle[];
		setPoints(cloneArray(points));

		console.log('Trying to find max radius in thoroidal space for ' + points.length + ' points...');

		try {
			const result = await findMaxRadius({
				circles: points,
				cfg,
				opts: {...opts, useCallback: opts.useCallback, callbackFn: renderStep}
			});

			setResult(result);

		} catch (e) {
			setResult(null);

			if (e instanceof TimeoutError) {
				console.log('Timeout has been reached!');
				setRunning(false);

			}
		}
	}

	function renderStep(radius: number, circles: Circle[]) {
		console.log('radius', radius);
		drawCircles(getCtx(), scaleCircles(circles, SCALE_PX), radius * SCALE_PX, SCALE_PX);
	}

	const handleClick = async () => {
		setRunning(true);
	}


	return (
		<ThreeColumnLayout
			leftCmp={
				<>
					<InputConfigCmp
						inputConfig={cfg as BrowserCfg}
						setInputConfig={(cfg) => setCfg(cfg)}
					/>
					<OptionsConfigCmp
						opts={opts}
						setOpts={(opts) => setOpts(opts)}
					/>
					<div className='form-button'>
						<button
							disabled={isRunning}
							className='button'
							onClick={handleClick}>
							{
								isRunning
									? <span>Running...</span>
									: <span>Find max radius</span>
							}
						</button>
					</div>
				</>
			}
			centerCmp={
				<CanvasCmp
					options={{
						context: '2d',
						canvasWidth: SCALE_PX * SCALE_FACTOR,
						canvasHeight: SCALE_PX * SCALE_FACTOR
					}}
					canvasRef={canvasRef}
				/>
			}
			rightCmp={
				<>
					{
						result && (
							<ThoroidalResultCmp
								pointsBefore={points}
								result={result}
								scalePx={SCALE_PX}
							/>
						)
					}
				</>
			}
		/>
	)
};

export default ThoroidalCirclesCmp;