const express = require('express');

const router = express.Router();
const { register, login, getCurrent, logout } = require('../../controllers/auth-controller');
const { validateBody } = require('../../utils');
const { userRegisterSchema } = require('../../schemas');
const { authenticate } = require('../../middlewares');

router.post('/users/signup', validateBody(userRegisterSchema), register);

router.post('/users/login', validateBody(userRegisterSchema), login);

router.get('/users/current', authenticate, getCurrent);

router.post('/users/logout', authenticate, logout);

module.exports = router;