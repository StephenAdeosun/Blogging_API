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

//activate user
router.post('/activate', controller.ActivateUser);

//reset password request
router.post('/reset-password-request', controller.ResetPasswordRequest);


//reset password
router.post('/reset-password', controller.ResetPassword);

router.use(authMiddleware.authenticateUser);
// logout
router.post('/logout', controller.LogoutUser);
//delete user
router.delete('/delete', controller.DeleteUser);


module.exports = router;




