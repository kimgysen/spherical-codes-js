import {Point} from "../lib/factory/PointsFactory";

export default interface Circle extends Point {
	id: number;
	x: number;
	y: number;
	color?: string;
}
