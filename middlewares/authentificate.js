const jwt = require("express-jwt");
require(".dotenv").config();


const auth = jwt({
    secret : process.env.JWT_SECRET
})

module.exports = {auth};

