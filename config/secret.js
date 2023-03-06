require("dotenv").config();

exports.config = {
    mongoConnect: process.env.URLDB,
    tokenPass: process.env.TOKENPASS
}