var Mongoose = require("mongoose"),
	Schema = Mongoose.Schema;
	
//schema for radius search
var zip = new Schema ({
	ZIP: {type: Number},
	LTTD: {type: Number},
	LGTD: {type: Number}
});

var zip = Mongoose.model('zip', zip, 'zipcode');

module.exports = {
	Zip: zip
};