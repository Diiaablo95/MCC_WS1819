var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// Set up mongoose connection
const mongoose = require('mongoose');
let dev_db_url = "mongodb://localhost:27017/db";
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.Promise = global.Promise;
mongoose.connect(mongoDB);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(require(path.join(__dirname, "routes", "tasks.js")));

module.exports = app;