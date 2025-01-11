function startDatabase(){
    const mongoose = require("mongoose")
    mongoose.connect("mongodb://localhost:27017/to_do_temp")
    
    const database = mongoose.connection
    database.on("error", () => console.error("An error occured connecting to MongoDB")) //can fire multiple times
    database.once("open", () => {                                                  //only fires once. can only connect to database a single time
        console.log("Connected to MongoDB")
    })
}

module.exports = startDatabase