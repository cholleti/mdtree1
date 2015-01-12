var Patient = require("../models/patient").Patient,
	patAppointments = require("../models/patientapptmnt").patientAppointments,
	SignUp = require("../models/signup").SignUp,
	Boom =  require("boom"),
	Joi = require("joi"),
	error = require('./config').errorMessage,
	_ = require("underscore"),
	status = require('./config').apptStatus,
	slotStatus = require('./config').slotStatus,
	http = require('./config').http,
    OK = http.get('OK').value,
	Details = require("../models/provdetails").Details,
	Appointments = require("../models/provappts").Appointments,
	sendMail = require('./config').sendingMail;
var swig  = require('swig');

module.exports = exports = function(server) {
	exports.timeschedule(server);
	exports.appointment(server);
	exports.modifyslots(server);
	exports.slotStatus(server);
};

// for booking an appointmnet
exports.appointment = function(server) {
	server.route({
		method: "PUT",
		path: "/v1/appointment",
		config: {		
			auth:'session',	
			validate: {
				payload: {
					location: Joi.string().required(),
					email: Joi.string().required(),
					provideremail: Joi.string().required(),
					date: Joi.string().required(),
					slot: Joi.string().required(),
					name: Joi.string().required(),
					phoneno: Joi.string().min(10).max(15),
					purpose: Joi.string().required(),
					gender: Joi.string(),
					message: Joi.string(),
					insurance: Joi.string()
				}
			},
			handler: function(request, reply) {
				var result, i;	
				Details.findOne({"email": request.payload.provideremail, "location.locId": request.payload.location},
					function(err, getProvider) {
						if(err)
							reply(Boom.forbidden(error(err)));
						if(!getProvider)
							reply(Boom.notFound("No such provider registered with this location"));
						if(getProvider != null) {
							// Patient.findOne({"email": request.payload.email}, function(err, patient) {
							// 	if(err)
							// 		reply(Boom.forbidden(error(err)));
							// 	if(!patient)
							// 		reply(Boom.notFound("No such user registered with us"));
							// 	if(patient) {	
									var timeTaken;								
									var patientdetail = {
										"name": request.payload.name,
										"email": request.payload.email,
										"phoneno": request.payload.phoneno,
										"gender": request.payload.gender,
										"purpose": request.payload.purpose,
										"message": request.payload.message,
										"insurance": request.payload.insurance
									}	
									console.log(request.payload.date, new Date(request.payload.date) )
									Appointments.findOne({"prov": request.payload.provideremail, "date": request.payload.date, 
										"loc": request.payload.location, "slots.from": request.payload.slot},
										{'slots':1, 'specialOffer':1, '_id':0}, 
										function(err, slot) {
											console.log('slot is ', JSON.stringify(slot));
											if(err) reply(Boom.forbidden(error(err)));
											if(!slot)
												reply(Boom.notFound('No such slots'));
											if(slot) {
												console.log('slot ', JSON.stringify(slot));
												function getSlot(id) {
												    return _.find(slot.slots, function(ctSlot) {
												        return ctSlot.from === id;
												    });
												}
												var bookSlot = getSlot(request.payload.slot);
												console.log('bookSlot ', bookSlot);
												if(bookSlot === undefined)
													reply('No slot at this time for this user');
												else {
													var user = bookSlot.by;
													var status = bookSlot.status;
													var startTime = bookSlot.at;
													var	today = new Date(),
														currentTime = ((today.getHours()+1)*60*60)+((today.getMinutes()+1)*60)+ (today.getSeconds()+1);
													timeTaken=Math.floor(Math.abs(currentTime - startTime)/60);
													if(status === slotStatus.Booked.string)
														reply(Boom.forbidden('Slot already booked'));
													else if(status === slotStatus.Available.string)
														reply(Boom.forbidden("Slot is open, didn't selected"));
													else if(status === slotStatus.Blocked.string) {
														if(user != request.auth.credentials.profile.email)
															reply(Boom.forbidden('Another user blocked this slot'));
														else {
															if(timeTaken <= slotStatus.Time.value) {
																console.log(slot.specialOffer);
																if(slot.specialOffer.title) {
																	patientdetail.offer = {
																		'offerId': slot.specialOffer.offerId,
																		'title': slot.specialOffer.title,
																		'description': slot.specialOffer.description
																	}
																	update();
																}
																else
																	update();
															}
															else {
																Appointments.update({"prov": request.payload.provideremail, "date": request.payload.date, 
																	"loc": request.payload.location, "slots.from": request.payload.slot}, 
																	{$set: {"slots.$.status": status.Available.string}},
																	function(err, updated) {
																		if(err) reply(Boom.forbidden(error(err)));
																		if(!updated)
																			console.log('not updated');	
																		if(updated)	{
																			Appointments.update({"prov": request.payload.provideremail, "date": request.payload.date, 
																				"loc": request.payload.location, "slots.from": request.payload.slot}, 
																				{$unset:{'slots.$.by':1, 'slots.$.at':1}}, function(err, unset) {
																					if(err)
																						reply(Boom.forbidden(error(err)));
																					if(!unset)
																						console.log('not updated');
																					if(unset) {
																						console.log('Session is Expired');
																						reply(Boom.clientTimeout('User time expired'));
																					}
																				}
																			);
																			
																		}
																	}
																);
															}
														}
													}
												}													
											}
										}
									);			
									function update() {
										console.log('time not expired');
										Appointments.update({"prov": request.payload.provideremail, "date": request.payload.date, 
											"loc": request.payload.location, "slots.from": request.payload.slot}, 
											{$set: {"slots.$.status": status.Booked.string, "slots.$.patient": patientdetail}},
											function(err, updated) {
												if(err)
													reply(Boom.forbidden(error(err)));
												if(!updated)
													reply(Boom.notFound("Appointments Not Available"));
												if(updated) {												
													var apptment = new patAppointments();								
													var name = getProvider.firstName+', '+getProvider.lastName;
													var providerPhone;
													var location;
													for(var i =0; i< (getProvider.location).length; i++) {
														if(getProvider.location[i].locId === request.payload.location) {
															apptment.loc.address =  getProvider.location[i].address;
															apptment.loc.city = getProvider.location[i].city;
															apptment.loc.state = getProvider.location[i].state;
															apptment.loc.zip = getProvider.location[i].zip;
															providerPhone = getProvider.location[i].phone1;
														}
													}
													apptment.date = request.payload.date;
													apptment.time = request.payload.slot;
													apptment.prov = name;
													apptment.provEmail = request.payload.provideremail;												
													apptment.reason = request.payload.purpose;
													apptment.patient = request.payload.email;
													apptment.offer = patientdetail.offer;

													apptment.save(function(err, patappt) {
														if(err)
															reply(Boom.forbidden(error(err)));
														if(patappt) {
															var template = swig.compileFile('./mailTemplates/appointmentProvider.html');
														    var output = template({
														        pagename: 'New Appointment for you',
														        firstName: getProvider.firstName,
														        name: request.payload.name,
														        date: request.payload.date,
														        time: request.payload.slot,
														        purpose: request.payload.purpose,
														        phone: request.payload.phoneno
														    });
													    	var data = {
													    		from: 'mdTree <no-reply@mdtree.com>',					    		
													    		to: request.payload.provideremail,
													    		subject: 'New appointment is booked by '+request.payload.name+' with you.', 
													    		html: output
													    	}
													    	sendMail.templates(data, function(sendemail) {
													    		var template = swig.compileFile('./mailTemplates/appointmentPatient.html');
															    var output = template({
															        pagename: 'Successfull appointment',
															        name: request.payload.name,
															        firstName: name,
															        date: request.payload.date,
															        time: request.payload.slot,
															        purpose: request.payload.purpose,
															        phone: providerPhone
															    });
														    	var data = {
														    		from: 'mdTree <no-reply@mdtree.com>',					    		
														    		to: request.payload.email,
														    		subject: 'Your appointment is successfully booked with '+getProvider.firstName, 
														    		html: output
														    	}
														    	sendMail.templates(data, function(sendemail) {
															    	console.log(sendemail);																	
														    	});
													    	});
															reply("Appointment booked successfully").code(OK);
														}
													});									
												}
										
											}
										);			
									}									
						// 		}									
						// 	}
						// );
					}
				});								
			}
		}		
	});
}

