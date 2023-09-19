import {Point} from "../../common/lib/factory/PointsFactory";
import Circle from "../../common/domain/Circle";
import {growRadius, hasInfiniteCollision, minDistance, removeCollisions} from "../../common/lib/CollisionLib";
import InputConfig from "../../common/domain/InputConfig";
import {precisionAsDecimal} from "../../common/lib/util/PrecisionUtil";


class ThoroidalSpaceBrowser {

	private _dr: number;
	private _radius: number;
	private _maxCollisions: number;
	private _speedFactor: number;
	private _maxPrecision: number;

	private _circles: Circle[];

	constructor(points: Point[], cfg: InputConfig) {
		this._radius = cfg.initRadius;
		this._dr = cfg.initDr;
		this._maxCollisions = cfg.maxCollisions;
		this._speedFactor = cfg.speedFactor;
		this._maxPrecision = precisionAsDecimal(cfg.maxPrecision);

		this._circles = points;
	}

	public findMaxRadius(fnGrowRadius: () => Promise<any>) {

		async function* generator(_this) {

			do {
				await fnGrowRadius();

			} while (_this._dr > _this._maxPrecision);

			if (hasInfiniteCollision(_this._circles, _this._radius, _this._maxPrecision)) {
				yield {status: 'failed', msg: 'Infinite collision'};
				return;
			}

			yield {status: 'done', data: {radius: _this._radius, circles: _this._circles}};
			return;
		}

		return generator(this);

	}

	public optimizeGeometryGenerator(): any {
		const circles = this._circles;
		let radius = this._radius;
		let dr = this._dr;

		function* generator(_this) {
			let {grownRadius, collisions} = growRadius(circles, radius, dr);

			if (collisions.length >= _this._maxCollisions) {
				grownRadius = minDistance(collisions) / 2;
				_this._dr *= _this._speedFactor;

			} else {
				removeCollisions(collisions, grownRadius);
				_this._radius = grownRadius;

			}

			yield {status: 'done', data: {grownRadius, circles}};

		}

		return generator(this);

	}

}

export default ThoroidalSpaceBrowser;
