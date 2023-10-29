const express = require('express');
const middleware = require('./user_middleware.js');
const controller = require('./users_controllers.js');

const router = express.Router();
// signup
router.post('/signup', middleware.ValidateUserCreation, controller.CreateUser);

// login
router.post('/login', middleware.ValidateUserLogin, controller.LoginUser);
module.exports = router;



