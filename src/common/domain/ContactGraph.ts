import Circle from "./Circle";
import DeltaXY from "./DeltaXY";

export interface Edge {
	id: string;
	c0: Circle;
	c1: Circle;
	deltaXY: DeltaXY;
	distance: number;
	isExt?: boolean;
	slope?: number;
}

export interface GradientMap {
	[circleId: string]: DeltaXY;
}

export interface ContactGraph {
	edges: Edge[];
	circles: Circle[];
}
