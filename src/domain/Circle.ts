import {Point} from "../lib/circles";

export default interface Circle {
	id: string;
	radius: number;
	x: number;
	y: number;
	color?: string;
}
