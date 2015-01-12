var	Details = require("../models/provdetails").Details,
	Appointments = require("../models/provappts").Appointments,
	Provider = require("../models/provdetails").Details,
	dumpProvider = require('../models/dumpProvider').Dump,
	SignUp = require("../models/signup").SignUp,
	offerReport = require("../models/offerReport").offerReport,
	Boom =  require("boom"),
	Joi = require("joi"),
	Fs = require('fs'),
	_ = require("underscore"),
	status = require('./config').apptStatus,
	slotStatus = require('./config').slotStatus,
	adminAuth = require('./config').auth.admin,
	http = require('./config').http,
    OK = http.get('OK').value,
    formattedDate = require('./config').date,
    getDateFromFormat = require('./config').dateFormat,
    bcrypt = require("bcrypt"),
    role = require('./config').role, 
    salesadmin = role.get('salesAdmin').value,
    salesmanageradmin = role.get('salesManagerAdmin').value,
    userRoles = require('../public/js/routingConfig').userRoles,
    salesAdminrole = userRoles.salesAdmin,
	salesManagerrole = userRoles.salesManagerAdmin,
    providerAuth = require('./config').auth.provider,
    crypt = require('./config').auth.crypt,
	error = require('./config').errorMessage;
var swig  = require('swig'),
	sendMail = require('./config').sendingMail;

module.exports = exports = function(server) {
	exports.updateStatus(server);	
	exports.image(server);
	exports.getdetails(server);
	exports.updatedetails(server);
	exports.views(server);
	exports.offer(server);
	exports.slottedDate(server);
	// exports.uploadFile(server);
	exports.readFile(server);
	exports.listOffer(server);
}

// update visiting status
exports.updateStatus = function(server) {
	server.route({
		method: "PUT",
		path: "/v1/updateStatus",
		config:{
			auth: "session",
			validate: {
				payload: {
					provideremail: Joi.string().email().required(),
					date: Joi.string().required(),
					location: Joi.string().required(),
					slot: Joi.string().required(),
					status: Joi.string().required(),
					reason: Joi.string()
				}
			},
			handler: function(request, reply) {
				var email = request.payload.provideremail;
				if(email != request.auth.credentials.profile.email) {
					reply(Boom.forbidden("Cannot change other's status"));
				}
				if(email === request.auth.credentials.profile.email) {
					Provider.findOne({"email": request.payload.provideremail}, function(err, getProvider) {
						if(err)
							reply(Boom.forbidden(error(err)));
						if(!getProvider)
							reply(Boom.notFound("No such provider"));
						if(getProvider) {
							var a =request.payload.status;
							var newStatus;
							if(a != 'NoShow' && a != 'Done' && a != 'Booked' && a != 'Available' && a!= 'Cancel')
								reply(Boom.forbidden("Enter valid status"));
							if(a === 'NoShow' || a === 'Done' || a === 'Booked' || a === 'Available' || a === 'Cancel') {
								if(a === 'NoShow')
									newStatus = status.NoShow.string;
								if(a === 'Done')
									newStatus = status.Done.string;						
								if(a === 'Booked')
									newStatus = status.Booked.string;
								if(a === 'Available')
									newStatus = status.Available.string;								
								if(a === 'Cancel') {							
									newStatus = status.Available.string;
									Appointments.findOne({"prov": request.payload.provideremail, "date": request.payload.date, 
										"loc": request.payload.location, "slots.from": request.payload.slot},{"slots.$.patient":1},
										function(err, patient) {
										 	if(err)								 		
												reply(Boom.forbidden(error(err)))
											if(!patient)
												reply(Boom.notFound("No exact match"));
											if(patient) {
												if(patient.slots[0].patient === undefined) {
													reply(Boom.forbidden('There is no appointment booked in this slot'));
												}
												var patientdetail;
												if(request.payload.reason === undefined)
													reply(Boom.forbidden('Reason is required for cancel'));
												if(patient.slots[0].patient != undefined) {										
													if(request.payload.reason != undefined) {
														patientdetail = patient.slots[0].patient;											
														patientdetail.reason = request.payload.reason;										
													}		
												}
												Appointments.update({"prov": request.payload.provideremail, "date": request.payload.date, 
													"loc": request.payload.location, "slots.from": request.payload.slot}, 
													{$set: {"slots.$.status": newStatus, "slots.$.cancelled": patientdetail}},													
													function(err, update) {
														if(err)
															reply(Boom.forbidden(error(err)))
														if(!update)
															reply(Boom.notFound("No exact match"));
														if(update) {	
															Appointments.update({"prov": request.payload.provideremail, "date": request.payload.date, 
																"loc": request.payload.location, "slots.from": request.payload.slot}, 
																{$unset: {"slots.$.patient":1}}, function(err, removed) {
																	if(err)
																		reply(Boom.forbidden(error(err)));
																	if(removed)				
																		reply("Cancelled successfully");		
																}
															);	
														}
													}
												);
												
											}
										} 
									);	
								}
								Appointments.update({"prov": request.payload.provideremail, "date": request.payload.date, 
									"loc": request.payload.location, "slots.from": request.payload.slot}, 
									{$set: {"slots.$.status": newStatus}},
									function(err, updated) {
										if(err)
											reply(Boom.forbidden(error(err)))
										if(!updated)
											reply(Boom.notFound("No exact match"));
										if(updated) 
											reply("Status updated successfully");
									}
								);
							}						
						}
					});
				}				
			}
		}
	});
}

//upload image 
exports.image = function(server) {
	server.route({
		method: "PUT",
		path: "/v1/imageupload",		
		config: {				
			auth: "session",			
			payload: {
				output: 'file',
		        maxBytes: 2097152,
		        uploads: './temp',
		        parse: true,
			},		
			validate: {
				payload: {
					imageFile: Joi.object().required(),
					email: Joi.string().email().required()
				}
			},
			handler: function(request, reply) {
				var user = new Provider(),
					file,
					email = request.payload.email;
					userRole = request.auth.credentials.role.title; 	
		    	var username = request.auth.credentials.username;
		    	console.log('credentials are ', JSON.stringify(request.auth.credentials));
				if( userRole != adminAuth.title && userRole != salesManagerrole.title && userRole != salesAdminrole.title) {
					console.log('not admin');
					if(email != request.auth.credentials.profile.email) {
						reply(Boom.forbidden("Cannot change other's image"));
					}
					else
						uploadImage();
				}
				else
					uploadImage();
				
				function uploadImage() {					
					Provider.findOne({"email": email}, function(err, getProvider) {
						if(err)
							reply(Boom.forbidden(error(err)));
						if(!getProvider) {
							reply(Boom.notFound("No such user"));
						}
						if(getProvider) {							
							if (request.payload.imageFile) {
						        file = request.payload.imageFile;
						        var extn = (file.filename).substr((file.filename).indexOf('.')+1),
						        	// path = (file.path).substr((file.path).indexOf('/')+1),
						        	path = (file.path).replace(/^.*[\\\/]/, ''),
						    		filename = path+'.'+extn;
						        Fs.rename(file.path, './userimage/'+filename, function(err) {
						            if (err) reply(Boom.forbidden(error(err)));
						        });		   
						        Provider.update({"email": email}, {$set: {"image": './userimage/'+filename}}, function(err, updated) {
						        	if(err)
						        		reply(Boom.forbidden(error(err)));
						        	if(updated) {
						        		if(getProvider.image != undefined) {
						        			if(getProvider.image != './userimage/nopic.jpeg')
						        				Fs.unlink(getProvider.image);
						        			else
						        				console.log('no pic image');
						        		}
						        		reply('Updated Successfully').code(OK);
						        	}
						        });
						    }
						}						
					});	
				}					
			}
		}
	});
};

