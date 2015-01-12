var Mongoose = require("mongoose"),
	Schema = Mongoose.Schema;
	
//schema for provider basic details
var provdetails = new Schema ({
	category: {type:String, required:true, trim:true},
	specialty: {type:String, required:false, trim:true},
	title: {type:String, required:true, trim:true},
	firstName: {type:String, required:true,trim:true},
	lastName: {type:String, trim:true,required:true},
	dob: {type:Date, trim:true, required:true},
	gender: {type:String, trim:true,required:true},
	zipCode: {type:String, trim:true,required:true},	
	email: {type:String,trim:true,required:true},
	webSite: {type:String,trim:true,required:false},
	notification: {type:String,trim:true,required:true},
	cash: {type:String,trim:true,required:true},
	offer: {type: String, trim: true},
	specialOffer: {
		dates: {type: Array, trim: true},
		title: {type: String, trim: true},
		description: {type: String, trim: true}
	},
	cancellationNumber: {type:String,trim:true,required:true},
	image: {type: String, required:false, trim: true},
	subscription: {
		planType: {type: String, trim: true},
		billingInterval: {type: String, trim: true},
		currentPrice: {type: String, trim: true},
		currentTotal: {type: String, trim: true}
	},		
	insurance: {type:Array, required:false, trim:true},
	rating: {type: String, trim: true},
	location:{type: Array, required: true},
	school: {type:String, required:true, trim:true},
	residency: {type:String, required:false, trim:true},
	fellowship: {type:String, required:false, trim:true},
	affilliation: {type:String, required:false, trim:true},
	languages: {type:Array, required:true, trim:true},	
	statement: {type:String, required:false, trim:true},
	t: {type: String, required: true},
	createdAt: {type: Date, default: Date.now(), required: true}
});

var provdetails = Mongoose.model("provdetails", provdetails, "providers");

module.exports = {
	Details: provdetails
};