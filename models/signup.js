var Mongoose = require("mongoose"),
	Schema = Mongoose.Schema;
	
//schema for signup user to refer during login
var signup = new Schema ({
	email: {type: String, trim: true, required: true},
	password: {type: String, trim: true, required: true},
	temppassword: {type: String, trim: true},
	role: {},
	title: {type: String, trim: true, required: false},
	bitMask: {type: String, trim: true, required:false},
	question: {type: String, trim: true},
	answer: {type: String, trim: true},
	username: {type: String, trim: true, required: true},	
	attempt: {type: String, trim: true},
	status: {type: String, trim: true},
	createdAt: {type: Date, default: Date.now(), required: true}
});

var signup = Mongoose.model("signup", signup);

module.exports = {
	SignUp: signup
};