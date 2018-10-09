var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var calculatorRouter = require(path.join(__dirname, "routes", "calculator.js"));
var vappuRouter = require(path.join(__dirname, "routes", "vappu.js"));
var imagesMetadataRouter = require(path.join(__dirname, "routes", "imagesMetadata.js"));

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(calculatorRouter);
app.use(vappuRouter);
app.use(imagesMetadataRouter);

module.exports = app;