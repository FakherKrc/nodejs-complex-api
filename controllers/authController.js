var mongoose = require("mongoose");
var { body,validationResult } = require("express-validator");
var ApiResponse = require("../helpers/apiresponse");
var {auth} =  require("../models/user.js");
var bcrypt = require("bcrypt");
var user = require("user");
var jwt = require("jsonwebtoken");
require(".dotenv").config();


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
                        firstname : req.body.firstname,
                        lastname : req.body.lastname, 
                        email  : req.body.email, 
                        password : hash

                    })
                }).then(() => {
                    user.save((err) => {
                        if(err){return ApiResponse.errorResponse(res, "Save error")}
                        let userData = [{
                            id: user._id, 
                            firstname : user.firstname, 
                            lastname : user.lastname, 
                            email : user.email
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


exports.login = [

    body("email").isLength({ min: 1 }).trim().withMessage("Email must be specified.")
    .isEmail().withMessage("Email must be a valid email address.").espace(),
body("password").isLength({ min: 1 }).trim().withMessage("Password must be specified.").espace(),
(req, res) => {

    try {
        const error = validationResult(req);
        if(!error.isEmpty()){
            return ApiResponse.validationErrorWithData(res, "Error validation data", error.array())
        }else{
            user.findOne({email : req.body.email}).then(userfind =>
                
                {

                    if(userfind > 0){
                    bcrypt.compare(req.body.password, userfind.password).then(same => 
                        {
                            if(same){
                                let userData = ({
                                    id : user._id, 
                                    firstname : user.firstname, 
                                    lastname : user.lastname, 
                                    email : user.email
                                }); 
                                
                                const jwtPayload = userData;
                                const jwtData = [{
                                    expiresIn : process.env.JWT_TIMEOUT_DURATION

                                }]

                                const secret = process.env.JWT_SECRET;
                                userData.token = jwt.sign(jwtPayload, secret, jwtData );
                                return ApiResponse.successResponseWithData(res, "Operation Success", userData)
                                
                            }else{
                                return ApiResponse.errorResponse(res, "Email or password wrong");
                            }
                        }); 
                    }else {
                        return ApiResponse.errorResponse(res, "Email or password wrong");
                    }
                });
           
        }
    }catch(err){
        throw new Error(err.message);
    }


}



]