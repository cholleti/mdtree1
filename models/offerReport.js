var Mongoose = require("mongoose"),
	Schema = Mongoose.Schema;
	
//schema for offerReport details
var offerReport = new Schema ({		
	title: {type: String, required: true},
	description: {type: String, required: true},
	offerId: {type: String, required: true},
	fromDate: {type: Date, required: true},
	toDate: {type: Date, required: true},
	createdAt: {type: Date, required: true, default: Date.now()},
	createdBy: {type: String, required: true}
});

var offerReport = Mongoose.model("offerReport", offerReport, "offerReport");

module.exports = {
	offerReport: offerReport
};