// for create slots
exports.timeschedule = function(server) {
	server.route({
		method: "POST",
		path: "/v1/timeschedule",
		config: {
			auth: 'session',
			validate: {
				payload: {
					email: Joi.string().email().required(),
					date: Joi.array().required(),
					slots: Joi.array().required()					
				}
			},
			handler: function(request, reply) {
				if(request.payload.email != request.auth.credentials.profile.email)
					reply(Boom.forbidden("Cannot change other's details"));
				if(request.payload.email === request.auth.credentials.profile.email) {
					var formatSlots = [], locations =[],element = {}, j;
					Array.prototype.has = function(v) {
						for (var l=0;l<this.length; l++) {
							if(this[l]==v) {
								return l+1;
							}
						}
						return false;
					}
					Details.findOne({"email": request.payload.email}, function(err, provider) {
						if(err)
							reply(Boom.forbidden(error(err)));
						if(!provider) 
							reply(Boom.notFound("No such provider exists"));
						if(provider) {
							function sortByKey(array, key) {
							    return array.sort(function(a, b) {
							        var x = a[key]; 
							        var y = b[key];
							        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
							    });
							}
							function reasign(value) {
								var data;
								if(value.indexOf('AM') > -1) 
						    		data = (value.replace('AM', ' AM'));					    		
								if(value.indexOf('PM') > -1)  
					    			data =  (value.replace('PM', ' PM'));				    		
					    		return data;
							}
							function sortByTime(array, key) {
							    return array.sort(function(a, b) {	
							    	var a = reasign(a[key]);
							    	var b = reasign(b[key]);				    	
							        var x = new Date('01-01-1970 ' + a); 						        
							        var y = new Date('01-01-1970 ' + b);
							        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
							    });
							}				
							var times= sortByTime((request.payload.slots), 'from');		
							var sorttedslots = sortByKey(times, 'locId');

							for(var i=0; i<sorttedslots.length;i++) {
								if(locations.has(sorttedslots[i].locId)) {
									var data = {
										"from": sorttedslots[i].from,
										"to": sorttedslots[i].to,
										"status": "available"
									}
									element.slots.push(data);
								}					
								if(!locations.has(sorttedslots[i].locId)) {
									var date = '24-08-2014',
									element ={};
									locations.push(sorttedslots[i].locId); 
									element = {
										"loc": sorttedslots[i].locId,
										"prov": request.payload.email,
										"date": date,
										"slots": [{
											"from": sorttedslots[i].from,
											"to": sorttedslots[i].to,
											"status": "available"
										}]
									}
									formatSlots.push(element);
								}
							}
							check(0);
							function check(count) {
								if(count<(request.payload.date).length) {
									j = count
									insert(0);
								}
								if(count >= (request.payload.date).length)
									reply("successfully inserted").code(OK);
							}
							function insert(k) {
								if(k< formatSlots.length) {
									formatSlots[k].date = (request.payload.date[j]);
									var appts = new Appointments(formatSlots[k]);
									Appointments.findOne({"prov": formatSlots[k].prov, "date": formatSlots[k].date,
										"loc": formatSlots[k].loc}, function(err, exists) {
											if(err)
												reply(Boom.forbidden(error(err)));
											if(exists) {
												if(exists.slots.length > 0) {
													var err = "You have already created an appointment on " + request.payload.date[j];
													reply(Boom.forbidden(err));
												}
											}
											if(!exists || exists.slots.length <= 0) {
												Appointments.update({"prov": formatSlots[k].prov, "date": formatSlots[k].date, "loc": formatSlots[k].loc}, 
													{$set: formatSlots[k]}, {upsert: true}, function(err, appointment) {
												// appts.save(function(err, appointment) {
													if(err)
														reply(Boom.forbidden(error(err)));
													if(appointment) {
														insert(k+1);
													}
												});			
											}
										}
									);
								}
								if(k>= formatSlots.length)
									check(j+1);
							};
						}
					});	
				}			
			}
		}
	});
}

