/* global process */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User, Session } = require('../repository/models');
const { NotFoundError, UnauthorizedError, ConflictError } = require('../errors');
const { validateRequiredParams } = require('../utils');
const { findActiveSession } = require('../services');

const login = async (_req, res, next) => {
	const { email, password } = _req.body;

	try {
		validateRequiredParams({ email, password });
	} catch (e) {
		return next(e);
	}

	const data = await User.findOne({ where: { user_email: email } });

	if (!data) {
		return next(new NotFoundError(`User with email ${email} not found.`));
	}

	const user = data.get({ plain: true });

	if (!user) {
		return next(new NotFoundError(`User with email ${email} not found.`));
	}

	if (!bcrypt.compareSync(password, user.user_password)) {
		return next(new UnauthorizedError('Invalid credentials.'));
	}

	const { user_id } = user;

	const sessionDTO = await findActiveSession(user_id);

	if (sessionDTO) {
		const { session_id, session_start } = sessionDTO;
		const currentDate = new Date();
		const sessionDuration = currentDate.getTime() - session_start.getTime();
		const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;

		if (sessionDuration > oneWeekInMilliseconds) {
			await Session.update({ session_end: currentDate }, { where: { session_id } });
		} else {
			return next(new ConflictError('Session already active.'));
		}
	}

	const { user_name, user_email } = user;

	const token = jwt.sign({ user: { id: user_id, name: user_name, email: user_email } }, process.env.SECRET_KEY, { expiresIn: '7d' });

	await Session.create({
		session_start: new Date(),
		session_end: null,
		users_user_id: user_id,
	});

	return res.status(200).json({ token: `Bearer ${token}` });
};

module.exports = login;