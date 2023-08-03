import InputConfig from "../../domain/InputConfig";
import {Point} from "../../lib/circles/PointsFactory";
import Circle from "../../domain/Circle";
import TimeoutError from "./error/TimeoutError";
import {growRadius, hasInfiniteCollision, minDistance} from "../../lib/circles/CollisionUtil";
import InfiniteCollisionError from "./error/InfiniteCollisionError";

const DEFAULT_MAX_RADIUS = 999999;


class ThoroidalSpaceServer {

	private _cfg: InputConfig;
	private _points: Point[];
	private _circles: Circle[];
	private _dr: number;
	private _radius: number;


	constructor(points: Point[], cfg: InputConfig) {
		this._points = points;
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
				x: p.x,
				y: p.y
			};
		});
	}

	public findMaxRadius(timeoutMs: number) {
		const start = new Date().getTime();

		const {initRadius, maxPrecision} = this._cfg;

		this._radius = initRadius;
		this._circles.map(c => c.radius = this._radius);

		do {
			this._growRadius();

			const elapsed = new Date().getTime() - start;

			if (elapsed > timeoutMs) {
				throw new TimeoutError("Timeout has been reached.");
			}

		} while (this._dr > maxPrecision);

		if (hasInfiniteCollision(this._circles, this._radius, maxPrecision)) {
			throw new InfiniteCollisionError("InfiniteCollision.");

		}

		return this._radius;
	}

	private _growRadius() {
		const {maxCollisions, speedFactor} = this._cfg;

		let [newRadius, collisions] = growRadius(this._circles, this._radius, this._dr);

		if (collisions.length >= maxCollisions) {
			newRadius = minDistance(collisions, DEFAULT_MAX_RADIUS);

			this._dr *= speedFactor;
		}

		this._radius = newRadius;
		this._circles.map(c => c.radius = newRadius);

	}

	public getCirclesAfter(): Circle[] {
		return this._circles;
	}

}

export default ThoroidalSpaceServer;
