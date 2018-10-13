const express = require("express")
const path = require("path")
const session = require("express-session")
const bodyParser = require("body-parser")

const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(session({secret: "secret", resave: true, saveUninitialized: true}))

app.use(require(path.join(__dirname, "routes", "registrationRouter.js")))
app.use(require(path.join(__dirname, "routes", "loginRouter.js")))
app.use(require(path.join(__dirname, "routes", "userProfileRouter.js")))
app.use(require(path.join(__dirname, "routes", "logoutRouter.js")))

// Set up mongoose connection
const mongoose = require('mongoose');
let dev_db_url = "mongodb://localhost:27017/db";
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.Promise = global.Promise;
mongoose.connect(mongoDB);

module.exports = app;