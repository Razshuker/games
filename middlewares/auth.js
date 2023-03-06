const jwt = require("jsonwebtoken");
const { config } = require("../config/secret");

exports.auth = (req, res, next) => {
    let token = req.header("x-api-key");
    if (!token) {
        return res.status(401).json({ msg: "you must send token to this endpoint" });
    }
    try {
        let decodeToken = jwt.verify(token, config.tokenPass);
        req.decodeToken = decodeToken;
        next();
    }
    catch (err) {
        res.status(401).json({ msg: "token invalid or expired" })
    }
}