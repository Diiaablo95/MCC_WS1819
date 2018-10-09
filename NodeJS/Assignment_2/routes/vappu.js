var express = require('express');
var router = express.Router();

router.get("/vappu/gettime", function(req, res, next) {
    res.send({"seconds": Math.ceil((Date.parse('05/01/2019') - Date.now()) / 1000)})
});

module.exports = router;