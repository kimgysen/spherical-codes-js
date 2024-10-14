import {FC, useEffect, useRef} from "react";
import Circle from "../../../../common/domain/Circle";
import CanvasCmp from "../../canvas/CanvasCmp";
import {drawAllCircles, initCanvas} from "../thoroidal_circles/ThoroidalSpaceHelper";
import {minDistanceCircles} from "../../../../common/lib/CollisionLib";
import {buildContactGraph} from "../../../../common/lib/contact_graph/ContactGraphLib";
import {drawContactGraph} from "../../../draw/draw";
import circlesToVerifyJSON from "./CirclesToVerifyJSON";
import {gradientDescent} from "../../../../common/lib/contact_graph/GradientDescentLib";
import {runEl} from "../../../../common/lib/gradient_descent/Elatiques";


const SCALE_PX = 250;
const SCALE_FACTOR = 2.5;

const UploadJsonCmp: FC = () => {

	const canvasRef = useRef(null);

	const getCtx = () => {
		const canvas = canvasRef.current;

		return canvas.getContext('2d');
	}

	useEffect(() => {
		initCanvas(getCtx(), SCALE_FACTOR, SCALE_PX);

		renderJSON();
	}, []);

	const renderJSON = () => {
		const circles = circlesToVerifyJSON;
		const minRadius = minDistanceCircles(circles) / 2;
		const visualCg = buildContactGraph(circles, 3);
		drawAllCircles(getCtx(), minRadius, circles, SCALE_PX);
		drawContactGraph(getCtx(), visualCg, SCALE_PX);

		runEl();
		const gradientCg = buildContactGraph(circles, 3, true);
		try {
			gradientDescent(gradientCg, 6000);
		} catch(e) {
			console.log('timeout');
		}
		// console.log(gradientCg);
	}

	const readJsonFile = (file: Blob) => {
		return new Promise((resolve, reject) => {
			const fileReader = new FileReader()

			fileReader.onload = event => {
				if (event.target) {
					resolve(JSON.parse(event.target.result as string))
				}
			}

			fileReader.onerror = error => reject(error)
			fileReader.readAsText(file)
		});
	}

	const onChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			const circles = await readJsonFile(event.target.files[0]) as Circle[];
			// console.log(circles);
			const minRadius = minDistanceCircles(circles) / 2;
			// console.log('minRadius', minRadius);
			const contactGraph = buildContactGraph(circles, 4);
			console.log(contactGraph);
			drawAllCircles(getCtx(), minRadius, circles, SCALE_PX);
			drawContactGraph(getCtx(), contactGraph, 1);
			// try {
			// 	const gr = gradientDescent(contactGraph, 2000);
			// 	console.log('shortest', getShortestThoroidalDistance(gr[0], gr[1]) / 2);
			//
			// } catch(e) {
			// 	console.log('timed out');
			// }

		}
	}

	return (
		<>
			<input type="file" accept=".json,application/json" onChange={onChange}/>
			<CanvasCmp
				options={{
					context: '2d',
					canvasWidth: SCALE_PX * SCALE_FACTOR,
					canvasHeight: SCALE_PX * SCALE_FACTOR
				}}
				canvasRef={canvasRef}
			/>
		</>
	)
}

export default UploadJsonCmp;
