const express = require("express")
const path = require("path")

const app = express()
app.use(require(path.join(__dirname, "routes", "latexToPDFRouter.js")))

module.exports = app;