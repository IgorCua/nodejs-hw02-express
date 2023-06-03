const { HttpError } = require("../helpers");
const { User } = require("../models/user")
const { ctrlWrapper } = require("../utils")

const register = async (req, res) => {
    const {email, name, password} = req.body;

    const user = await User.findOne({email});

    if(user) throw HttpError(409, 'Email is already in use');

    const userCreate = await User.create({email, name, password});

    res.status(201).json({
        name: userCreate.name,
        email: userCreate.email
    })
}

const login = async (req, res) => {

}

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login)
}