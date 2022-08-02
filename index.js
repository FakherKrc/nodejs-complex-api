var mongoose = require("mongoose");
require("dotenv").config();
var express = require("express");
var ApiReponse = require("./helpers/apiresponse");
var path = require("path");
var cors = require("cors");
var apiRouter = require("./routes/api");
var jwt = require("jsonwebtoken")

var app = express();


var MONGODB_URL = process.env.MONGODB_URL;
mongoose.connect(MONGODB_URL, {useNewUrlParser : true, useUnifiedTopology: true}).then(() => {
    console.log("Connected to %s", MONGODB_URL);
	console.log("App is running ... \n");
	console.log("Press CTRL + C to stop the process. \n");
}).catch(err => {
    console.error("app starting error", err.message);
    process.exit(1);
});

var db = mongoose.connection;



function generateAccessToken(username){
    return jwt.sign(username, process.env.JWT_SECRET, process.env.JWT_TIMEOUT_DURATION);
}

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));


app.use('/api/', apiRouter);
npm
app.all('*', (req, res) => {
    return ApiReponse.notFoundResponse(res, "Page not found");
});

app.use((err, req, res) => {
    if(err.name == "UnAuthorizedResponse"){
        return ApiReponse.unauthorizedResponse(res, err.message);
    }
})


app.listen(8080, () => console.log("Server started"));

module.exports = app;