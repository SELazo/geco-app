/* global process */
/* global __dirname */
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const mustache = require('mustache');
const fs = require('fs');
const path = require('path');
const { User } = require('../repository/models');
const { NotFoundError, InternalServerError, BadRequestError } = require('../errors');
const { validateRequiredParams, basicSuccessResponse } = require('../utils');
const { cache } = require('../services');

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.GECO_EMAIL,
		pass: process.env.GECO_EMAIL_PASS
	}
});
  
const sendConfirmationEmail = (email, link, name) => {
	const templatePath = path.join(__dirname, '../utils/resetPassword/resetPasswordTemplate.html');
	const logoPath = path.join(__dirname, '..' , 'utils', 'resetPassword', 'logo_g.png');
	const html = fs.readFileSync(templatePath, 'utf8');
	const options = {name: name, resetLink: link, logo: logoPath};
	const compiledTemplate = mustache.render(html, options);

	const mailOptions = {
		from: process.env.GECO_EMAIL,
		to: email,
		subject: 'Confirmación de restablecimiento de contraseña',
		html: compiledTemplate,
	};

	transporter.sendMail(mailOptions, (error, info) => {
		console.log(info);
		if (error) {
			throw new InternalServerError('Error processing email');
		}        
	});
};

const resetPasswordRequestController = async (req, res, next) => {
	try {
		const { email } = req.body;

		try {
			validateRequiredParams({ email });
		} catch (e) {
			return next(e);
		}

		const data = await User.findOne({ where: { user_email: email } });

		const user = data.get({ plain: true });
    
		if (!user) {
			return next(new NotFoundError(`User with email ${email} not found.`));
		}
  
		const token = await bcrypt.hash(email + new Date().toISOString(), 10);

		cache.setInCache(token, email, 300);
    
		const link = `http://localhost:5173/recovery/reset-password?token=${token}`;
    
		sendConfirmationEmail(email, link, user.user_name);
    
		return res.status(200).json(basicSuccessResponse('Password reset email sent.'));
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'An error has occurred while processing request.' });
	}
};

const updateUserPassword = async (userId, newPassword) => {
	const updatedUser = await User.update(
		{ user_password: newPassword },
		{ where: { user_id: userId } }
	);
      
	if (updatedUser[0] === 0) {
		throw new NotFoundError(`User with ID ${userId} not found.`);
	}
};

const resetPasswordController = async (req, res, next) => {
	const token = req.headers['x-reset-password-token'];

	if (!token) {
		return next(new BadRequestError('Token not provided.'));
	}

	const email = cache.getFromCache(token);

	if (!email) {
		return next(new BadRequestError('Invalid Token.'));
	}

	const data = await User.findOne({ where: { user_email: email } });

	const user = data.get({ plain: true });

	if (!user) {
		return next(new NotFoundError(`User with email ${email} not found.`));
	}

	const newPassword = bcrypt.hashSync(req.body.new_password, 10);

	try {
		await updateUserPassword(user.user_id, newPassword);
	} catch (error) {
		return next(error);
	}

	return res.status(200).json(basicSuccessResponse('Password reseted successfully.'));
};

module.exports = {
	resetPasswordRequestController,
	resetPasswordController
};