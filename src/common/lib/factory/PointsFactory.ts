import {trimToDecimals} from "../util/PrecisionUtil";
import Point from "../../domain/Point";

export const generateRandomPoints: (nrPoints: number, precision: number) => Point[] = (nrPoints, precision) => {
	const arr = [];
	for (let i = 0; i < nrPoints; i++) {
		arr.push({
			id: i,
			x: trimToDecimals(Math.random(), precision),
			y: trimToDecimals(Math.random(), precision)
		})
	}

	return arr;

}