// for modify existing slots
exports.modifyslots = function(server) {
	server.route({
		method: 'PUT',
		path: '/v1/modifyslots',
		config: {
			validate: {
				payload: {
					email: Joi.string().email().required(),
					date: Joi.string().required(),
					slots: Joi.array().required(),
					locId: Joi.string().required()
				}
			},
			handler: function(request, reply) {
				Details.findOne({"email": request.payload.email}, function(err, provider) {
					if(err)
						reply(Boom.forbidden(error(err)));
					if(!provider)
						reply(Boom.notFound("No such provider registered with us"));
					if(provider) {
						Appointments.findOne({"prov": request.payload.email, "loc": request.payload.locId,
							"date": request.payload.date}, {"slots":1,"_id":0}, function(err, appts) {
								if(err)
									reply(Boom.forbidden(error(err)));
								if(!appts) 
									reply(Boom.notFound("No appointments created in this location on given date"));
								if(appts) {
									var bookedappts=[];
									var len = appts.slots.length;
									console.log('given slot is ', request.payload.slots);
									_.each(request.payload.slots, function(slot, i) {
										if(!slot.status || slot.status == undefined) {
											slot.status = 'available';
										}
									})
									for(var i=0; i<len; i++) {
										if(appts.slots[i].status === 'booked') {
											bookedappts.push(appts.slots[i]);
										}										
									}
									for(var i=0; i<bookedappts.length; i++) {
	 									for( var j =0; j< request.payload.slots.length; j++) {
											if((request.payload.slots[j].from === bookedappts[i].from) && (request.payload.slots[j].to === bookedappts[i].to)) {
												if(request.payload.slots[j].status === 'booked') {
													request.payload.slots[j] = bookedappts[i];
												}
												if(request.payload.slots[j].status != 'booked') {
													reply(Boom.forbidden('You are trying to overwrite booked appointments'));
												}
											}
										}
									}
									console.log('updat slot is ', request.payload.slots);
									Appointments.update({"prov": request.payload.email, "loc": request.payload.locId,
										"date": request.payload.date},{$set: {slots: request.payload.slots}}, function(err, update) {
											if(err)
												reply(forbidden(error(err)))
											if(update)
												reply({modifiedslots:request.payload.slots});
											if(!update)
												reply("Not updated");
										}
									);									
								}
							}
						);
					}
				});
			}
		}
	});
};

