var Mongoose = require("mongoose"),
	Schema = Mongoose.Schema;

//schema for providerinterset
var providerinterset = new Schema ({
	name: {type: String, required: true, trim: true},
	city: {type: String, trim: true},
	state: {type: String, trim: true},
	practice: {type: String, trim: true, required: true},
	email: {type: String, trim: true, required: true},
	phone: {type: String, trim: true},
	message: {type: String, trim:true}
});

var providerinterset = Mongoose.model("providerinterest", providerinterset);

module.exports = {	
	providerInterset: providerinterset
};