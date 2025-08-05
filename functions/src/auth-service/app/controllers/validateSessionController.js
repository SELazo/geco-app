/* global process */
const jwt = require('jsonwebtoken');
const { headersUtils } = require('../utils');

const validateSession = (_req, res) => {
	const token = headersUtils.getHeaderToken(_req.headers);
	try {
		const decodedToken = jwt.verify(token, process.env.SECRET_KEY);

		res.status(200).json({ success: true, user: decodedToken.user });
	} catch (error) {
		res.status(401).json({ success: false, message: 'Invalid session.' });
	}
};

module.exports = validateSession;