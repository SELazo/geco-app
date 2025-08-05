const express = require('express');
const router = express.Router();
const { errorController, authController } = require('../controllers');
const { login, signUp, validateSession, resetPasswordRequest, resetPassword, logout, editUser } = authController;

router.get('/validate-session', validateSession);

router.post('/sign-up', signUp);

router.post('/login', login);

router.post('/logout', logout);

router.post('/reset-password-request', resetPasswordRequest);

router.post('/reset-password', resetPassword);

router.put('/users/:id', editUser);

router.use( errorController );

module.exports = router;