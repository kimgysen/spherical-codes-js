import Point from "./Point";
import DeltaXY from "./DeltaXY";

export default interface Circle extends Point {
	id: number;
	x: number;
	y: number;
	isExt?: boolean;
	gradient?: DeltaXY,
	color?: string;
}
