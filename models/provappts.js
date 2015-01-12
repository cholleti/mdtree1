var Mongoose = require("mongoose"),
	Schema = Mongoose.Schema;
	
//schema for provider appointments details
var provappts = new Schema ({
	date: {type: Date, required: true, trim: true},
	slots: {type: Array, required: false, trim: true},
	prov: {type: String, required: true, trim: true},
	loc: {type: String, required: true, trim: true},
	specialOffer:{
		title: {type: String},
		description: {type: String},
		offerId: {type: String}
	}
});

var provappts = Mongoose.model("provappts", provappts, "providers");

module.exports = {
	Appointments: provappts
};