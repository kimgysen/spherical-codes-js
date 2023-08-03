class TimeoutError {
	constructor(message: string) {
		return Error(message);
	}
}

export default TimeoutError;
