import InputConfig from "../../domain/InputConfig";
import {Point} from "../../lib/circles/PointsFactory";
import Circle from "../../domain/Circle";
import {growRadius, minDistance} from "../../lib/circles/CollisionUtil";

const DEFAULT_SECTION_SIDE = 100;
const DEFAULT_MAX_RADIUS = 999999;


class ThoroidalSpaceServer {

	private _cfg: InputConfig;
	private _points: Point[];
	private _circles: Circle[];
	private _dr: number;
	private _radius: number;


	constructor(points: Point[], cfg: InputConfig) {
		this._points = points; // Between 0 and 1;
		this._cfg = cfg;

		this._radius = cfg.initRadius;
		this._dr = this._points.length / (this._points.length * 2);

		this._initCircles(cfg.initRadius);

	}

	public _initCircles(radius: number) {
		this._circles = this._points.map((point: Point, idx: number) => {
			const p = this._points[idx];
			return {
				id: 'c' + idx,
				radius: radius,
				x: p.x * DEFAULT_SECTION_SIDE,
				y: p.y * DEFAULT_SECTION_SIDE
			};

		});
	}

	public findMaxRadius() {
		const {initRadius, maxPrecision} = this._cfg;

		let circles = this._circles;

		this._radius = initRadius;
		circles.map(c => c.radius = this._radius);

		do {
			this.growRadius();

		} while (this._dr > maxPrecision);

		return this._radius;
	}

	private growRadius() {
		const {maxCollisions, speedFactor} = this._cfg;

		let [newRadius, collisions] = growRadius(this._circles, this._radius, this._dr);

		if (collisions.length >= maxCollisions) {
			newRadius = minDistance(collisions, DEFAULT_MAX_RADIUS);

			this._dr *= speedFactor;
		}

		this._radius = newRadius;
		this._circles.map(c => c.radius = newRadius);

	}

}

export default ThoroidalSpaceServer;