// for check and update slot status
exports.slotStatus= function(server) {
	server.route({
		method: 'GET',
		path: '/v1/slotStatus',
		config: {
			auth: 'session',
			validate: {
				query: {
					location: Joi.string().required(),
					email: Joi.string().email().required(),
					date: Joi.string().required(),
					slot: Joi.string().required()
				}
			},
			handler: function(request, reply) {
				var user = request.auth.credentials.profile.email;
				var today = new Date();
				var time = ((today.getHours()+1)*60*60)+((today.getMinutes()+1)*60)+ (today.getSeconds()+1);
				var newtime = ((today.getHours()+1)/60/60)+((today.getMinutes()+1)/60)+ (today.getSeconds()+1);
				console.log(newtime, time);	
				var checkDate = new Date(request.query.date);
				console.log('checkDate ', checkDate, request.query);
				Appointments.findOne({"prov": request.query.email, "date": checkDate, 'loc': request.query.location},
					function(err, slot) {
						if(err)
							reply(Boom.forbidden(error(err)));
						if(!slot || slot === undefined)
							reply(Boom.notFound('No slot for this user on requested date/location'));
						if(slot) {
							function getSlot(id) {
							    return _.find(slot.slots, function(ctSlot) {
							        return ctSlot.from === id;
							    });
							}
							var singleSlot = getSlot(request.query.slot);
							if(singleSlot === undefined)
								reply(Boom.notFound('No slot at this time for this provider'));
							else {
								var ctStatus = singleSlot.status;
								if(ctStatus === slotStatus.Blocked.string) 
									reply(Boom.forbidden('Slot already blocked by another user'));
								if(ctStatus === slotStatus.Booked.string)
									reply(Boom.forbidden('Slot already booked'));
								if(ctStatus === slotStatus.Available.string) {
									Appointments.update({'slots': {$elemMatch: {'status': slotStatus.Blocked.string, 'by': user}}}, 
										{$set: {'slots.$.status': slotStatus.Available.string}}, function(err) {
											if(err)
												reply(Boom.forbidden(error(err)));
											else {
												Appointments.update({"prov": request.query.email, "date": request.query.date, 
													"loc": request.query.location, "slots.from": request.query.slot}, 
													{$set: {"slots.$.status": slotStatus.Blocked.string, "slots.$.by": user,'slots.$.at': time}},
													function(err, updated) {
														if(err)	
															reply(Boom.forbidden(error(err)));
														if(!updated) 
															reply(Boom.notFound('notFound'));
														if(updated) 
															reply({status: 'progress'});
													}
												);
											}
										}
									);
								}
							}
						}
					}
				);
			}
		}
	});
};