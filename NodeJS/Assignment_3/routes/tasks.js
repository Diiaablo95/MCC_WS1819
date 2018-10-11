var express = require('express');
var router = express.Router();
var path = require("path");

const Task = require(path.join(__dirname, '..', 'models', 'taskModel.js'));
const mongoose = require('mongoose');

function isValidTaskStatus(status) {
    return ["pending", "ongoing", "completed"].includes(status)
}

router.post("/task", function(req, res, next) {

    console.error("*****" + JSON.stringify(req.body))

    let taskName = req.body.name

    if (taskName == null) {
        res.statusCode = 400
        res.send({message: "Task name required."})
        return
    }

    var taskDate

    if (req.body.created_date == null) {
        taskDate = Date.now()
    } else {
        let parsedDate = Date.parse(req.body.created_date)
        if (parsedDate != null) {
            taskDate = parsedDate
        } else {
            res.statusCode = 400
            res.send({message: "Task date in wrong format."})
            return
        }
    }

    var taskStatus

    if (req.body.status == null) {
        taskStatus = "pending"
    } else {
        if (isValidTaskStatus(req.body.status)) {
            taskStatus = req.body.status
        } else {
            res.statusCode = 400
            res.send({message: "Task status not in ['pending', 'ongoing', 'completed']"})
            return
        }
    }

    let task = new Task(
        {
            name: taskName,
            created_date: taskDate,
            status: taskStatus
        }
    );

    task.save(function (error, result) {
        if (error) {
            res.statusCode = 400
            res.send({message: error.errors})
        } else {
            console.log(result)
            res.send({message: "Task successfully created", id: result._id})
        }
    })
});

router.get("/tasks", function(req, res, next) {
    mongoose.connection.db.collection("tasks").find().toArray().then(function(elements) {
        res.send(elements.map(function(task) {
            return {id: task._id, name: task.name, created_date: task.created_date, status: task.status}
        }))
    })
});

router.get("/tasks/:taskID", function(req, res, next) {
    mongoose.connection.db.collection("tasks").findOne({_id: new mongoose.Types.ObjectId(req.params.taskID)}).then(function(task) {
        if (task) {
            res.send({id: task._id, name: task.name, created_date: task.created_date, status: task.status})
        } else {
            res.statusCode = 404
            res.send({message: "Task with given ID not found."})
        }
    })
});

router.get("/calc/mul", function(req, res, next) {
    let resBody = checkConditions(req.query.first, req.query.second, false, function(a, b) { return a * b })
    res.statusCode = resBody.message == null ? 200 : 400
    res.send(resBody)
});

module.exports = router;