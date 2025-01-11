"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const startDatabase = require("./services/databaseService");
const listRouter = require("./api/lists");
const CORS = require("cors");
const express = require("express"); //returns function from node module "express"
const app = express();
const path = require("path");
app.use("/api/lists", listRouter);
app.use(CORS()); //content origin resource sharing - gives permission to have domains access server
function startApp() {
    return __awaiter(this, void 0, void 0, function* () {
        yield startDatabase();
        const PORT = process.env.PORT || 3003; //heroku
        app.listen(PORT, () => {
            console.log("server running on port 3003");
        });
    });
}
startApp();
const staticDirectory = path.join(__dirname, "static");
app.use(express.static(staticDirectory));
// app.get("/admin", (request:Request, response:Response) => {
//     response.sendFile(path.join(staticDirectory, "/admin/admin.html"));
// });
app.get("*", (request, response) => {
    response.sendFile(path.join(staticDirectory, "index.html"));
});
