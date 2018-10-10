var express = require('express');
var router = express.Router();
var path = require("path");

const Task = require(path.join(__dirname, '..', 'models', 'taskModel.js'));

function isValidTaskStatus(status) {
    return new Set("pending", "ongoing", "completed").has(status)
}

router.post("/task", function(req, res, next) {

    console.error("*****" + JSON.stringify(req.body))

    let task = new Task(
        {
            name: req.body.name,
            created_date: req.body.created_date,
            status: req.body.created_date
        }
    );

    //TODO: Get taskID after creating one
    let taskID = task.save(function (error) {
        if (error) {
            res.statusCode = 400
            res.send({message: error.errors})
        }
    })

    res.send({message: "Task successfully created", id: taskID})

    // if (taskName == null) {
    //     res.statusCode = 400
    //     res.send({message: "Missing task name value"})
    //     return
    // }

    // let taskDate = Date.parse(req.body.created_date) || Date.now()
    // let taskStatus = req.body.status || "pending"

    // if (!isValidTaskStatus(taskStatus)) {
    //     res.statusCode = 400
    //     res.send({message: "Task status must be one of [\"pending\", \"ongoing\" or \"completed\"]"})
    //     return
    // }    
});

router.get("/calc/sub", function(req, res, next) {
    let resBody = checkConditions(req.query.first, req.query.second, false, function(a, b) { return a - b })
    res.statusCode = resBody.message == null ? 200 : 400
    res.send(resBody)
});

router.get("/calc/div", function(req, res, next) {
    let resBody = checkConditions(req.query.first, req.query.second, true, function(a, b) { return a / b })
    res.statusCode = resBody.message == null ? 200 : 400
    console.log(res.statusCode)
    res.send(resBody)
});

router.get("/calc/mul", function(req, res, next) {
    let resBody = checkConditions(req.query.first, req.query.second, false, function(a, b) { return a * b })
    res.statusCode = resBody.message == null ? 200 : 400
    res.send(resBody)
});

module.exports = router;