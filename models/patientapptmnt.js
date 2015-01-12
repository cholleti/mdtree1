var Mongoose = require("mongoose"),
	Schema = Mongoose.Schema;
	
//schema for provider appointments details
var patappts = new Schema ({
	date: {type: Date, required: true, trim: true},
	time: {type: String, required: true, trim: true},
	prov: {type: String, required: true, trim: true},
	provEmail: {type: String, required: true, trim: true},
	loc: {
		address: {type: String, trim: true},
		city: {type: String, trim: true},
		state: {type: String, trim: true},
		zip: {type: String, trim: true}
	},
	reason: {type: String, required: true, trim:true},
	offer: {},	
	patient: {type: String, required:true, trim:true}
});

var patappts = Mongoose.model("patappts", patappts, "patients");

module.exports = {
	patientAppointments: patappts
};