const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
require("./db/mongoConnect");

const { routerInit } = require("./routes/configRoute");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

routerInit(app);


const server = http.createServer(app);
let port = process.env.PORT || 3001;
server.listen(port);



