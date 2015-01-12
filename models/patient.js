var Mongoose = require("mongoose"),
	Schema = Mongoose.Schema;
	
//schema for patient
var patient = new Schema ({
	firstName: {type: String, required: true, trim: true},
	lastName: {type: String, trim: true, required: true},
	zipCode: {type: String, trim: true, required: true},
	gender: {type: String, trim: true, required: true},
	dob: {type: Date, trim: true, required: true},	
	email: {type: String, trim: true, required: true},
	phone: {type: String, trim: true, required: true}
});

var patient = Mongoose.model("patient", patient);

module.exports = {
	Patient: patient
};