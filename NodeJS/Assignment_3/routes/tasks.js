var express = require('express');
var router = express.Router();
var path = require("path");

const Task = require(path.join(__dirname, '..', 'models', 'taskModel.js'));
const mongoose = require('mongoose');

router.post("/task", (req, res, next) => {

    let task = new Task({name: req.body.name, status: req.body.status, created_date: req.body.created_date})

    task.save((error, result) => {
        if (error) {
            res.statusCode = 400
            res.send({message: error.errors})
        } else {
            res.statusCode = 201
            res.send({message: "Task successfully created", id: result._id})
        }
    })
});

router.get("/tasks", (req, res, next) => {
    mongoose.connection.db.collection("tasks").find().toArray().then(elements => {
        res.send(elements)
        // res.send(elements.map(task => {
        //     return {_id: task._id, name: task.name, created_date: task.created_date, status: task.status}
        // }))
    })
});

router.get("/tasks/:taskID", (req, res, next) => {
    mongoose.connection.db.collection("tasks").findOne({_id: new mongoose.Types.ObjectId(req.params.taskID)}).then(task => {
        if (task) {
            // res.send({id: task._id, name: task.name, created_date: task.created_date, status: task.status})
            res.send(task)
        } else {
            res.statusCode = 404
            res.send({message: "Task with given ID not found."})
        }
    })
});

router.put("/tasks/:taskID", (req, res, next) => {

    let updatedTask = new Task({name: req.body.name, status: req.body.status, created_date: req.body.created_date})
    updatedTask._id = req.params.taskID

    mongoose.connection.db.collection("tasks").findOneAndUpdate({_id: new mongoose.Types.ObjectId(req.params.taskID)}, updatedTask).then(updateResult => {
        if (updateResult) {
            res.send({message: "Task successfully updated", id: updatedTask._id, name: updatedTask.name, created_date: updatedTask.created_date, status: updatedTask.status})
        } else {
            res.statusCode = 404
            res.send({message: "Task with given ID not found."})
        }
    })
})

router.delete("/tasks/:taskID", (req, res, next) => {
    mongoose.connection.db.collection("tasks").deleteOne({_id: new mongoose.Types.ObjectId(req.params.taskID)}).then(deleteResult => {
        if (deleteResult.deletedCount > 0) {
            res.send({message: "Task successfully deleted", id: req.params.taskID})
        } else {
            res.statusCode = 404
            res.send({message: "Task with given ID not found."})
        }
    })
})

module.exports = router;