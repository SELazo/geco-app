const { UnauthorizedError } = require('../errors');
const { validateSessionRestClient, findActiveSession } = require('../services');
const { basicSuccessResponse ,headersUtils } = require('../utils');

const logout = async (_req, res, next) => {
	const token = headersUtils.getHeaderToken(_req.headers);

	try {
		if (!token) {
			throw new UnauthorizedError('Authorization token not provided.');
		}

		const sessionData = await validateSessionRestClient(token);
		const sessionDTO = await findActiveSession(sessionData.user.id);

		if (!sessionDTO) {
			throw new UnauthorizedError('No active session found.');
		}

		sessionDTO.session_end = new Date();
		await sessionDTO.save();

		res.status(200).json(basicSuccessResponse('Logout successful.'));
	} catch (error) {
		next(error);
	}
};

module.exports = logout;
