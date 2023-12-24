const express = require('express');
const middleware = require('./user_middleware.js');
const controller = require('./users_controllers.js');
const cookieParser = require('cookie-parser');
const authMiddleware = require('../middleware/middleware.js');

const router = express.Router();

router.use(cookieParser());

// signup
router.post('/signup', middleware.ValidateUserCreation, controller.CreateUser);

// login
router.post('/login', middleware.ValidateUserLogin, controller.LoginUser);

// logout
router.post('/logout', controller.LogoutUser);

//reset password request
router.post('/reset-password-request', controller.ResetPasswordRequest);

router.use(authMiddleware.authenticateUser);
//delete user
router.delete('/delete', controller.DeleteUser);


module.exports = router;




