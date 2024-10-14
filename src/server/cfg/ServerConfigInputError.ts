class ServerConfigInputError extends Error {
	constructor(message: string) {
		super(message);

		Object.setPrototypeOf(this, ServerConfigInputError.prototype);
	}

}

export default ServerConfigInputError;
