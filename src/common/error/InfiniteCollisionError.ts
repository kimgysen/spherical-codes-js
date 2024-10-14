class InfiniteCollisionError extends Error {
	constructor(message: string) {
		super(message);

		Object.setPrototypeOf(this, InfiniteCollisionError.prototype);
	}}

export default InfiniteCollisionError;
