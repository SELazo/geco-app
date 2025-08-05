const loginController = require('./loginController');
const logoutController = require('./logoutController');
const signUpController = require('./signUpController');
const validateSessionController = require('./validateSessionController');
const { resetPasswordRequestController, resetPasswordController } = require('./resetPasswordController');
const editUserController = require('./editUserController');

const login = async (req, res, next) => {
	return loginController(req, res, next);
};

const logout = async (req, res, next) => {
	return logoutController(req, res, next);
};

const signUp = async (_req, res, next) => {
	return signUpController(_req, res, next);
};

const validateSession = (_req, res, next) => {
	return validateSessionController(_req, res, next);
};

const resetPasswordRequest = async (req, res) => {
	return resetPasswordRequestController(req, res);
};

const resetPassword = async (req, res, next) => {
	return resetPasswordController(req, res, next);
};

const editUser = async (req, res, next) => {
	return editUserController(req, res, next);
};

module.exports = {
	login,
	logout,
	signUp,
	validateSession,
	resetPasswordRequest,
	resetPassword,
	editUser
};