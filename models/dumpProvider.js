var Mongoose = require("mongoose"),
	Schema = Mongoose.Schema;
	
//schema for dumpProvider 
var dumpProvider = new Schema ({

	// NPI	Category	Specialty	Title	FirstName	LastName	Gender	Address1	Address2	
	// City	State	Zip	PhoneNumber1	PhoneNumber2	FaxNumber	School

	npi: {type: String, required: true, trim: true},
	category: {type:String, required:true, trim:true},
	specialty: {type:String, required:true, trim:true},
	title: {type:String, required:true, trim:true},
	firstName: {type:String, required:true,trim:true},
	lastName: {type:String, trim:true,required:true},	
	gender: {type:String, trim:true,required: true},	
	school: {type:String, required:true, trim:true},
	
	zipCode: {type:String, trim:true,required: false},
	dob: {type:Date, trim:true, required:false},
	email: {type:String,trim:true,required:false},
	webSite: {type:String,trim:true,required:false},
	notification: {type:String,trim:true,required:false},
	cash: {type:String,trim:true,required:false},
	offer: {type: String, trim: true},
	specialOffer: {
		dates: {type: Array, trim: true},
		title: {type: String, trim: true},
		description: {type: String, trim: true}
	},
	cancellationNumber: {type:String,trim:true,required:false},
	image: {type: String, required:false, trim: true},
	subscription: {
		planType: {type: String, trim: true},
		billingInterval: {type: String, trim: true},
		currentPrice: {type: String, trim: true},
		currentTotal: {type: String, trim: true}
	},		
	insurance: {type:Array, required:true, trim:true},
	rating: {type: String, trim: true},
	location:{type: Array, required: true},
	
	residency: {type:String, required:false, trim:true},
	fellowship: {type:String, required:false, trim:true},
	affilliation: {type:String, required:false, trim:true},
	languages: {type:Array, required:false, trim:true},	
	statement: {type:String, required:false, trim:true},
	createdAt: {type: Date, default: Date.now(), required: true},
	t: {type: String, required: true}
});

var dumpProvider = Mongoose.model("dumpProvider", dumpProvider, "providers");

module.exports = {
	Dump: dumpProvider
};