var	Patient = require("../models/patient").Patient,
	patAppointments = require("../models/patientapptmnt").patientAppointments,
	SignUp = require("../models/signup").SignUp,
	Boom =  require("boom"),
	Joi = require("joi"),
	_ = require("underscore"),
	http = require('./config').http,
    OK = http.get('OK').value,
    formattedDate = require('./config').date,
	error = require('./config').errorMessage;

module.exports = exports = function(server) {	
	exports.patient(server);
	exports.updatePatient(server);
	exports.appointmentHistory(server);
}

//to get patient information
exports.patient = function(server) {
	server.route({
		method: "GET",
		path: "/v1/patient",
		config: {
			validate: {
				query: {
					view: Joi.string(),
					email: Joi.string().email().required()
				}
			},
			auth: {
				mode: 'try',
				strategy: "session"
			},			
			handler: function(request, reply) {	
				Patient.findOne({"email": request.query.email}, function(err, patient) {
					if(err) 
						reply(Boom.forbidden(error(err)));
					if(!patient)						
						reply(Boom.notFound("No such patient"));
					if(patient) {	
						if(request.query.view != 'info' && request.query.view != undefined)		
							reply(Boom.forbidden('Unexpected view option'));
						if(request.query.view === 'info' && request.query.view != undefined) {
							var getPatient = {
								"gender": patient.gender,
								"email": patient.email,
								"phone": patient.phone
							}													
						}
						if(request.query.view === undefined) {
							var dob = formattedDate(patient.dob);
							var getPatient = {
								"username": patient.firstName,
								"lastName": patient.lastName,
								"gender": patient.gender,
								"dob": dob,
								"zipCode": patient.zipCode,
								"email": patient.email,
								"phone": patient.phone
							}							
						}	
						reply({patient:getPatient});					
					}
				});
			}
		}
	});
}

// to update patient information
exports.updatePatient = function(server) {
	server.route({
		method: "PUT",
		path: "/v1/updatePatient",
		config: {
			auth: 'session',			
			validate: {
				query: {
					email: Joi.string().email().required()
				},
				payload: {
					firstName: Joi.string().required(),
					lastName: Joi.string().required(),
					zipCode: Joi.string().required(),
					gender: Joi.string().required(),
					dob: Joi.string().required(),
					phone: Joi.string().min(10).max(15).required()
				}
			},
			handler: function(request, reply) {			
				var email = request.query.email;
				if(email != request.auth.credentials.profile.email) {
					reply(Boom.forbidden("Cannot change other's details"));
				}
				if(email === request.auth.credentials.profile.email) {					
					Patient.update({"email": request.query.email},
						{$set: {
								"firstName": request.payload.firstName,
								"lastName": request.payload.lastName,
								"zipCode": request.payload.zipCode,
								"gender": request.payload.gender,
								"dob": request.payload.dob,
								"phone": request.payload.phone,
								"email": request.query.email
							}
						},
						function(err, updatePatient) {
							if(err)	reply(Boom.forbidden(error(err)));
							if(updatePatient) {
								SignUp.update({"email": request.query.email}, 
									{$set: {"username": request.payload.firstName}}, 
									function(err, updated) {
										if(err) reply(Boom.forbidden(error(err)));
										if(updated) reply('Updated Successfully').code(OK);
									}
								);
							}
						}
					);
				}
			}
		}
	});
}

// listing appointment history of patient

exports.appointmentHistory = function(server) {
	server.route({
		method: 'GET',
		path: '/v1/appointmentHistory',
		config: {
			auth: 'session',
			validate:{
				query: {
					email: Joi.string().email().required(),
					type: Joi.string().required()
				}
			},
			handler: function(request, reply) {
				Date.prototype.today = function () { 
					return (((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) + "-"+ ((this.getDate() < 10)?"0":"") + this.getDate() +"-"+ this.getFullYear();
				}
				if(request.query.email != request.auth.credentials.profile.email)
					reply(Boom.forbidden("Cannot access other's details"));
				if(request.query.email === request.auth.credentials.profile.email) {
					if(request.query.type != 'past' && request.query.type != 'pending')
						reply(Boom.expectationFailed('Unexpected type'));
					if(request.query.type === 'past' || request.query.type === 'pending') {
						var today = new Date();

						var formatDate="";
						if (today.getMonth()<9) {
							formatDate += "0" + (today.getMonth()+1);
						} else {
							formatDate += (today.getMonth()+1);
						}
						if (today.getDate()<10) {
							formatDate += "-" +"0" + today.getDate();
						} else {
							formatDate += "-" +today.getDate();
						}
						formatDate += "-" + today.getFullYear();
						formatDate = new Date(formatDate);
						if(request.query.type === 'past') {
							patAppointments.find({"patient": request.query.email, "date": {$lt: formatDate}}, function(err, getPatient) {
								if(err) reply(Boom.forbidden(error(err)));
								if(!getPatient) reply(Boom.notFound('No past appointment'));
								if(getPatient) {
									var patientArray =[];
									_.each(getPatient, function(patient) {
										var details = {
											"date": (patient.date).today(),
											"time": patient.time,
											"provider": patient.prov,
											"providerEmail": patient.provEmail,											
											"location": patient.loc,
											"reason": patient.reason,
											"offer": patient.offer
										}
										patientArray.push(details);
									});
									reply({pastappointment:patientArray});
								}
							});
						}
						if(request.query.type === 'pending') {
							// patAppointments.find({"patient": request.query.email, "date": {$gte: formatDate}}, function(err, getPatient) {
							patAppointments.find({"patient": request.query.email, "date": {$gte: formatDate}}, function(err, getPatient) {
								if(err) reply(Boom.forbidden(error(err)));
								if(!getPatient) reply(Boom.notFound('No pending appointment'));
								if(getPatient) {
									var patientArray =[];
									_.each(getPatient, function(patient) {
										var details = {
											"date": (patient.date).today(),
											"time": patient.time,
											"provider": patient.prov,
											"providerEmail": patient.provEmail,											
											"location": patient.loc,
											"reason": patient.reason,
											"offer": patient.offer
										}
										patientArray.push(details);
									});								
									reply({pendingappointment:patientArray});
								}
							});
						}
					}										
				}				
			}
		}
	});
}