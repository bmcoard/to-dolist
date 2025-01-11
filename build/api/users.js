"use strict";
// const express = require("express")
// const usersRouter = express.Router()
// const {verifyUser} = require("../middlewares/user") //destructure
// import {Request, Response} from "express"
// const User = require("../models/user")
// usersRouter.post("/login", express.json(), async (req:Request, res:Response) => {
//     const {username} = req.body
//     res.cookie("loggedIn", username, {maxAge: 600000}) //sets cookie
//     res.sendStatus(200) 
// })
// usersRouter.post("/users", express.json(), verifyUser, async (req:Request, res:Response) => {
//     const newUser = new User({
//         userId: Math.floor(Date.now())/1000, //epoch 
//         username: req.body.username
//     })
//     await newUser.save()
//     res.sendStatus(200) //sets status and sends it to client
//     //res.status sets status and results in a pending response
// })
// usersRouter.post("/logout", express.json(), verifyUser, async (req:Request, res:Response) => {
//     res.clearCookie("loggedIn")
//     res.sendStatus(200) 
// })
// module.exports = usersRouter  //exports router to app.js
