import Circle from "./Circle";

export interface Collision {
	size: number;
	hasCollision: boolean;
}

export interface Intersection {
	orig: Circle;
	target: Circle;
	collision: Collision;
}
