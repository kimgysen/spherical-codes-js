
export interface Point{
	id: string;
	x: number;
	y: number;
}


export const generateRandomPoints: (nrPoints: number) => Point[] = (nrPoints) => {
	const arr = [];
	for (let i = 0; i < nrPoints; i++) {
		arr.push({
			id: 'c' + i,
			x: Math.random(),
			y: Math.random()
		})
	}

	return arr;

	// --- Test data ---
	// return [
	// 	// {id: 'c0', x: 0.1, y: 0.1},
	// 	// {id: 'c1', x: 0.9, y: 0.9},
	// 	// -- c0 left top, c1 right bottom
	// 	// {id: 'c0', x: 0.53830981, y: 0.64524001},
	// 	// {id: 'c1', x: 0.64231935, y: 0.73286408},
	// 	// -- c2 left top, c3 right bottom
	// 	// {id: 'c2', x: 0.64231935, y: 0.73286408},
	// 	// {id: 'c3', x: 0.53830981, y: 0.64524001},
	// 	// -- c4 left top, c5 left bottom
	// 	// {id: 'c4', x: 0.12, y: 0.1},
	// 	// {id: 'c5', x: 0.1, y: 0.9},
	// 	// -- c6 left top, c7 right bottom
	// 	// {id: 'c6', x: 0.1, y: 0.1},
	// 	// {id: 'c7', x: 0.9, y: 0.9},
	// 	// -- c8 right top, c9 left bottom
	// 	// {id: 'c8', x: 0.98, y: 0.10},
	// 	// {id: 'c9', x: 0.10, y: 0.98},
	// 	// -- c10 left top, c11 left bottom
	// 	// {id: 'c10', x: 0.11, y: 0.10},
	// 	// {id: 'c11', x: 0.10, y: 0.90},
	// 	// -- c12 right top, c13 right bottom
	// 	{id: 'c12', x: 0.90, y: 0.10},
	// 	{id: 'c13', x: 0.90, y: 0.91},
	// 	// -- c14 left top, c15 right top
	// 	// {id: 'c12', x: 0.11, y: 0.11},
	// 	// {id: 'c13', x: 0.10, y: 0.90},
	//
	// 	// {x: 0.33, y: 0.33},
	// 	// {x: 0.34, y: 0.37},
	// 	// {x: 0.40, y: 0.45},
	// 	// {x: 0.50, y: 0.37},
	// 	// {x: 0.70, y: 0.37},
	// 	// {x: 0.74, y: 0.37},
	// 	// {x: 0.80, y: 0.37},
	// ]
}
