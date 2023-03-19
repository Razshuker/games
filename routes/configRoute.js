const path = require("path");
const indexR = require("./index");
const usersR = require("./users");
const gamesR = require("./games");

exports.routerInit = (app) => {
    app.use("/", indexR);
    app.use("/users", usersR);
    app.use("/games", gamesR);
    app.get('*', (req, res) => {
        res.status(404).sendFile(path.join(__dirname, "..", "public", "error.html"))
    });
}