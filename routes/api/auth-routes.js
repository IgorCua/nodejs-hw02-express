const express = require('express');

const router = express.Router();
const { register, login } = require('../../controllers/auth-controller');
const { validateBody } = require('../../utils');
const { userRegisterSchema } = require('../../schemas');

router.post('/users/signup', validateBody(userRegisterSchema), register);

router.post('/users/login', validateBody(userRegisterSchema), login);

module.exports = router;