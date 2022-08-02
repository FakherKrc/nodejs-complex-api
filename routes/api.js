var express = require("express")
var bookRouter = require("./bookroute")

var app = express()

app.use("/book/", bookRouter);

module.exports = app;