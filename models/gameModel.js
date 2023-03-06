const mongoose = require("mongoose");
const Joi = require("joi");

let schema = new mongoose.Schema({
    name: String,
    description: String,
    category: String,
    price: Number,
    img_url: String,
    date_created: {
        type: Date, default: Date.now
    },
    user_id: String,
})
exports.GameModel = mongoose.model("games", schema)

exports.validateGame = (_reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(150).required(),
        description: Joi.string().min(2).max(400).required(),
        category: Joi.string().min(2).max(150).required(),
        price: Joi.number().min(1).max(1000).required(),
        img_url: Joi.string().min(2).max(400).allow(null, ""),
    })
    return joiSchema.validate(_reqBody)
}