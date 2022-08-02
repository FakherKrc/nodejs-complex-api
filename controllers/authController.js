var mongoose = require("mongoose");
var { body,validationResult } = require("express-validator");
var ApiResponse = require("../helpers/apiresponse");
var {auth} =  require("../models/user.js");
var bcrypt = require("bcrypt");
var user = require("user");

UserSchema = new mongoose.Schema({
	firstName: {type: String, required: true},
	lastName: {type: String, required: true},
	email: {type: String, required: true},
	password: {type: String, required: true},
	isConfirmed: {type: Boolean, required: true, default: 0},
	confirmOTP: {type: String, required:false},
	otpTries: {type: Number, required:false, default: 0},
	status: {type: Boolean, required: true, default: 1}


})

exports.register = [
    body("firstname").length({min : 1}).trim().withMessage("First name must be specified").isAlphanumeric()
    .withMessage("Contains none alpha caractere").escape(), 
    body("lastname").length({min : 1}).trim().withMessage("First name must be specified").isAlphanumeric()
    .withMessage("Contains none alpha caractere").escape(), 
    body("email").length({min : 1}).trim().withMessage("Email must be specified").isEmail()
    .withMessage("Email must be a valid adress").custom(value => {
        return UserModel.findOne({email : value}).then(email => {
            if(email > 0){
                return Promise.reject("Email already used");
            }
        });
    
    }).escape(),
    body("password").length({min : 6}).trim().withMessage("Password must be 6 characters or greater").escape(), 
    (req, res) => {
        try {
            const errors = validationresult(req);
            if(!error.isEmpty()){
                return ApiResponse.validationErrorWithData(res, "Validation error", errors.array())
            }else{
                bcrypt.hash(req.body.password, 10, (err, hash ) => {
                    var usr = new user({
                        firstname = req.body.firstname,
                        lastname = req.body.lastname, 
                        email  = req.body.email, 
                        password = hash

                    })
                }).then(() => {
                    user.save((err) => {
                        if(err){return ApiResponse.errorResponse(res, "Save error")}
                        let userData = [{
                            id: user._id, 
                            firstname = user.firstname, 
                            lastname = user.lastname, 
                            email = user.email
                        }];
                        return ApiResponse.successResponseWithData(res, "Operation Success", userData);
                    })
                }).catch(err => {
                    return ApiResponse.errorResponse(res, "errorResponse");
                });
            }
        }catch(err){
            throw new Error(err.message);
        }
    
        
       
    }


]