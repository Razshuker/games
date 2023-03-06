const mongoose = require('mongoose');
require("../config/secret");
main().catch(err => console.log(err));

async function main() {
    mongoose.set('strictQuery', false);
    await mongoose.connect(process.env.URLDB);
    console.log("mongo connect");
}