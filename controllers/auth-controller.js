const { HttpError } = require("../helpers");
const { User } = require("../models/user");
const { ctrlWrapper } = require("../utils");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = process.env;

const register = async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if(user) throw HttpError(409, 'Email is already in use');

    const hashedPassword = await bcrypt.hash(password, 10);

    const userCreate = await User.create({email, password: hashedPassword});

    res.status(201).json({
        user: {
            email: userCreate.email,
            subscription: 'starter'
        }
    })
}
 
const login = async (req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email});

    if(!user) throw HttpError(401, 'Invalid credentials');

    const passwordCompareResult = await bcrypt.compare(password, user.password);

    if(!passwordCompareResult) throw HttpError(401, 'Invalid credentials');

    const payload = {
        id: user._id
    }

    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: '3h'})

    res.json({
        token
    });
}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login)
}