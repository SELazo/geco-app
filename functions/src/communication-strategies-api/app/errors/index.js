const BadRequestError = require('./badRequestError');
const NotFoundError = require('./notFoundError');
const InternalServerError = require('./internalServerError');
const UnauthorizedError = require('./unauthorizedError');

module.exports = {
    BadRequestError,
    NotFoundError,
    InternalServerError,
    UnauthorizedError
}