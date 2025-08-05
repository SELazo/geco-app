const BadRequestError = require('./badRequestError');
const NotFoundError = require('./notFoundError');
const InternalServerError = require('./internalServerError');
const UnauthorizedError = require('./unauthorizedError');
const ConflictError = require('./confictError');

module.exports = {
	BadRequestError,
	NotFoundError,
	InternalServerError,
	UnauthorizedError,
	ConflictError
};