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
    const userSubscription = user.subscription;
    // console.log(user.password);
    // console.log(subscription);

    if(!user) throw HttpError(401, 'Email or password is wrong');

    const passwordCompareResult = await bcrypt.compare(password, user.password);

    if(!passwordCompareResult) throw HttpError(401, 'Email or password is wrong');

    const payload = {
        id: user._id
    }

    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: '3h'});

    await User.findByIdAndUpdate(user._id, { token });

    res.json({
        token,
        user: {
            email: email,
            subscription: userSubscription
        }
    });
}

const getCurrent = (req, res, next) => {
    const { authorization = '' } = req.headers;
    const user = req.user

    res.json({
        user,
        Authorization: authorization
    })
}

const logout = async (req, res) => {
    const { _id: id } = req.user;
    await User.findByIdAndUpdate(id, { token: '' });

    res.json({
        message: 'No content'
    })
}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout)
}