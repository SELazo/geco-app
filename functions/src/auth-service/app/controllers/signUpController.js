const bcrypt = require('bcrypt');
const { User, Account } = require('../repository/models');
const { InternalServerError } = require('../errors');
const { validateRequiredParams, basicSuccessResponse } = require('../utils');

const signUp = async (_req, res, next) => {
	const { name, email, password } = _req.body;

	try {
		validateRequiredParams({ name, email, password });
	} catch (e) {
		return next(e);
	}

	const hashedPassword = bcrypt.hashSync(password, 10);

	try {
		const user = await User.create({
			user_name: name,
			user_email: email,
			user_password: hashedPassword,
			user_created_date: new Date()
		});

		await Account.create({
			account_type: 'free',
			account_price: 0,
			users_user_id: user.user_id,
			premium_premium_id: null,
		});
      
		return res.json(basicSuccessResponse('Sign up successful!'));
	} catch (err) {
		return next(new InternalServerError(`Error at sign up. Please try again later. Error:${err}`));
	}
};

module.exports = signUp;