const express = require("express");
const { validateGame, GameModel } = require("../models/gameModel");
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.get("/", async (req, res) => {
    let perPage = req.query.perPage || 10;
    let page = req.query.page - 1 || 0;
    let sortBy = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;
    try {
        let data = await GameModel.find({})
            .limit(perPage)
            .skip(perPage * page)
            .sort({ [sortBy]: reverse })
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.get("/single/:id", async (req, res) => {
    let id = req.params.id;
    try {
        let data = await GameModel.find({ _id: id });
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.get("/search", async (req, res) => {
    let s = new RegExp(req.query.s, "i");
    let perPage = req.query.perPage || 10;
    let page = req.query.page - 1 || 0;
    let sortBy = req.query.sort || "_id";
    let reverse = req.query.reverse == "yes" ? -1 : 1;
    try {
        let data = await GameModel.find({ $or: [{ name: s }, { description: s }] })
            .limit(perPage)
            .skip(perPage * page)
            .sort({ [sortBy]: reverse })
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.get("/prices", async (req, res) => {
    let min = req.query.min || 0;
    let max = req.query.max || Infinity;
    let perPage = req.query.perPage || 10;
    let page = req.query.page - 1 || 0;
    let reverse = req.query.reverse == "yes" ? -1 : 1;
    try {
        let data = await GameModel.find({ $and: [{ price: { $lte: max } }, { price: { $gte: min } }] })
            .limit(perPage)
            .skip(perPage * page)
            .sort({ price: reverse })
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.get("/category/:catName", async (req, res) => {
    let cat = req.params.catName.toLowerCase();
    let perPage = req.query.perPage || 10;
    let page = req.query.page - 1 || 0;
    try {
        let data = await GameModel.find({ category: cat })
            .limit(perPage)
            .skip(perPage * page)
        res.status(200).json(data);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.post("/", auth, async (req, res) => {
    let validBody = validateGame(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let game = new GameModel(req.body);
        game.user_id = req.decodeToken._id;
        await game.save();
        res.status(200).json(game);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.put("/:id", auth, async (req, res) => {
    let validBody = validateGame(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let game;
        if (req.decodeToken.role == "admin") {
            game = await GameModel.updateOne({ _id: req.params.id }, req.body);
        } else {
            game = await GameModel.updateOne({ _id: req.params.id, user_id: req.decodeToken._id }, req.body);
        }
        res.status(200).json(game);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.delete("/:id", auth, async (req, res) => {
    try {
        let game;
        if (req.decodeToken.role == "admin") {
            game = await GameModel.deleteOne({ _id: req.params.id });
        }
        else {
            game = await GameModel.deleteOne({ _id: req.params.id, user_id: req.decodeToken._id });
        }
        res.status(200).json(game);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

module.exports = router;