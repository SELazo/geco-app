const bcrypt = require('bcrypt');
const { User } = require('../repository/models');
const { InternalServerError, NotFoundError, UnauthorizedError } = require('../errors');
const { validateRequiredParams, basicSuccessResponse } = require('../utils');

const editUser = async (_req, res, next) => {
    const { id } = _req.params;
	const { name, email, password } = _req.body;

	try {
		validateRequiredParams({ id ,name, email, password });
	} catch (e) {
		return next(e);
	}

	const data = await User.findByPk(id);

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

	try {
		await User.update({
			user_name: name,
			user_email: email,
		},{
            where: { user_id: id}
        });

		return res.json(basicSuccessResponse('User updated successful!'));
	} catch (err) {
		return next(new InternalServerError(`Error at update user data. Please try again later. Error:${err}`));
	}
};

module.exports = editUser;