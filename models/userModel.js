const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");

let schema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    date_created: {
        type: Date, default: Date.now
    },
    role: {
        type: String, default: "user"
    }
})
exports.UserModel = mongoose.model("users", schema)

exports.createToken = (user_id, _role) => {
    let token = jwt.sign({ _id: user_id, role: _role }, config.tokenPass, { expiresIn: "60mins" });
    return token;
}

exports.validateLogin = (_reqBody) => {
    let joiSchema = Joi.object({
        email: Joi.string().min(2).max(150).email().required(),
        password: Joi.string().min(2).max(20).required(),
    })
    return joiSchema.validate(_reqBody)
}

exports.validateUser = (_reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(150).required(),
        email: Joi.string().min(2).max(150).email().required(),
        password: Joi.string().min(2).max(20).required(),
    })
    return joiSchema.validate(_reqBody)
}