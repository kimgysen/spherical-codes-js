import Circle from "../../domain/Circle";

export const iterateUniqueCirclePairs = (circles: Circle[], fn: (c0: Circle, c1: Circle) => void) => {
	for (let i = 0; i < circles.length; i++) {
		for (let j = i + 1; j < circles.length; j++) {
			const [c0, c1] = [circles[i], circles[j]];
			if (c0.id !== c1.id) {
				fn(c0, c1);

			}
		}
	}
}
