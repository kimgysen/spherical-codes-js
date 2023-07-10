import {generateRandomPoints, Point} from "./index";
import Circle from "../../domain/Circle";
import {fullCollision, grow, minDistance} from "./Resolve";

const SECTION_SIDE = 100;
const SPEED_FACTOR = 0.9;

let radius = 0.2
let dr;

class OffscreenCanvas {

	private _points: Point[] = [];
	private _maxCollisions: number;
	private _circles: Circle[];
	private _circlesCache: object = {};

	constructor(nrPoints: number) {
		this._points = generateRandomPoints(nrPoints); // Between 0 and 1;
		this._maxCollisions = 3 * this._points.length;
		dr = this._points.length / (this._points.length * 2);
	}

	public _initCircles(radius: number) {
		this._circles = this._points.map((point: Point, idx: number) => {
			const p = this._points[idx];
			const c = {
				id: 'c' + idx,
				radius: radius,
				x: p.x * SECTION_SIDE,
				y: p.y * SECTION_SIDE
			};

			this._circlesCache[c.id] = c;

			return c;
		});
	}

	private static _determineMaxRadius(nrPoints: number) {
		// Hexagonal density n*Pi*r^2=Pi*sqrt(3)/6
		return SECTION_SIDE * Math.sqrt(Math.sqrt(3) / (6 * nrPoints));
	}

	private _getCircleById(id: string) {
		return this._circlesCache[id];
	}


	public resolveGenerator(): any {
		const circles = this.getCircles();
		const maxCollisions = this._maxCollisions;

		function* generator() {
			const [nColls, collisionStr] = fullCollision(circles, radius, '');
			// if (nColls >= maxCollisions) {
			// 	radius = minDistance(circles);
			// 	console.log('radius', radius);
			//
			// 	dr = dr * SPEED_FACTOR;
			// }
			radius = grow(radius, dr, circles);
			circles.map(c => c.radius = radius);
			// circles.forEach(c => console.log('x: ' + c.x + ', y: ' + c.y));

			yield {status: 'done', circles};

		}

		return generator();

	}

	public findOptimalRadius(fnResolveCollisions: any) {
		this._initCircles(1);

		const minRadius = 15;

		let circles = this._circles;
		// fnDrawCircles(circles);

		async function* generator() {
			let cnt = 0;
			radius = minRadius;
			circles.map(c => c.radius = radius);

			do {
				cnt++;

				await fnResolveCollisions(radius);
				// yield {status: 'done', found: true, radius: tryRadius};
				// return;

			// } while (dr > 1e-14);
			} while (cnt < 1);

			console.log('*** radius ***', radius)
			console.log('end circles', circles);
			yield {status: 'done', found: false, radius: radius};
			return;
		}

		return generator();

	}

	public getCircles(): Circle[] {
		return this._circles;
	}

}

export default OffscreenCanvas;
