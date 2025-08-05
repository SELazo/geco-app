class UnauthorizedError extends Error {
    constructor( message ) {
        super( message);

        if (Error.captureStackTrace) {
            Error.captureStackTrace( this, UnauthorizedError);
        }

        this.name = 'UnauthorizedError';
        this.code = 401;
    }
}

module.exports = UnauthorizedError;