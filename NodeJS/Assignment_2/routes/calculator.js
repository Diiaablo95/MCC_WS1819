var express = require('express');
var router = express.Router();

function checkConditions(param1, param2, shouldCheckDivisonConditions, operation) {
    if (param1 == null && param2 == null) return {"message": "Missing both parameters"}
    else if (param1 == null) return {"message": "Missing first required parameter"}
    else if (param2 == null) return {"message": "Missing second required parameter"}

    let op1NumericalValue = Number(param1)
    let op2NumericalValue = Number(param2)

    if (isNaN(op1NumericalValue) && isNaN(op2NumericalValue)) return {"message": "Both parameters are not numbers"}
    else if (isNaN(op1NumericalValue)) return {"message": "The first parameter is not a number"}
    else if (isNaN(op2NumericalValue)) return {"message": "The second parameter is not a number"}

    if (shouldCheckDivisonConditions) {
        if (op2NumericalValue == 0) return {"message": "Division by zero is not allowed"}
    }
    
    return {"result": `${operation(op1NumericalValue, op2NumericalValue).toFixed(3)}`}
}

router.get("/calc/add", function(req, res, next) {
    let resBody = checkConditions(req.query.first, req.query.second, false, function(a, b) { return a + b })
    res.statusCode = resBody.message == null ? 200 : 400
    console.log(res.statusCode)
    res.send(resBody)
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