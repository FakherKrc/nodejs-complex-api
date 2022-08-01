const mongoose = require("mongoose")


const schema = mongoose.Schema({
    title : {type: String, required : true}, 
    description : {type : String, required : true},
    isbn : {type : Number, required : true},
    user : {type : mongoose.Schema.ObjectId, required : true}, },
    {timestamps : true });


module.exports = mongoose.model("book", schema);