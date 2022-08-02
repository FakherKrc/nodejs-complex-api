var  mongoose = require("mongoose")


var schema = mongoose.Schema({
    title : {type: String, required : true}, 
    description : {type : String, required : true},
    isbn : {type : Number, required : true},
    user : {type : String, required : true}, },
    {timestamps : true });


const book =  mongoose.model("dbtest", schema, "book");

module.exports = {book};