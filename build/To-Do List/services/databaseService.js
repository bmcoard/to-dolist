"use strict";
function startDatabase() {
    const mongoose = require("mongoose");
    mongoose.connect("mongodb://localhost:27017/to_do_temp");
    const database = mongoose.connection;
    database.on("error", () => console.error("An error occured connecting to MongoDB")); //can fire multiple times
    database.once("open", () => {
        console.log("Connected to MongoDB");
    });
}
module.exports = startDatabase;
