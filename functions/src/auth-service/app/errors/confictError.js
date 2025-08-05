class ConflictError extends Error {
	constructor( message ) {
		super( message);

		if (Error.captureStackTrace) {
			Error.captureStackTrace( this, ConflictError);
		}

		this.name = 'ConflictError';
		this.code = 409;
	}
}

module.exports = ConflictError;