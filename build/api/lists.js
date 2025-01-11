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
const express = require("express");
const listRouter = express.Router();
const Task = require("../models/task");
const List = require("../models/list");
listRouter.use(express.urlencoded({ extended: true }));
//Get all lists
listRouter.get("/", express.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lists = yield List.find({}, { __v: 0 }).populate("tasks"); //find all records, ignore id and _v
    res.status(200).json({ sucess: true, lists }); //json will send status
}));
//Add new list
listRouter.post("/", express.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newList = new List({
        title: req.body.title,
        tasks: []
    });
    yield newList.save();
    res.status(200).json({ list: newList });
}));
//Add tasks to lists
listRouter.post("/:listId/tasks", express.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listId = req.params.listId;
    if (!listId) {
        return res.status(400).json({ error: "List ID is required" });
    }
    const newTask = yield Task.create({
        text: req.body.text,
        completed: false,
    });
    // Find the list by ID
    const list = yield List.findById(listId);
    if (!list) {
        return res.status(404).json({ error: "List not found" });
    }
    // Add the new task to the list
    list.tasks.push(newTask._id);
    yield list.save();
    // Return the newly added task
    res.status(200).json(newTask);
}));
//Edit tasks
listRouter.patch("/tasks", express.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { listId, taskId } = req.body;
    const { text, completed } = req.body;
    console.log("edit:", req.body);
    if (!taskId || !listId) {
        return res.status(404).json({ message: "TaskId and ListId required" });
    }
    const list = yield List.findById(listId);
    if (!list) {
        return res.status(404).json({ message: "List not found" });
    }
    const task = yield Task.findById(taskId);
    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }
    if (text)
        task.text = text; //update task text
    if (completed !== undefined)
        task.completed = completed; //update status
    yield task.save();
    return res.status(200).json({ success: true, task });
}));
//Delete tasks from lists
listRouter.delete("/tasks", express.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { listId, taskId } = req.body;
    const list = yield List.findById(listId);
    if (list == null) {
        console.error("List is undefined, Id: ", listId);
        return res.status(404).json({ message: "No list found" });
    }
    const task = yield Task.deleteOne({ _id: taskId });
    list.tasks = list.tasks.filter((Id) => Id != taskId);
    console.log("list.tasks: ", list.tasks);
    yield list.save();
    res.status(200).json({ message: "Task deleted" });
}));
//Delete entire list
listRouter.delete("/:listId", express.json(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listId = req.params.listId;
    const list = yield List.findById(listId); //database object, deleteOne method
    console.log("Delete List:", list);
    list.tasks.forEach((taskId) => __awaiter(void 0, void 0, void 0, function* () {
        yield Task.deleteOne({ _id: taskId }); //query database. taskId is not a stored object 
    }));
    yield list.deleteOne();
    if (!list) {
        return res.status(404).json({ message: "List not found" });
    }
    res.status(200).json({ message: "List deleted" });
}));
module.exports = listRouter;
