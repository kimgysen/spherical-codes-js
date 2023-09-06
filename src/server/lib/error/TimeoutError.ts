class TimeoutError extends Error {
	constructor(message: string) {
		super(message);

		Object.setPrototypeOf(this, TimeoutError.prototype);
	}
}

export default TimeoutError;
