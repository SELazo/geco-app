class InternalServerError extends Error {
    constructor( message ) {
        super( message);

        if (Error.captureStackTrace) {
            Error.captureStackTrace( this, InternalServerError);
        }

        this.name = 'InternalServerError';
        this.code = 500;
    }
}

module.exports = InternalServerError;