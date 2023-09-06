import Circle from "./Circle";
import DeltaXY from "./DeltaXY";

export default interface Collision {
	c0: Circle;
	c1: Circle;
	deltaXY: DeltaXY
}
