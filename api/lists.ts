const express = require("express")
const listRouter = express.Router()
import {Request, Response} from "express"
const Task = require("../models/task")
const List = require("../models/list")
listRouter.use(express.urlencoded({extended:true}))

//Get all lists
listRouter.get("/", express.json(), async (req: Request, res:Response) => {
    const lists = await List.find({},{__v:0}).populate("tasks") //find all records, ignore id and _v
    res.status(200).json({sucess: true, lists}) //json will send status
})


//Add new list
listRouter.post("/", express.json(), async (req: Request, res:Response) => {
    const newList = new List({
        title: req.body.title, 
        tasks: []
    })

    await newList.save()
    res.status(200).json({list:newList})
})


//Add tasks to lists
listRouter.post("/:listId/tasks", express.json(), async (req: Request, res:Response) => {
    const listId = req.params.listId;

    if (!listId) {
        return res.status(400).json({ error: "List ID is required" });
    }

    const newTask = await Task.create({
        text: req.body.text,
        completed: false,
    });

    // Find the list by ID
    const list = await List.findById(listId);

    if (!list) {
        return res.status(404).json({ error: "List not found" });
    }

    // Add the new task to the list
    list.tasks.push(newTask._id);
    await list.save();

    // Return the newly added task
    res.status(200).json(newTask);
})


//Edit tasks
listRouter.patch("/tasks", express.json(), async (req: Request, res:Response) => {
    const {listId, taskId} = req.body
    const {text, completed} = req.body

    console.log("edit:", req.body)

    if (!taskId|| !listId) {
        return res.status(404).json({message: "TaskId and ListId required"})
    }

    const list = await List.findById(listId)
    if (!list) {
        return res.status(404).json({ message: "List not found" });
    }

    const task = await Task.findById(taskId)
    if (!task) {
        return res.status(404).json({ message: "Task not found" });
    }


    if (text) task.text = text //update task text
    if (completed !== undefined) task.completed = completed //update status
    await task.save()

    return res.status(200).json({success: true, task})
})


//Delete tasks from lists
listRouter.delete("/tasks", express.json(), async (req: Request, res:Response) => {
    const {listId, taskId} = req.body

    const list = await List.findById(listId)

    if(list == null){
        console.error("List is undefined, Id: ", listId)
        return res.status(404).json({message: "No list found"})
    }

    const task = await Task.deleteOne({_id:taskId})

    list.tasks = list.tasks.filter ((Id: string) => Id != taskId)

    console.log("list.tasks: ", list.tasks)
    
    await list.save()
    res.status(200).json({message: "Task deleted"})
})


//Delete entire list
listRouter.delete("/:listId", express.json(), async (req: Request, res:Response) => {
    const listId = req.params.listId

    const list = await List.findById(listId) //database object, deleteOne method

    console.log("Delete List:", list)
    
    list.tasks.forEach( async (taskId: string) => {
        await Task.deleteOne({_id:taskId}) //query database. taskId is not a stored object 
    })

    await list.deleteOne()

    if (!list){
        return res.status(404).json({ message: "List not found" })
    }
    res.status(200).json({message: "List deleted"})
})

module.exports = listRouter