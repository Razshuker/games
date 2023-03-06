const express = require("express");
const { validateUser, UserModel, validateLogin, createToken } = require("../models/userModel");
const { auth } = require("../middlewares/auth");
const bcrypt = require("bcrypt");
const router = express.Router();

router.get("/", async (req, res) => {
    res.json({ msg: "users endpoint" });
})

router.get("/userInfo", auth, async (req, res) => {
    try {
        let id = req.decodeToken._id;
        let user = await UserModel.findOne({ _id: id }, { password: 0 });
        res.status(200).json(user);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.post("/", async (req, res) => {
    let validBody = validateUser(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let user = new UserModel(req.body);
        user.password = await bcrypt.hash(user.password, 10);
        await user.save();
        user.password = "******";
        res.status(200).json(user);
    }
    catch (err) {
        console.log(err);
        res.status(502).json({ err })
    }
})

router.post("/login", async (req, res) => {
    let validBody = validateLogin(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        let user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ msg: "email not exist" })
        }
        let samePassword = await bcrypt.compare(req.body.password, user.password);
        if (!samePassword) {
            return res.status(401).json({ msg: "email or password incorrect" });
        }
        let token = createToken(user._id, user.role);
        return res.status(200).json({ token });
    }
    catch (err) {
        if (err.code == 11000) {
            return res.status(400).json({ msg: "email already exist" });
        }
        console.log(err);
        res.status(502).json({ err })
    }
})

module.exports = router;