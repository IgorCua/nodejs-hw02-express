const express = require('express');

const router = express.Router();
const { register, login } = require('../../controllers/auth-controller');

router.post('/users/signup', register);

router.post('/users/login', login);

module.exports = router;