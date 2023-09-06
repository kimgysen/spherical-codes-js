import {Point} from "../../common/lib/circles/PointsFactory";
import Circle from "../../common/domain/Circle";
import {growRadius, hasInfiniteCollision, minDistance, removeCollisions} from "../../common/lib/circles/CollisionLib";
import InputConfig from "../../common/domain/InputConfig";


class ThoroidalSpaceBrowser {

	private _cfg: InputConfig;
	private _points: Point[];
	private _circles: Circle[];
	private _dr: number;
	private _radius: number;

	constructor(points: Point[], cfg: InputConfig) {
		this._points = points;
		this._cfg = {...cfg, maxPrecision: Math.pow(0.1, cfg.maxPrecision)};

		this._radius = cfg.initRadius;
		this._dr = 0.10;

		this._initCircles(cfg.initRadius);
	}

	public _initCircles(radius: number) {
		this._circles = this._points.map(
			(point: Point, idx: number) => ({ id: 'c' + idx, ...point }));

	}

	public findMaxRadius(fnGrowRadius: () => Promise<any>) {
		const {initRadius, maxPrecision} = this._cfg;

		let circles = this._circles;

		async function* generator(_this) {
			_this._radius = initRadius;

			do {
				await fnGrowRadius();

			} while (_this._dr > maxPrecision);

			if (hasInfiniteCollision(circles, _this._radius, maxPrecision)) {
				yield {status: 'failed', msg: 'Infinite collision'};
				return;
			}

			yield {status: 'done', data: {radius: _this._radius, circles}};
			return;
		}

		return generator(this);

	}
	// async *growRadiusGenerator() {
	// 	const {maxCollisions, speedFactor} = this._cfg;
	//
	// 	let {grownRadius, collisions} = growRadius(this._circles, this._radius, this._dr);
	//
	// 	removeCollisions(collisions, grownRadius);
	//
	// 	if (collisions.length >= maxCollisions) {
	// 		this._radius = minDistance(collisions) / 2;
	// 		this._dr *= speedFactor;
	//
	// 	}
	//
	// 	// _this._radius = grownRadius;
	//
	// 	yield {status: 'done', data: {grownRadius, circles: this._circles}};
	//
	// }

	public growRadiusGenerator(): any {
		const {maxCollisions, speedFactor} = this._cfg;
		const circles = this._circles;
		let radius = this._radius;
		let dr = this._dr;

		function* generator(_this) {
			let {grownRadius, collisions} = growRadius(circles, radius, dr);

			removeCollisions(collisions, grownRadius);

			if (collisions.length >= maxCollisions) {
				grownRadius = minDistance(collisions) / 2;
				_this._dr *= speedFactor;

			}

			_this._radius = grownRadius;

			yield {status: 'done', data: {grownRadius, circles}};

		}

		return generator(this);

	}

}

export default ThoroidalSpaceBrowser;
