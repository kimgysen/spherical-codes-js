import {FC, useRef} from "react";
import circlesJSON from "./CirclesToVerifyJSON";
import {getCollisions, getDistance, minDistance} from "../../../../common/lib/circles/CollisionLib";
import CanvasCmp from "../../canvas/CanvasCmp";
import Circle from "../../../../common/domain/Circle";
import {drawCircle, drawContactGraph} from "../../../draw/draw";
import {scaleCircles} from "../thoroidal_circles/ThoroidalSpaceHelper";
import {buildContactGraph} from "../../../../common/lib/geometrical_complexity/ComplexityIndexLib";


const VerifyCirclesCmp: FC = () => {

	const canvasRef = useRef(null);

	const drawCircles = (ctx: any, circles: Circle[], radius: number) => {
		ctx.clearRect(0, 0, 900, 900);
		circles.map((circle: Circle) => drawCircle(ctx, circle, radius));
	}


	const getCtx = () => {
		const canvas = canvasRef.current;
		return canvas.getContext('2d');
	}

	const handleClick = () => {
		const radius = 0.06548051468676;
		const circles = circlesJSON.map(c => ({...c, radius }));

		drawCircles(getCtx(), scaleCircles(circles, 900), radius * 900);

		const contactGraph = buildContactGraph(circles, radius, 1e-16);
		console.log(contactGraph.edges);
		drawContactGraph(getCtx(), contactGraph, 900);


	}

	return (
		<>
			<button onClick={handleClick}>Verify circles</button>
			<CanvasCmp
				options={{
					context: '2d',
					canvasWidth: 900,
					canvasHeight: 900
				}}
				canvasRef={canvasRef}
			/>
		</>
	)
}

export default VerifyCirclesCmp;
