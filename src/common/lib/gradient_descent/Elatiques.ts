import {getDistance, getShortestThoroidalDistance} from "../CollisionLib";
import circlesToVerifyJSON from "../../../browser/component/thoroidal_circles/upload_json/CirclesToVerifyJSON";

// let X = [0.17024993392060958, 0.9974200225359959, 0.8206416539117327, 0.3944899890662633, 0.5456076805809001, 0.2303345752184569, 0.6656813420075751, 0.9518656388179193, 0.048210825030264186, 0.6056278483950897, 0.829796068961276, 0.5, 0.3343363507089661, 0.7242090548541613, 0.769719433777359, 0.17943518672220243, 0.4544896210768022, 0.2757909451458376, 0.0026675002886193512];
// let Y = [0.48811024011199555, 0.3332106292949325, 0.8489029592333905, 0.5481822065412556, 0.22761306593402064, 0.7123102988820605, 0.6760311756423443, 0.10558701410711321, 0.8944129858928838, 0.4518221207881816, 0.5118987559720993, 0.0, 0.32396882435765506, 0.060076635183915955, 0.2876897011179379, 0.15109739303031233, 0.7723869340659776, 0.939923364816082, 0.6667999199588626];

let X = circlesToVerifyJSON.map(c => c.x);
let Y = circlesToVerifyJSON.map(c => c.y);

const noise = 0.0001;

// X = X.map(x_ => x_ + noise * Math.random());
// Y = Y.map(y_ => y_ + noise * Math.random());

const graph = [
	[0, 1, -1, 0],
	[0, 3, 0, 0],
	[0, 5, 0, 0],
	[0, 12, 0, 0],
	[1, 7, 0, 0],
	[1, 14, 0, 0],
	[2, 6, 0, 0],
	[2, 8, 1, 0],
	[2, 13, 0, 1],
	[3, 5, 0, 0],
	[3, 9, 0, 0],
	[3, 12, 0, 0],
	[3, 16, 0, 0],
	[4, 9, 0, 0],
	[4, 11, 0, 0],
	[4, 12, 0, 0],
	[4, 14, 0, 0],
	[5, 16, 0, 0],
	[5, 17, 0, 0],
	[5, 18, 0, 0],
	[6, 9, 0, 0],
	[6, 10, 0, 0],
	[6, 16, 0, 0],
	[7, 8, 1, -1],
	[7, 13, 0, 0],
	[7, 15, 1, 0],
	[8, 17, 0, 0],
	[8, 18, 0, 0],
	[9, 10, 0, 0],
	[9, 14, 0, 0],
	[10, 14, 0, 0],
	[10, 18, 1, 0],
	[11, 13, 0, 0],
	[11, 16, 0, -1],
	[11, 17, 0, -1],
	[12, 15, 0, 0],
	[13, 14, 0, 0],
	[15, 17, 0, -1]];

const distance = (x2, x1, y2, y1) => {
	let dx = Math.abs(x2 - x1);
	let dy = Math.abs(y2 - y1);

	return Math.sqrt(dx ** 2 + dy ** 2)

}

const mean_distance = (x, y) => {
	let d_min = 0;
	for (let g of graph) {
		let d = distance(x[g[1]] + g[2], x[g[0]], y[g[1]] + g[3], y[g[0]]);
		d_min += d;
	}
	// console.log(d_min);
	return d_min / graph.length;

}

const variance = (x, y) => {
	let V = 0;
	let d_mean = mean_distance(x, y);
	// console.log('variance d_mean', d_mean);

	for (let g of graph) {
		let d = distance(x[g[1]] + g[2], x[g[0]], y[g[1]] + g[3], y[g[0]]);

		V += (d - d_mean) ** 2;
	}
	return V
}

const gradient = (x, y) => {
	let d_mean = mean_distance(x, y);
	// console.log('d_mean', d_mean);

	let dx = Array(19).fill(0);
	let dy = Array(19).fill(0);

	const speed = 4.5;
	let l;

	for (let g of graph) {
		l = speed * (1 - d_mean / distance(x[g[1]] + g[2], x[g[0]], y[g[1]] + g[3], y[g[0]]));
		// console.log('l', l);
		// console.log('distance', distance(x[g[1]] + g[2], x[g[0]], y[g[1]] + g[3], y[g[0]]));

		// console.log('dx', x[g[1]] + g[2] - x[g[0]]);
		let Dx = l * (x[g[1]] + g[2] - x[g[0]]);
		let Dy = l * (y[g[1]] + g[3] - y[g[0]]);

		dx[g[1]] += Dx;
		dy[g[1]] += Dy;
		dx[g[0]] -= Dx;
		dy[g[0]] -= Dy;
	}

	return [dx, dy]
}

const descent = (x, y) => {
	// console.log('descent');

	const speed = 0.001;
	let [dx, dy] = gradient(x, y);

	// console.log('descent dx', dx[0]);
	// console.log('descent dy', dy[0]);
	// console.log(x[0] - dx[0] * speed);
	// console.log('y before', y[0]);
	// console.log('y after', y[0] - dy[0] * speed);

	for (let i = 0; i < x.length; i++) {
		x[i] = x[i] - dx[i] * speed;
		y[i] = y[i] - dy[i] * speed;
	}

	// console.log(y);
	return [x, y];

}

export const runEl = () => {
	const init = new Date().getTime();

	let V = variance(X, Y);
	// console.log('V', V);
	let d1 = mean_distance(X, Y);
	// console.log('d1', d1);
	let d_old = 1;
	let vOld;

	let cnt = 0;
	while (V > 1e-25) {
		// console.log('cnt', cnt);

		let [newX, newY] = descent(X, Y);

		d_old = d1
		d1 = mean_distance(newX, newY);
		// console.log('d1', d1);
		V = variance(newX, newY);
		// console.log('v', V);
		// if (V > vOld) {
		// 	console.log('V increased', V);
		// 	break;
		// }
		vOld = V;

		// if (cnt === 0)
		// 	break;
		//
		cnt++;
	}

	// console.log('cnt', cnt);

	const c0 = {id: 0, x: X[0], y: Y[0]};
	const c1 = {id: 1, x: X[1], y: Y[1]};

	const distance = getShortestThoroidalDistance(c0, c1);
	// console.log('distance', d1);
	console.log('md', mean_distance(X, Y) / 2);
	console.log(`el gradient descent found in: ${new Date().getTime() - init} ms`)

}


