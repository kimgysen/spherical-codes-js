import {Point} from "../../lib/circles/PointsFactory";
import Circle from "../../domain/Circle";
import {growRadius, hasInfiniteCollision, minDistance} from "../../lib/circles/CollisionUtil";
import InputConfig from "../../domain/InputConfig";
import TimeoutError from "../../server/lib/error/TimeoutError";

const DEFAULT_MAX_RADIUS = 999999;


class ThoroidalSpaceBrowser {

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
				x: p.x,
				y: p.y
			};
		});

	}

	public findMaxRadius(fnGrowRadius: any) {
		const {initRadius, maxPrecision} = this._cfg;

		let circles = this._circles;

		async function* generator(_this) {
			_this._radius = initRadius;
			circles.map(c => c.radius = _this._radius);

			do {
				await fnGrowRadius(_this._radius);

			} while (_this._dr > maxPrecision);

			if (hasInfiniteCollision(circles, _this._radius, maxPrecision)) {
				throw new TimeoutError("Has infinite collision.");
			}

			yield {status: 'done', data: {radius: _this._radius, circles}};
			return;
		}

		return generator(this);

	}

	public growRadiusGenerator(): any {
		const {maxCollisions, speedFactor} = this._cfg;
		const circles = this._circles;
		let radius = this._radius;
		let dr = this._dr;

		function* generator(_this) {
			let [newRadius, collisions] = growRadius(circles, radius, dr);

			if (collisions.length >= maxCollisions) {
				newRadius = minDistance(collisions, DEFAULT_MAX_RADIUS);

				_this._dr *= speedFactor;
			}

			_this._radius = newRadius;
			_this._circles.map(c => c.radius = newRadius);

			yield {status: 'done', data: {circles}};

		}

		return generator(this);

	}

}

export default ThoroidalSpaceBrowser;
