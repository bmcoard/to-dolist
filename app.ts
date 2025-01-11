const startDatabase = require("./services/databaseService")
const listRouter = require("./api/lists")
const CORS = require("cors")


const express = require("express"); //returns function from node module "express"
import {Request, Response} from "express"
const app = express();
const path = require("path");

app.use("/api/lists", listRouter)
app.use(CORS()); //content origin resource sharing - gives permission to have domains access server

async function startApp() {
    await startDatabase()
    const PORT = process.env.PORT || 3003 //heroku
    
    app.listen(PORT, () => {
        console.log("server running on port 3003");
    });
}

startApp()

const staticDirectory = path.join(__dirname, "static");
app.use(express.static(staticDirectory));
// app.get("/admin", (request:Request, response:Response) => {
//     response.sendFile(path.join(staticDirectory, "/admin/admin.html"));
// });

app.get("*", (request:Request, response:Response) => {
    response.sendFile(path.join(staticDirectory, "index.html"));
});

