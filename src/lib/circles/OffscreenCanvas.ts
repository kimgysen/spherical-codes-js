import {generateRandomPoints, Point} from "./index";
import Circle from "../../domain/Circle";
import {fullCollision, grow, minDistance} from "./Resolve";

const MAX_ATTEMPTS = 5000;
const SECTION_SIDE = 100;

let radius = 5
let dr = 0.5


class OffscreenCanvas {

	private _points: Point[] = [];
	private _circles: Circle[];
	private _circlesCache: object = {};

	private _minRadius: number;
	private _maxRadius: number;
	private _tryRadius: number;

	constructor(nrPoints: number) {
		this._setup(nrPoints);
	}

	private _setup(nrPoints: number) {
		this._minRadius = 1;
		// this._minRadius = +(OffscreenCanvas._determineMinRadius(nrPoints)).toPrecision(12);
		this._maxRadius = +(OffscreenCanvas._determineMaxRadius(nrPoints));
		// this._tryRadius = +(this._minRadius + ((this._maxRadius - this._minRadius) / 2)).toPrecision(10);
		this._tryRadius = 25.88190451;
		this._points = generateRandomPoints(nrPoints); // Between 0 and 1;
		// this._initCircles(this._tryRadius, this._points);

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

	private static _determineMinRadius(circles: Circle[], maxRadius: number) {
		// console.log('circles', circles);
		return minDistance(circles);
	}

	private static _determineMaxRadius(nrPoints: number) {
		// Hexagonal density n*Pi*r^2=Pi*sqrt(3)/6
		return SECTION_SIDE * Math.sqrt(Math.sqrt(3) / (6 * nrPoints));
	}

	private _getCircleById(id: string) {
		return this._circlesCache[id];
	}

	public resolveGenerator(pRadius: number): any {
		const circles = this.getCircles();

		function* generator() {
			const [nColls, collisionStr] = fullCollision(circles, radius, '');
			if (nColls >= 40) {
				// radius = minDistance(circles) - dr;
				radius = minDistance(circles);
				console.log('radius', radius);
				dr = dr * 0.05;
			}
			radius = grow(radius, dr, circles);
			circles.map(c => c.radius = radius);
			// circles.forEach(c => console.log('x: ' + c.x + ', y: ' + c.y));

			yield {status: 'done', circles};

		}

		return generator();

	}

	public findOptimalRadius(fnResolveCollisions: any, fnDrawCircles: any) {
		this._initCircles(1);

		const minRadius = 5;

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

			// } while (cnt < 1);
			} while (dr > 1e-14);
			// } while (cnt <= 10000);
			// } while (true);

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