// list of slots based on view option
exports.views = function(server) {
	server.route({
		method: "GET",
		path: "/v1/getslot",
		config: {
			auth: 'session',
			validate: {
				query: {
					view: Joi.string().required(),
					locId: Joi.string().required(),
					email: Joi.string().email().required(),
					startindex: Joi.number(),
					date: Joi.string()
				}
			},
			handler: function(request, reply) {
				
				if(request.query.email != request.auth.credentials.profile.email)
					reply(Boom.forbidden("Cannot get other's details"));
				if(request.query.email === request.auth.credentials.profile.email) {
					Array.prototype.has = function(v) {
						for (var l=0;l<this.length; l++) {
							if(this[l]==v) {
								return l+1;
							}
						}
						return false;
					}
					Date.prototype.today = function () { 
						return (((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) + "-"+ ((this.getDate() < 10)?"0":"") + this.getDate() +"-"+ this.getFullYear();
					}
					var view, dates=[],
						today = new Date(), calcdate = new Date(),
						startindex, dateindex =0;

					if(request.query.view != 'daily'  && request.query.view != 'weekly' && request.query.view != 'schedule')
						reply(Boom.notFound("Invalid view request"));
					if(request.query.view === 'daily') {
						view =1;						
						if((request.query.startindex === undefined) || (request.query.startindex != undefined && request.query.view === 'daily'))
							dateindex = 0;		
						if(request.query.date === undefined) 
							today = new Date();
						if(request.query.date != undefined)
							today = new Date(request.query.date);					
						var formatDate = "";
						// var calcdate = new Date();
						// calcdate.setDate(today.getDate()+(dateindex));
						// today.setDate(today.getDate()+i);
						
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
						dates.push(formatDate);					
					}
					if(request.query.view === 'weekly') {
						view =7;
						if(request.query.date === undefined) 
							today = new Date();
						if(request.query.date != undefined)
							today = new Date(request.query.date);
						var firstday = new Date(today.setDate(today.getDate() - today.getDay())),
							lastday = new Date(today.setDate(today.getDate() - today.getDay()+6));
						if(request.query.startindex != undefined && request.query.view === 'weekly')
							dateindex = parseInt(view) * request.query.startindex;
						for (var i=0; i<view; i++) {						
							var formatDate = "";												
							console.log('i is', i);
							if(i === 0 ) {
								calcdate = firstday;
								calcdate.setDate(calcdate.getDate()+(dateindex+i));
							}
							else
								calcdate.setDate(calcdate.getDate()+1);	
							
							if (calcdate.getMonth()<9) {
								formatDate += "0" + (calcdate.getMonth()+1);
							} else {
								formatDate += (calcdate.getMonth()+1);
							}
							if (calcdate.getDate()<10) {
								formatDate += "-" +"0" + calcdate.getDate();
							} else {
								formatDate += "-" +calcdate.getDate();
							}
							formatDate += "-" + calcdate.getFullYear();
							dates.push(formatDate);								
						}	
					}
					if(request.query.view === 'schedule') {
						view = 7;
						if(request.query.startindex != undefined && request.query.view === 'schedule')
							dateindex = parseInt(view) * request.query.startindex;
						var today = new Date();
						for (var i=0; i<view; i++) {						
							var calcdate = new Date();
							var formatDate = "";
							calcdate.setDate(today.getDate()+(dateindex+i));								
							if (calcdate.getMonth()<9) {
								formatDate += "0" + (calcdate.getMonth()+1);
							} else {
								formatDate += (calcdate.getMonth()+1);
							}
							if (calcdate.getDate()<10) {
								formatDate += "-" +"0" + calcdate.getDate();
							} else {
								formatDate += "-" +calcdate.getDate();
							}
							formatDate += "-" + calcdate.getFullYear();
							dates.push(formatDate);		
						}
					}
					var firstDay = new Date(dates[0]);
					var lastDay = new Date(dates[dates.length-1]);
					lastDay.setHours(23);
					lastDay.setMinutes(59);
					lastDay.setSeconds(59);
					Appointments.find({"prov": request.query.email, "loc": request.query.locId, "date":{$gte: firstDay, $lte: lastDay}},
						{"date":1, "slots":1, "_id":0, "loc":1, "specialOffer":1},
						{sort:({date:1})}, function(err, provAppts) {
							appointments =[];
							if(err)
								reply(Boom.forbidden(error(err)));
							if(!provAppts) 
								reply(Boom.notFound("No such provider in this location"));
							if(provAppts) {
								_.each(dates, function(index) {
									var slot = [], title, description;
									var slotJson = {};
									var time = [], timeTaken;
									var modifySlots=[];												
									function getSlot(id) {
									    return _.find(provAppts, function(appt) {
									    	var compareDate = (appt.date).today();
									    	console.log('compareDate ', compareDate, appt.date);
									    	// if(appt.date === id) {
									    	if(compareDate === id) {
									    		function getstatus(status) {													
													return _.find(appt.slots, function(slot) {																
														if(slot.status == status) {
															var startTime = slot.at;
															var	today = new Date(),
																currentTime = ((today.getHours()+1)*60*60)+((today.getMinutes()+1)*60)+ (today.getSeconds()+1);
															timeTaken=Math.floor(Math.abs(currentTime - startTime)/60);
															// console.log(slotStatus.Time.value, 'is maximum limit  and it tooks ', timeTaken);
															if(timeTaken > slotStatus.Time.value) {
																slot.status = slotStatus.Available.string;
																time.push(slot.from);
															}
														}
														if(slot.from === appt.slots[appt.slots.length-1].from) {
															if(time.length > 0) {
																console.log('length > 0');
																console.log('inserting ', appt.loc, compareDate, time);
																slotJson.loc = appt.loc;
																slotJson.date = compareDate;
																slotJson.time = time;
															}
															modifySlots.push(slotJson);
														}
													});
												}
												var slots = getstatus(slotStatus.Blocked.string);	
										    	_.each(modifySlots, function(modifySlot) {
										    		_.each(modifySlot.time, function(slotTime) {
														Appointments.update({'loc': modifySlot.loc, 'date': modifySlot.date, 'slots.from': slotTime}, 
														    {$set: {'slots.$.status': slotStatus.Available.string}}, function(err, updated) {
														    	if(err)
														    		reply(Boom.forbidden(error(err)));
														    	if(updated) {
														    		// count++;
														    		console.log('updated ');
														    	}
														    }
														);
													});
										    	});
										    	return compareDate == id;
									    	}	
									    	// return appt.date == id;										        
									    });
									}

									if(getSlot(index) === undefined)
										slot = [];
									else {

										slot = getSlot(index).slots;
										if(getSlot(index).specialOffer.title && slot.length > 0) {
											console.log(getSlot(index).specialOffer.title);
											title = getSlot(index).specialOffer.title;
											description = getSlot(index).specialOffer.description;
										}
									}
									var apptSchedule = {
										'date': index,
										'slots': slot,
										'title': title,
										'description': description
									}
									appointments.push(apptSchedule);
								});
								if(request.query.view === 'daily')
									reply({slot:appointments[0]});
								if(request.query.view === 'weekly' || request.query.view === 'schedule')
									reply({slots:appointments});
							}
						}
					);	
				}
			}
		}
	});
}

// for provider information with all location and slots
exports.getdetails = function(server) {
	server.route({
		method: "GET",
		path: "/v1/provider",
		config: {
			validate: {				
				query: {
					type: Joi.string(),
					locId: Joi.string(),
					email: Joi.string().email().required(),
					startindex: Joi.number(),
					getLocation: Joi.string(),
					view: Joi.string()
				}				
			},
			handler: function(request, reply) {				
				Array.prototype.has = function(v) {
					for (var l=0;l<this.length; l++) {
						if(this[l]==v) {
							return l+1;
						}
					}
					return false;
				}
				Date.prototype.today = function () { 
					return (((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) + "-"+ ((this.getDate() < 10)?"0":"") + this.getDate() +"-"+ this.getFullYear();
				}
				var i, j, count, appointments =[], location=[], apptDate = [], apptSlot=[], chkdates=[], locationArray=[], getProvider, loc, specialOffer = {};
				function calclocation(j) {
					if( j < (getProvider.location).length) {
						count =j;					
						
						if(request.query.getLocation === undefined) 
							loc = getProvider.location[j].locId;
						else 
							loc = request.query.getLocation;

						console.log('query to find is ', JSON.stringify(loc));
						Appointments.find({"prov": request.query.email, "loc": loc, "date":{$gte: firstDay, $lte: lastDay}},
							{"date":1, "slots":1, "_id":0, "loc":1, "specialOffer":1},
							{sort:({date:1})}, function(err, provAppts) {
								if(err)
									reply(Boom.forbidden(error(err)));
								if(!provAppts) 
									reply(Boom.notFound("No such provider in this location"));
								if(provAppts) {	
									appointments = [];
									_.each(dates, function(index) {
										var slot = [], title, description;
										var slotJson = {};
										var time = [], timeTaken;
										var modifySlots=[];												
										function getSlot(id) {
										    return _.find(provAppts, function(appt) {
										    	var compareDate = (appt.date).today();
										    	if(compareDate === id) {
										    		function getstatus(status) {													
														return _.find(appt.slots, function(slot) {																
															if(slot.status == status) {
																var startTime = slot.at;
																var	today = new Date(),
																	currentTime = ((today.getHours()+1)*60*60)+((today.getMinutes()+1)*60)+ (today.getSeconds()+1);
																timeTaken=Math.floor(Math.abs(currentTime - startTime)/60);
																// console.log(slotStatus.Time.value, 'is maximum limit  and it tooks ', timeTaken);
																if(timeTaken > slotStatus.Time.value) {
																	slot.status = slotStatus.Available.string;
																	time.push(slot.from);
																}
															}
															if(slot.from === appt.slots[appt.slots.length-1].from) {
																if(time.length > 0) {
																	console.log('length > 0');
																	console.log('inserting ', appt.loc, compareDate, time);
																	slotJson.loc = appt.loc;
																	slotJson.date = compareDate;
																	slotJson.time = time;
																}
																modifySlots.push(slotJson);
															}
														});
													}
													var slots = getstatus(slotStatus.Blocked.string);	
											    	_.each(modifySlots, function(modifySlot) {
											    		_.each(modifySlot.time, function(slotTime) {
															Appointments.update({'loc': modifySlot.loc, 'date': modifySlot.date, 'slots.from': slotTime}, 
															    {$set: {'slots.$.status': slotStatus.Available.string}}, function(err, updated) {
															    	if(err)
															    		reply(Boom.forbidden(error(err)));
															    	if(updated) {
															    		// count++;
															    		console.log('updated ');
															    	}
															    }
															);
														});
											    	});
											    	return compareDate == id;
										    	}	
										    	// return appt.date == id;										        
										    });
										}

										if(getSlot(index) === undefined)
											slot = [];
										else {

											slot = getSlot(index).slots;
											// console.log(' slots for the location ', JSON.stringify(slot), loc);
											if(getSlot(index).specialOffer.title && slot.length > 0) {
												console.log(getSlot(index).specialOffer.title);
												title = getSlot(index).specialOffer.title;
												description = getSlot(index).specialOffer.description;
											}
										}
										var apptSchedule = {
											'date': index,
											'slots': slot,
											'title': title,
											'description': description
										}
										appointments.push(apptSchedule);
									});
									var location = {
										"practiceName": getProvider.location[count].practiceName,
										"locationId": getProvider.location[count].locId,
										"address": getProvider.location[count].address,
										"city": getProvider.location[count].city,
										"state": getProvider.location[count].state,
										"zip": getProvider.location[count].zip,
										"phone1": getProvider.location[count].phone1,
										"phone2": getProvider.location[count].phone2,
										"fax": getProvider.location[count].fax,
										"appointmentSchedules": appointments
									}
									locationArray.push(location);
									if(request.query.getLocation === undefined) 
										calclocation(count+1);
									else
										calclocation(getProvider.location.length);
								}
							}
						);									
					}	
					if( j >= (getProvider.location).length) {						
						display();
					}
				}
				function display() {
					var primaryLocation = {
						address: getProvider.location[0].address,
						city: getProvider.location[0].city,
						state: getProvider.location[0].state,
						zip: getProvider.location[0].zip
					}
					var result = {
						category: getProvider.category,
						specialty: getProvider.specialty,
						name: getProvider.title+" "+getProvider.firstName+" "+getProvider.lastName,
						dob: getProvider.dob,
						image: getProvider.image,
						primarylocation: primaryLocation,
						zipCode: getProvider.zipCode,
						email: getProvider.email,
						webSite: getProvider.webSite,
						notification: getProvider.notification,
						cash: getProvider.cash,
						offer: getProvider.offer,
						cancellationNumber: getProvider.cancellationNumber,
						locations: locationArray,
						school: getProvider.school,
						residency: getProvider.residency,
						fellowship: getProvider.fellowship,
						affilliation: getProvider.affilliation,
						languages: getProvider.languages,
						insurance: getProvider.insurance,
						statement: getProvider.statement,	
						// appointmentSchedules: appointments								
					}																				
					reply({provider:result});
				}
				if(request.query.type === undefined) {					
					var dates=[],
						today = new Date(),
						startindex, 
						dateindex;
					if(request.query.startindex === undefined)
						dateindex = 0*7;
					if(request.query.startindex != undefined)
						dateindex = 7 * request.query.startindex;
					for (var i=0; i<7; i++) {
						var formatDate = "";
						var calcdate = new Date();
						calcdate.setDate(today.getDate()+(dateindex+i));						
						if (calcdate.getMonth()<9) {
							formatDate += "0" + (calcdate.getMonth()+1);
						} else {
							formatDate += (calcdate.getMonth()+1);
						}
						if (calcdate.getDate()<10) {
							formatDate += "-" +"0" + calcdate.getDate();
						} else {
							formatDate += "-" +calcdate.getDate();
						}
						formatDate += "-" + calcdate.getFullYear();
						dates.push(formatDate);
					}	
					var firstDay = new Date(dates[0]);
					var lastDay = new Date(dates[dates.length-1]);
					lastDay.setHours(23);
					lastDay.setMinutes(59);
					lastDay.setSeconds(59);	
					Details.findOne({"email": request.query.email}, function(err, Provider) {
						if(err)
							reply(Boom.forbidden(error(err)))
						if(!Provider)
							reply(Boom.notFound("No such user"));
						if(Provider) {
							getProvider = Provider;							
							calclocation(0);													
						}
					});
				}
				
				if(request.query.type === 'personal') {
					if(request.query.view === undefined) {
						Details.findOne({"email": request.query.email}, function(err, getProvider) {
							if(err)
								reply(Boom.forbidden(error(err)));
							if(!getProvider)
								reply(Boom.notFound("No such provider registered with us"));
							if(getProvider) {
								var dob = formattedDate(getProvider.dob);
								var result = {
									category: getProvider.category,
									specialty: getProvider.specialty,
									title: getProvider.title,
									firstName: getProvider.firstName,
									lastName: getProvider.lastName,
									gender: getProvider.gender,
									dob: dob,
									zipCode: getProvider.zipCode,
									email: getProvider.email,
									webSite: getProvider.webSite,
									notification: getProvider.notification,
									cash: getProvider.cash,
									offer: getProvider.offer,
									cancellationNumber: getProvider.cancellationNumber
								}
								reply({providerDetails:result});
							}
						});
					}
					if(request.query.view === 'tiny') {
						Details.findOne({"email": request.query.email}, {'title':1, 'firstName':1, 'lastName':1, 'image':1, '_id':0, 'email':1}, function(err, getProvider) {
							if(err)
								reply(Boom.forbidden(error(err)));
							if(!getProvider)
								reply(Boom.notFound("No such provider registered with us"));
							if(getProvider) {
								var result = {									
									title: getProvider.title,
									firstName: getProvider.firstName,
									lastName: getProvider.lastName,
									email: getProvider.email,
									image: getProvider.image
								}
								reply({providerDetails:result});
							}
						});
					}
				}
				if(request.query.type === 'location') {
					Details.findOne({"email": request.query.email, "location.locId": request.query.locId},
						{'location':1, '_id':0}, function(err, getProvider) {
							if(err)
								reply(Boom.forbidden(error(err)));
							if(!getProvider)
								reply(Boom.notFound("No such location for this provider"));
							if(getProvider) {								
								for(var i =0; i<(getProvider.location).length; i++) {	
									if(getProvider.location[i].locId === request.query.locId) {
										var result = {												
											practiceName: getProvider.location[i].practiceName,
											address: getProvider.location[i].address,
											city: getProvider.location[i].city,
											state: getProvider.location[i].state,
											zip: getProvider.location[i].zip,
											phone1: getProvider.location[i].phone1,
											phone2: getProvider.location[i].phone2,
											fax: getProvider.location[i].fax
										}
										reply({providerLocation:result});
									}									
								}
							}
						}
					);
				}
				if(request.query.type === 'alllocation') {
					Details.findOne({"email": request.query.email}, function(err, getProvider) {
							if(err)
								reply(Boom.forbidden(error(err)));
							if(!getProvider)
								reply(Boom.notFound("No such location for this provider"));
							if(getProvider) {
								var locationArray=[];
								for(var i =0; i<(getProvider.location).length; i++) {										
									var result = {																								
										address: getProvider.location[i].address+','+getProvider.location[i].city+','+getProvider.location[i].state+','+getProvider.location[i].zip,
										locId: getProvider.location[i].locId												
									}
									locationArray.push(result);										
								}	
								reply({providerLocations:locationArray});							
							}
						}
					);
				}

				if(request.query.type === 'accreditation') {
					Details.findOne({"email": request.query.email}, function(err, getProvider) {
						if(err)
							reply(Boom.forbidden(error(err)));
						if(!getProvider)
							reply(Boom.notFound("No such provider registered with us"));
						if(getProvider) {
							var result = {
								school: getProvider.school,
								residency: getProvider.residency,
								fellowship: getProvider.fellowship,
								affilliation: getProvider.affilliation,
								languages: getProvider.languages,
								insurance: getProvider.insurance,
								statement: getProvider.statement
							}
							reply({providerAccreditation:result});
						}
					});
				}	
							
			}
		}
	});
};

// for update provider details
exports.updatedetails = function(server) {
	server.route({
		method: "PUT",
		path: "/v1/updateProvider",
		config: {
			auth: "session",
			validate: {
				query: {
					email: Joi.string().email().required(),
					type: Joi.string().required(),
					locId: Joi.string()
				},
				payload: {
					category: Joi.string(),
					specialty: Joi.string(),
					title: Joi.string(),
					firstName: Joi.string(),
					lastName: Joi.string(),
					zipCode: Joi.string().min(5).max(5),
					gender: Joi.string(),
					dob: Joi.date(),
					webSite: Joi.string(),
					notification: Joi.string().email(),
					cash: Joi.string(),
					offer: Joi.string(),
					cancellationNumber: Joi.string().min(10).max(15),
					school: Joi.string(),
					residency: Joi.string(),
					fellowship: Joi.string(),
					affilliation: Joi.string(),
					languages: Joi.array(),
					insurance: Joi.array(),
					statement: Joi.string(),
					location: Joi.array(),
					plan: Joi.string(),
					billing: Joi.string(),
					price: Joi.string(),
					total: Joi.string(),
				}
			},
			handler: function(request, reply) {
				var userobjid, updateuser, provider,
					userRole = request.auth.credentials.role.title; 
		    	var email = request.auth.credentials.profile.email; 	
		    	var username = request.auth.credentials.username;
		    	console.log('credentials are ', JSON.stringify(request.auth.credentials));	
		    	function sendEmail(){
			    	var template = swig.compileFile('./mailTemplates/updateAdmin.html');
				    var output = template({
				        pagename: 'Provider updated',
				        name: username,
				        message: 'updated provider ('+request.payload.email+') details '
				    });
			    	var data = {
			    		from: 'mdTree <no-reply@mdtree.com>',					    		
			    		to: email,
			    		subject: 'Provider details updated', 
			    		html: output
			    	}
			    	if(request.auth.credentials.role.title != adminAuth.title)
			    		data.cc = 'mdTree <admin@mdtree.com>'

			    	sendMail.templates(data, function(sendemail) {
			    		console.log('Mail has been sent');
			    	});	    	
			    }
				if( request.query.email != email && userRole != adminAuth.title && userRole != salesManagerrole.title && userRole != salesAdminrole.title) 
					reply(Boom.forbidden("Cannot update other's details"));
				else {
					if(request.query.type === 'location' && request.query.locId === 'new') {						
						Details.findOne({"email": request.query.email}, function(err, getProvider) {
							if(err)
								reply(err)
							if(!getProvider)
								reply(Boom.notFound("No such provider"));
							if(getProvider) {
								var location=[], len = 0;
								for(var i=0; i<(getProvider.location).length; i++) {
									len = (getProvider.location).length;
									location.push(getProvider.location[i]);
								}
								var addlocation = {										
									locId: request.query.email+len,
									practiceName: request.payload.location[0].practiceName,
									address: request.payload.location[0].address,
									state: request.payload.location[0].state,
									city: request.payload.location[0].city,
									zip: request.payload.location[0].zip,
									phone1: request.payload.location[0].phone1,
									phone2: request.payload.location[0].phone2,
									fax: request.payload.location[0].fax
								}
								if(addlocation.address === '' || addlocation.zip === '' || addlocation.city === '' || addlocation.state === '' || addlocation.phone1 === '') 
									reply(Boom.badRequest('Request with all mandatory details'));
								if(addlocation.address != ''  && addlocation.zip != '' && addlocation.city != '' && addlocation.state != '' && addlocation.phone1 != '')  {
									location.push(addlocation);
									Details.update({"email": request.query.email},
										{$set: {"location": location}}, function(err, update) {
											if(err)
												reply(Boom.forbidden(error(err)))
											if(update) {
												sendEmail();
												reply("Updated Successfully");
											}
										}
									);
								}
							}
						});
					}	

					else if(request.query.type === 'location' && request.query.locId != undefined) {						
						Details.findOne({"email": request.query.email, "location.locId": request.query.locId}, 
							{"location.$":1},
							function(err, location) {
								if(err)
									reply(Boom.forbidden(error(err)))
								if(!location) 
									reply(Boom.notFound("No such location for this provider"));
								if(location) {
									console.log('edit location');
									var editLocation = {										
										locId: request.query.locId,
										practiceName: request.payload.location[0].practiceName,
										address: request.payload.location[0].address,
										state: request.payload.location[0].state,
										city: request.payload.location[0].city,
										zip: request.payload.location[0].zip,
										phone1: request.payload.location[0].phone1,
										phone2: request.payload.location[0].phone2,
										fax: request.payload.location[0].fax
									}
									console.log('address', editLocation.address, 'zip', editLocation.zip, 'city', editLocation.city, ' state ', editLocation.state, ' phone1 ', editLocation.phone1);
									if(editLocation.address === '' || editLocation.city === '' || editLocation.state === '' || editLocation.phone1 === '' || editLocation.zip === '') 
										reply(Boom.badRequest('Request with all mandatory details'));
									if(editLocation.address != '' && editLocation.city != '' && editLocation.state != '' && editLocation.phone1 != '' && editLocation.zip != '')  {
										Details.update({"email": request.query.email, "location.locId": request.query.locId},
											{$set: {"location.$": editLocation}}, function(err, update) {
												if(err)
													reply(Boom.forbidden(error(err)))
												if(update) {
													sendEmail();
													reply("Updated Successfully");
												}
											}
										);
									}
								}
							}
						);
					}

					if(request.query.type === 'accreditation' && request.query.type != 'location')	{
						if(request.payload.languages === undefined || request.payload.school === undefined) 
							reply(Boom.badRequest('Request with all mandatory details'));
						if(request.payload.languages != undefined && request.payload.school != undefined)  {
							var languages =[], insurance=[];
							for(var i=0; i<(request.payload.languages).length; i++) {
								languages.push(request.payload.languages[i]);
							}
							if(request.payload.insurance != undefined) {
								for(var i=0; i<(request.payload.insurance).length; i++) {
									insurance.push(request.payload.insurance[i].toLowerCase());
								}	
							}	
							var query = {
								"school": request.payload.school,
								"residency": request.payload.residency,
								"fellowship": request.payload.fellowship,
								"affilliation": request.payload.affilliation,
								"statement": request.payload.statement,
								"languages": languages,
								"insurance": insurance
							}			
							if(request.payload.residency === undefined)			
								delete query.residency;
							if(request.payload.fellowship === undefined)			
								delete query.fellowship;
							if(request.payload.affilliation === undefined)			
								delete query.affilliation;
							if(request.payload.statement === undefined)			
								delete query.statement
							if(request.payload.insurance === undefined)			
								delete query.insurance
							Details.update(
								{"email": request.query.email},
								{$set: query},
								function( err, updated) {
									if(err) reply(Boom.forbidden(error(err)));
									if(updated) {
										sendEmail();
										reply('Updated Successfully').code(200);
									}
								}
							);
						}
					}

					if(request.query.type === 'personal' && request.query.type != 'location') {
						if(request.payload.zipCode === undefined || request.payload.category === undefined || request.payload.specialty === undefined || request.payload.firstName === undefined || request.payload.lastName === undefined || request.payload.title === undefined || request.payload.dob === undefined || request.payload.notification === undefined || request.payload.cancellationNumber === undefined || request.payload.cash === undefined)
							reply(Boom.badRequest('Request with all mandatory details'));						
						if(request.payload.zipCode != undefined && request.payload.category != undefined && request.payload.specialty != undefined && request.payload.firstName != undefined && request.payload.lastName != undefined && request.payload.title != undefined && request.payload.dob != undefined && request.payload.notification != undefined && request.payload.cancellationNumber != undefined && request.payload.cash != undefined) {
							var query = {
								"category": request.payload.category,
								"specialty": request.payload.specialty,
								"title": request.payload.title,
								"firstName": request.payload.firstName,
								"lastName": request.payload.lastName,
								"dob": request.payload.dob,
								"gender": request.payload.gender,
								"zipCode": request.payload.zipCode,
								"webSite": request.payload.webSite,
								"notification": request.payload.notification,
								"cash": request.payload.cash,
								"offer": request.payload.offer,
								"cancellationNumber": request.payload.cancellationNumber							
							}
							if(request.payload.gender === undefined) 
								delete query.gender;
							if(request.payload.webSite === undefined) 
								delete query.webSite;
							if(request.payload.offer === undefined) 
								delete query.offer;
							Details.update({"email": request.query.email}, {$set: query}, function(err, updatedetails) {
								if(err) reply(Boom.forbidden(error(err)));
								if(updatedetails) {
									SignUp.update({"email": request.query.email}, {$set: {"username": request.payload.firstName}}, function(err, updateuser) {
										if(err) reply(Boom.forbidden(error(err)))
										if(updateuser) {
											sendEmail();
											reply('Updated Successfully').code(OK);
										}
									});
								}
							});

						}
					}					
				}
			}			
		}
	});
};

// create special offer for provider
exports.offer = function(server) {
	server.route({
		method: 'PUT',
		path: '/v1/offer',
		config: {
			auth: 'session',
			validate: {
				query: {
					email: Joi.string().email().required()
				},
				payload: {
					location: Joi.array().required(),
					startDate: Joi.string().required(),
					endDate: Joi.string().required(),
					title: Joi.string().required(),
					description: Joi.string().required()
				}				
			},
			handler: function(request, reply) {	
				if(request.query.email != request.auth.credentials.profile.email)
					reply(Boom.forbidden("Cannot change other's details"));
				if(request.query.email === request.auth.credentials.profile.email) {
					var specialOfferId = new Date().getTime();
					// console.log('offerId ', specialOfferId);
					var firstdate = request.payload.startDate;
					var seconddate = request.payload.endDate;
					var minutes = 1000*60;
					var hours = minutes*60;
					var days = hours*24;
					var foo_date1 = getDateFromFormat(firstdate, "M-d-y");
					var foo_date2 = getDateFromFormat(seconddate, "M-d-y");
					var diffDays = Math.round((foo_date2 - foo_date1)/days);
					var firstDate = new Date(firstdate);
					var secondDate = new Date(seconddate);
					var offerDates = [];
					var dateStr=firstdate; 
					var d=dateStr.split("-");
					var calcdate = new Date(d[2],(d[0]-1),(d[1]));
					var tempDate = firstdate;					
					if(tempDate) {       
						for (var i=0; i<=(diffDays); i++) {
							var formattDate = "";
							if (calcdate.getMonth()<9) {
								formattDate += "0" + (calcdate.getMonth()+1);
							} else {
								formattDate += (calcdate.getMonth()+1);
							}
							if (calcdate.getDate()<10) {
								formattDate += "-" +"0" + calcdate.getDate();
							} else {
								formattDate += "-" +calcdate.getDate();
							}
							formattDate += "-" + calcdate.getFullYear();
							var dayInlist = calcdate.getDay();
							offerDates.push(formattDate);
							calcdate.setDate(calcdate.getDate() + 1);
						}
					}   
					console.log('offerId ', specialOfferId);
					var offerRecord = new offerReport();
					offerRecord.fromDate = firstdate;
					offerRecord.toDate = seconddate;
					offerRecord.offerId = specialOfferId;
					offerRecord.title = request.payload.title;
					offerRecord.description = request.payload.description;
					offerRecord.createdBy = request.query.email;
					offerRecord.save(function(err, offerrecord) {
						if(err)
							reply(Boom.forbidden(error(err)));
						else if(!offerrecord)
							reply(Boom.forbidden('Not able to create offer'));
						else if(offerrecord) {
							_.each(request.payload.location, function(location) {
								_.each(offerDates, function(date) {
									var query = {
										'prov': request.query.email, 
										'loc': location, 
										'date':date
									}
									console.log('offerId ', specialOfferId);
									Appointments.update(query, {$set: {'prov': query.prov, 'loc': query.loc, 'date': query.date, 'specialOffer.description': request.payload.description, 'specialOffer.title': request.payload.title, 'specialOffer.offerId': parseInt(specialOfferId)}},
										{upsert: true}, function(err, update) {
											console.log(update);
											if(err)
												reply(Boom.forbidden(error(err)));
											if((location === request.payload.location[request.payload.location.length-1]) && (date === offerDates[offerDates.length-1]))
												reply('Updated Successfully').code(OK);
										}
									);
								});
							});
						}
					});						
				}
			}
		}
	});
};

// list of dates in which appointments created
exports.slottedDate = function(server) {
	server.route({
		method:'GET',
		path:'/v1/slottedDate',
		config: {
			validate: {
				query: {
					email: Joi.string().required()
				}
			},
			handler: function(request, reply) {
				Array.prototype.has = function(v) {
					for (var l=0;l<this.length; l++) {
						if(this[l]==v) {
							return l+1;
						}
					}
					return false;
				}
				Details.findOne({'email': request.query.email}, function(err, getProvider) {
					if(err)	reply(Boom.forbidden(error(err)));
					if(!getProvider)	reply(Boom.notFound('No such provider'));
					if(getProvider) {
						Date.prototype.today = function () { 
							return (((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) + "-"+ ((this.getDate() < 10)?"0":"") + this.getDate() +"-"+ this.getFullYear();
						}		
						var now = new Date();										
						var checkDate = new Date(now.today());
						console.log('checkDate ', checkDate, new Date());
						Appointments.aggregate({$match: {'prov': request.query.email, 'date':{$gte: checkDate}}}, {$project: {'date':1, '_id':0, 'slots':1}}, function(err, dates) {
							console.log('dates are ', JSON.stringify(dates));
							var bookedDates=[];
							if(err)	reply(Boom.forbidden(error(err)));
							if(!dates) reply(Boom.notFound('No slots created by this provider'));
							if(dates){								
								for(var index=0; index<dates.length; index++) {
									console.log(JSON.stringify(dates[index]));
									if(dates[index].slots) {
										if(dates[index].slots.length > 0) {
											if(!bookedDates.has(dates[index].date)) {
												var formatDate = (dates[index].date).today();
												bookedDates.push(formatDate);
											}
										}
									}
								}
								reply({slotCreatedDates:bookedDates.sort()});						
							}
						});
					}
				});
			}
		}
	});
};

// dump file upload
exports.readFile = function(server) {
	server.route({
		method: 'POST',
		path: '/v1/uploadDump',
		config: {
			auth: 'session',
			payload: {
				output: 'file',
		        maxBytes: 20971520000,
		        uploads: './temp',
		        parse: true,
			},
			validate: {
				payload: {
					dumpFile: Joi.object().required()
				}
			},
			handler: function(request, reply) {
				var userRole = request.auth.credentials.role.title; 
				if( userRole === adminAuth.title || userRole === salesManagerrole.title || userRole === salesAdminrole.title) {
				// if(request.auth.credentials.type === adminAuth.title)  {
					if (request.payload.dumpFile) {
				        file = request.payload.dumpFile;
				        console.log('file is ', file);
				        var extn = (file.filename).substr((file.filename).indexOf('.')+1),
				        	// path = (file.path).substr((file.path).indexOf('/')+1),
				        	path = (file.path).replace(/^.*[\\\/]/, ''),
				    		filename = path+'.'+extn;
				        	Fs.rename(file.path, './providerDump/'+filename, function(err) {
				            if (err) 
				            	reply(Boom.forbidden(error(err)));
				            else {
				            	// reply('File uploaded successfully').code(OK);
				            
								var pathToFile = './providerDump/'+filename;
								 
								var singleLine = [];
								var CategoryJson = [{id:"Doctors",key:"doctors"},{id:"Dentists",key:"dentists"},{id:"Chiropractors",key:"chiropractors"},
   									{id:"Vision/Hearing",key:"vision"},{id:"Other Providers",key:"others"}];
							    var DoctorsJson = [
							    {key:"doc_spl_2",value:"Allergy & Immunology"},
							    {key:"doc_spl_50",value:"Anesthesiology"},
							    {key:"doc_spl_3",value:"Bariatric Surgery"},
							    {key:"doc_spl_4",value:"Cardiology"},
							    {key:"doc_spl_5",value:"Chiropractic Medicine"},
							    {key:"doc_spl_6",value:"Dermatology"},
							    {key:"doc_spl_7",value:"Developmental-Behavioral"},
							    {key:"doc_spl_51",value:"Ear, Nose & Throat"},
							    {key:"doc_spl_52",value:"Emergency Medicine"},
							    {key:"doc_spl_8",value:"Endocrinology & Metabolism"},
							    
							    {key:"doc_spl_57",value:"Family Medicine"},
							    {key:"doc_spl_9",value:"Family Practice"},
							    {key:"doc_spl_10",value:"Gastroenterology"},
							    {key:"doc_spl_11",value:"Gerontology"},
							    {key:"doc_spl_12",value:"Gynecologic Oncology"},
							    {key:"doc_spl_13",value:"Hematology/Oncology"},
							    {key:"doc_spl_14",value:"Hospice & Palliative Medicine"},
							    {key:"doc_spl_15",value:"Infectious Disease"},
							    {key:"doc_spl_16",value:"Internal Medicine"},
							    {key:"doc_spl_17",value:"Neonatology"},
							    {key:"doc_spl_18",value:"Nephrology"},
							    {key:"doc_spl_19",value:"Neurology"},
							    {key:"doc_spl_58",value:"Neurological Surgery"},
							    {key:"doc_spl_53",value:"Neuropsychologist"},
							    
							    {key:"doc_spl_20",value:"Obstetrics & Gynecology"},
							    {key:"doc_spl_21",value:"Occupational Medicine"},
							    {key:"doc_spl_22",value:"Ophthalmology"},
							    {key:"doc_spl_23",value:"Optometry"},
							    {key:"doc_spl_54",value:"Oral & Maxillofacial Surgery"},
							    
							    {key:"doc_spl_24",value:"Orthopaedic Surgery"},
							    {key:"doc_spl_25",value:"Otorhinolaryngology"},
							    {key:"doc_spl_26",value:"Pain Management"},
							    {key:"doc_spl_59",value:"Pain Medicine"},
							    {key:"doc_spl_26",value:"Pathology"},

							    {key:"doc_spl_27",value:"Pediatric Otolaryngology"},
							    {key:"doc_spl_28",value:"Pediatrics"},
							    {key:"doc_spl_29",value:"Perinatology"},
							    {key:"doc_spl_30",value:"Physical Medicine & Rehabilitation"},
							    {key:"doc_spl_31",value:"Physical Therapy"},
							    {key:"doc_spl_32",value:"Plastic Surgery"},
							    {key:"doc_spl_33",value:"Podiatrist"},
							    {key:"doc_spl_34",value:"Preventive Medicine"},
							    {key:"doc_spl_55",value:"Prosthetics"},
							    {key:"doc_spl_35",value:"Psychiatry"},
							    {key:"doc_spl_36",value:"Psychology"},
							    {key:"doc_spl_37",value:"Pulmonology"},
							    {key:"doc_spl_38",value:"Radiology"},
							    {key:"doc_spl_39",value:"Reproductive Endocrinology/Infertility"},
							    {key:"doc_spl_40",value:"Rheumatology"},
							    {key:"doc_spl_41",value:"Sleep Medicine"},
							    {key:"doc_spl_42",value:"Sports Medicine"},
							    {key:"doc_spl_60",value:"Surgery"},
							    
							    {key:"doc_spl_43",value:"Surgery, Colon & Rectal"},
							    {key:"doc_spl_44",value:"Surgery, General"},
							    {key:"doc_spl_45",value:"Surgery, Hand"},
							    {key:"doc_spl_46",value:"Surgery, Thoracic"},
							    {key:"doc_spl_47",value:"Surgery, Urology"},
							    {key:"doc_spl_48",value:"Surgery, Vascular"},
							    {key:"doc_spl_56",value:"Thoracic Surgery"},
							    {key:"doc_spl_56",value:"Urology"},
							    {key:"doc_spl_49",value:"Other"}
							    ];
							    var dentistslists = [
						        {key:"den_spl_0",value:"Dental Care"},
						        {key:"den_spl_0",value:"Dental Hygiene"},
						        {key:"den_spl_2",value:"Endodontics"},
						        {key:"den_spl_3",value:"General Dentistry"},
						        {key:"den_spl_4",value:"Oral and Maxillofacial Radiology"},
						        {key:"den_spl_5",value:"Oral and Maxillofacial Surgery"},
						        {key:"den_spl_6",value:"Oral Pathology"},
						        {key:"den_spl_7",value:"Orthodontics"},
						        {key:"den_spl_8",value:"Pediatric Dentistry"},
						        {key:"den_spl_9",value:"Periodontics"},
						        {key:"den_spl_10",value:"Prosthodontics"},
						        {key:"den_spl_11",value:"Other"}
						        ];
							    var chiropractors = [
        
						        {key:1,value:"Chiropractic"}
						        ];
							    var vision = [
							        {key:"vh_spl_2",value:"Audiology"},
							        {key:"vh_spl_3",value:"Eye Doctor"},
							        {key:"vh_spl_4",value:"Hearing Specialist"},
							        {key:"vh_spl_5",value:"Ophthalmologist"},
							        {key:"vh_spl_6",value:"Optometrist"}
							    ];
							    var titleJson = [{id:"Dr.",key:"Dr."},{id:"Mr.",key:"Mr."},{id:"Mrs.",key:"Mrs."}];
								function readFile(callback) {
								  	Fs.readFile(pathToFile, function (err, data) {
									    _.each(data.toString().split('\n'), function(word) {
									  		singleLine.push(word.split('\t'));						  				  		
									  	});
									    callback();
									});
								}

								function printLine() {
								  	var errorList = [], failureList = [], successList = [];							  	
								  	
								  	insert(0);
								  	function insert(index) {
								  		console.log('processing ',index, ' of ', singleLine.length);
								  		if(index === singleLine.length) {
								  			console.log('last index');
								  			var result = {
												success: successList,
												falied: failureList,
												err: errorList
											}
											console.log(JSON.stringify({dumpProvider:result}));
											reply({dumpProvider:result});
								  		}
									  	// if(index < singleLine.length) {
									  	else {
									  		var selectedSpecialty, insertSpecialty, insertCategory, insertTitle, insertGender;
									  		var selectedCategory, selectedTitle;
									  		if(singleLine[index][1] && singleLine[index][1] != undefined)
									  			selectedCategory =  _.findWhere(CategoryJson, {id:singleLine[index][1]});
										  	if(selectedCategory && selectedCategory != undefined)
										  		insertCategory = selectedCategory.key;

									  		if(singleLine[index][2] && singleLine[index][2] != undefined && selectedCategory != undefined) {
										  		if(selectedCategory.key === 'doctors')
										  			selectedSpecialty = _.findWhere(DoctorsJson, {value: singleLine[index][2]});
										  		else if(selectedCategory.key === 'dentists')
										  			selectedSpecialty = _.findWhere(dentistslists, {value: singleLine[index][2]});
										  		else if(selectedCategory.key === 'chiropractors')
										  			selectedSpecialty = _.findWhere(chiropractors, {value: singleLine[index][2]});
										  		else if(selectedCategory.key === 'vision')
										  			selectedSpecialty = _.findWhere(vision, {value: singleLine[index][2]});
										  		else if(selectedCategory.key === 'others')
										  			selectedSpecialty = (singleLine[index][2]);
										  	}
									  		if(selectedSpecialty && selectedSpecialty != undefined)
									  			insertSpecialty = selectedSpecialty.key;

									  		if(singleLine[index][3] && singleLine[index][3] != undefined) 
									  			selectedTitle = _.findWhere(titleJson, {id:singleLine[index][3]});

									  		if(selectedTitle)
									  			insertTitle = selectedTitle.key;

									  		if(singleLine[index][6] === 'M' || singleLine[index][6] === 'm')
									  			insertGender = 'male';
									  		else if(singleLine[index][6] === 'F' || singleLine[index][6] === 'f')
									  			insertGender = 'female';
	// NPI - 0	Category - 1	Specialty -2	Title -3	FirstName - 4	LastName -5	Gender-6	Address1 -7	Address2 -8	
	// City-9	State-10	Zip - 11	PhoneNumber1 -12	PhoneNumber2 - 13	FaxNumber-14	School -15
	// NPI	Category	Specialty	Title	FirstName	LastName	Gender	Address1	Address2	
	// City	State	Zip	PhoneNumber1	PhoneNumber2	FaxNumber	School
									  		// var dump = new dumpProvider();
									  		var dumpInsurance = [];
									  		dumpInsurance.push('insure_1');
									  		var dump = {
									  			'npi': singleLine[index][0],
									  			'insurance': dumpInsurance,
									  			'subscription.planType': 'free',
									  			'image': './userimage/nopic.jpeg',
									  			'rating': 4,
									  			'createdAt': new Date(),
									  			't':'pdtls'
									  		};
									  		if(insertCategory && insertCategory != undefined)
									  			dump.category = insertCategory;
									  		if(insertSpecialty && insertSpecialty != undefined)
									  			dump.specialty = insertSpecialty;
									  		if(insertTitle && insertTitle != undefined)
									  			dump.title = insertTitle;
									  		else
									  			dump.title = "Dr.";

									  		if(singleLine[index][4])
									  			dump.firstName = singleLine[index][4];
									  		else
									  			dump.firstName = 'provider';

									  		if(singleLine[index][5])
									  			dump.lastName = singleLine[index][5];
									  		else
									  			dump.lastName = 'mdtree';

									  		if(insertGender && insertGender != undefined)
									  			dump.gender = insertGender;
									  		else
									  			dump.gender = 'male';


									  		var address, city, zip, phoneNumber1, phoneNumber2, faxNumber;	
									  		var location = {
									  			'locId': dump.npi+'0',
									  			'practiceName': 'mdtree clinic',
									  			'address': singleLine[index][7]+', '+singleLine[index][8],
									  			'city': singleLine[index][9],
									  			'state': singleLine[index][10],
									  			'phone1': singleLine[index][12],
									  			'phone2': singleLine[index][13],
									  			'fax': singleLine[index][14]
									  		}
									  		// console.log(singleLine[index][11], ' zip');
									  		// console.log(typeof(singleLine[index][11]));
									  		var dumpLocation = [];
									  		if(singleLine[index][11] || singleLine[index][11] != undefined) {					  		
										  		if((singleLine[index][11]).length>5) {
										  			location.zip = (singleLine[index][11]).substr(0,5);
										  			location.fullZip = singleLine[index][11];
										  			dumpLocation.push(location);
										  		}
										  		else {
										  			location.zip = singleLine[index][11];
										  			dumpLocation.push(location);
										  		}
										  	}
										  	dump.location = dumpLocation;


									  		// var location = {
									  		// 	'locId': dump.npi+'0',
									  		// 	'practiceName': 'mdtree clinic',
									  		// 	'state': 'CA',
									  		// 	'city': 'Los Angeles',
									  		// 	'zip': '90001'
									  		// };
									  		// dump.location.push(location);
											if(singleLine[index][15] || singleLine[index][15] != undefined)
									  			dump.school = singleLine[index][15].replace('\r','');
									  		else
									  			dump.school = 'mdtree school';	

									  		
									  		var signup = {
									  			email: dump.npi
									  		}
											signup.question = 5;
											
											signup.role = {
												'title': providerAuth.title,
												'bitMask': providerAuth.bitMask
											}
											// signup.title = providerAuth.title;
											// signup.bitMask = providerAuth.bitMask;
											signup.username = dump.firstName ;
											
									  		bcrypt.genSalt(crypt.salt, function(err, salt) {
												bcrypt.hash('usmdtree', salt, function(err, hash) {
													bcrypt.genSalt(crypt.salt, function(err, salt) {
														bcrypt.hash('mdtree', salt, function(err, hashedAnswer) {
															signup.answer = hashedAnswer;
															signup.password = hash;
															// console.log('\n\nSignUp data', JSON.stringify(signup));
															// console.log('dump data ', JSON.stringify(dump));
															SignUp.update({'email': dump.npi}, signup, {upsert:true}, function(err, loginSignup) {
																if(err) {
													  				var errorrr = Boom.forbidden(error(err));
													  				console.log(errorrr);
													  				// console.log(errorrr.message.output.payload);
													  				var errorMsg = {
													  					'messsage': errorrr,
													  					'unicode': dump.npi,
													  					'provider': dump.firstName
													  				}
													  				errorList.push(errorMsg);
													  				console.log(index, ' - Signup error - ',dump.npi);
													  				// for normal upload
													  				// insert(index+1);

													  			}
													  			else if(!loginSignup) {
													  				var falied = {
													  					'messsage': 'Not able to inserted',
													  					'unicode': dump.npi,
													  					'provider': dump.firstName
													  				}
													  				failureList.push(falied);
													  				console.log(index, ' - Signup failed - ',dump.npi);
													  				// for normal upload
													  				// insert(index+1);
													  			}
													  			else if(loginSignup) {
													  				dumpProvider.update({'npi': dump.npi}, dump, {upsert:true}, function(err, newProvider) {
													  					if(err) {
															  				var errorrr = Boom.forbidden(error(err));
															  				console.log(errorrr);
							  												// console.log(errorrr.message.output.payload);
															  				var errorMsg = {
															  					'messsage': errorrr,
															  					'unicode': dump.npi,
															  					'provider': dump.firstName
															  				}
															  				errorList.push(errorMsg);
															  				console.log(index, ' - Error - ',dump.npi);
															  				// for normal upload
															  				// insert(index+1);
															  			}
															  			else if(!newProvider) {
															  				var falied = {
															  					'messsage': 'Login created not able to insert details',																  					
															  					'unicode': dump.npi,
															  					'provider': dump.firstName
															  				}
															  				failureList.push(falied);
															  				console.log(index, ' - Failed - ',dump.npi);
															  				// for normal upload
															  				// insert(index+1);
															  			}
															  			else if(newProvider) {
															  				var successing = {
															  					'messsage': 'Successfully inserted',
															  					'unicode': dump.npi,
							  													'provider': dump.firstName
															  				}
															  				successList.push(successing);
															  				console.log(index, ' - Success - ',dump.npi);
															  				// for normal upload
															  				// insert(index+1);
															  			}
													  				});
													  			}
															});
														});
													});
												});
											});
											//for upload in production 
											insert(index+1);
										}
									}
								}			 
								readFile(printLine);
							}
						});	
				    }
				}
				else
					reply(Boom.unauthorized('Not authorized to upload dump'));
			}
		}
	});
};

// list of special offers created by provider
exports.listOffer = function(server) {
	server.route({
		method: 'GET',
		path: '/v1/listOffer',
		config: {
			auth: 'session',
			validate: {
				query: {
					email: Joi.string().email().required(),
					month: Joi.string(),
					year: Joi.string(),
					fromDate: Joi.string(),
					toDate: Joi.string()
				}
			}
		},
		handler: function(request, reply) {
			var userRole = request.auth.credentials.role.title; 							
			if(request.query.email === request.auth.credentials.profile.email || userRole === adminAuth.title ) {
				var appointmentArray;
				var matchString1 = {
					'prov': request.query.email,
					'slots.patient.offer': {$exists:true}
				}
				Array.prototype.has = function(v) {
					for (var l=0;l<this.length; l++) {
						if(this[l]==v) {
							return l+1;
						}
					}
					return false;
				}
				Date.prototype.today = function () { 
					return (((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) + "-"+ ((this.getDate() < 10)?"0":"") + this.getDate() +"-"+ this.getFullYear();
				}
				// var givenYear = new Date().getFullYear();
				var m, y, d=1, date, firstDay, lastDay;
				if(request.query.month && request.query.year) {
					m = request.query.month - 1;
					y = request.query.year;
					date = new Date(y,m,d);
					firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
					lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
					lastDay.setHours(23);
					lastDay.setMinutes(59);
					lastDay.setSeconds(59);
				}
				else if(request.query.fromDate && request.query.toDate) {
					firstDay = new Date(request.query.fromDate);
					lastDay = new Date(request.query.toDate);
					lastDay.setHours(23);
					lastDay.setMinutes(59);
					lastDay.setSeconds(59);
				}
				else {
					date = new Date();
					firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
					lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
					lastDay.setHours(23);
					lastDay.setMinutes(59);
					lastDay.setSeconds(59);
				}
				var matchData = {
					'createdBy': request.query.email,
		            'fromDate': { 
	                	$gte: firstDay, 
	                  	$lte: lastDay
	                }
	         	};	
	         	// if(request.query.year && !request.query.month) {         	
	         	// 	givenYear = request.query.year;			    
	         	// 	delete matchData.date;
	         	// } 
				offerReport.find(matchData, {'_id':0}, function(err, report) {
					if(err)
						reply(Boom.forbidden(error(err)));
					else if(!report) 
						reply(Boom.forbidden('No special offer created yet'));
					else if(report) {
						var result = [];
						if(report.length > 0) {
							Appointments.aggregate({$match: matchString1},{$group:{_id:'$slots.patient.offer.offerId'}},{$unwind:'$_id'},{$group: {_id:'$_id', count:{$sum:1}}}, function(err, appointments) {
								if(err)
									reply(Boom.forbidden(error(err)))
								else if(!appointments)
									reply(Boom.notFound('Special offer not yet created'));
								else if(appointments) {								
									appointmentArray = appointments;
									check(0);
								}
							});
							
							function check(index) {
								if(index == report.length) 
									reply({offerDetails: result})
								else {
									var data = {
										'title': report[index].title,
										'description': report[index].description,
										'createdAt': new Date(report[index].createdAt).today(),
										'fromDate': new Date(report[index].fromDate).today(),
										'toDate': new Date(report[index].toDate).today()
									}
									var resultJson = _.findWhere(appointmentArray, {'_id': report[index].offerId});
									if(resultJson || resultJson != undefined) {
										data.appointment = resultJson.count;
										result.push(data);
										check(index+1);
									}
									else {
										result.push(data);
										check(index+1);
									}
								}
							}
						}
						else
							reply({offerDetails: result})
					}
				});
			}
			else if(request.query.email != request.auth.credentials.profile.email)
				reply(Boom.forbidden("Cannot view other's details"));
		}
	});
};