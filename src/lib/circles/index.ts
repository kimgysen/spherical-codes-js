
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

	// return [
		// {id: 'c0', x: 0.1, y: 0.1},
		// {id: 'c1', x: 0.9, y: 0.9},
		// {id: 'c0', x: 0.53830981, y: 0.64524001},
		// {id: 'c1', x: 0.54231935, y: 0.63286408},
		// {id: 'c2', x: 0.56559125, y: 0.2182693},
		// {id: 'c3', x: 0.07075482, y: 0.86305498},
		// {id: 'c4', x: 0.69878293, y: 0.72820026},
		// {id: 'c5', x: 0.92654907, y: 0.64043908},
		// {id: 'c6', x: 0.44526304, y: 0.36263806},
		// {id: 'c7', x: 0.51393784, y: 0.71524121},
		// {id: 'c8', x: 0.11636961, y: 0.58522953},
		// {id: 'c9', x: 0.42632096, y: 0.6554068},
	// 	// {x: 0.33, y: 0.33},
	// 	// {x: 0.34, y: 0.37},
	// 	// {x: 0.40, y: 0.45},
	// 	// {x: 0.50, y: 0.37},
	// 	// {x: 0.70, y: 0.37},
	// 	// {x: 0.74, y: 0.37},
	// 	// {x: 0.80, y: 0.37},
	// ]
	return arr;
}
