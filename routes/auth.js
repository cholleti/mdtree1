var Patient = require("../models/patient").Patient,
	SignUp = require("../models/signup").SignUp,
	Interest = require("../models/interestProvider").providerInterset,
	Boom =  require("boom"),
	Joi = require("joi"),
	bcrypt = require("bcrypt"),
	error = require('./config').errorMessage,
	Fs = require('fs'),
	_ = require("underscore"),
	Details = require("../models/provdetails").Details,
	cookie = require('./config').cookie,
	cookieName = cookie.get("cookieName").value,
    cookiePassword = cookie.get("password").value,
    encode = cookie.get("encoding").value,
    patientAuth = require('./config').auth.patient,
    providerAuth = require('./config').auth.provider,
    adminAuth = require('./config').auth.admin,
    userAuth = require('./config').auth.user,
    crypt = require('./config').auth.crypt,
    http = require('./config').http,    
    Created = http.get('Created').value,
    OK = http.get('OK').value,
    role = require('./config').role, 
    salesadmin = role.get('salesAdmin').value,
    salesmanageradmin = role.get('salesManagerAdmin').value,  
    userRoles = require('../public/js/routingConfig').userRoles,
    salesAdminrole = userRoles.salesAdmin,
	salesManagerrole = userRoles.salesManagerAdmin,  
    status = require('./config').status,
    activate = status.get('activate').value,
    deactivate = status.get('deactivate').value;  
var swig  = require('swig'),
	sendMail = require('./config').sendingMail;


module.exports = exports = function(server) {
	exports.admin(server);
	exports.register(server);
	exports.providerReg(server);
	exports.signin(server);
	exports.signout(server);
	exports.interest(server);
	exports.checkemail(server);
	exports.createRole(server);
	exports.deleteAdmin(server);
	exports.statusUpdate(server);
	exports.listRoles(server);
	exports.listAdmin(server);
	exports.updateAdmin(server);
};

// creation of admin
exports.admin = function(server) {
	server.route({
		method: "POST",
		path: "/v1/createAdmin",
		config: {
			handler: function(request, reply) {
				SignUp.findOne({"title":"admin"}, function(err, admin) {
					if(err)
						reply(Boom.error(err))
					if(admin)
						reply(Boom.forbidden("Admin already exists"));
					if(!admin) {
						var pwd;
						var role = userRoles.admin;
	                    var signup = new SignUp();
	                    if(request.payload.email === undefined)
	                        signup.email = "admin@mdtree.com";
	                    else 
	                        signup.email = request.payload.email;

	                    if(request.payload.password === undefined)
	                        pwd = "admin";
	                    else
	                        pwd = request.payload.password;

	                    if(request.payload.name === undefined)
	                        signup.name = "admin";
	                    else
	                        signup.name = request.payload.name;
	                    signup.role = role;
	                    // signup.title = adminAuth.title;
						// signup.bitMask = adminAuth.bitMask;
						signup.username = "admin"; 						
						bcrypt.genSalt(crypt.salt, function(err, salt) {
							bcrypt.hash(pwd, salt, function(err, hash) {								
								signup.password = hash;
								signup.save(function(err, signup) {
									if(err)
										reply(Boom.forbidden(error(err)));
									if(signup) {
										// var role={
				      //                       "title": adminAuth.title,
				      //                       "bitMask":signup.bitMask
				      //                   }
				      					var role = signup.role;
				                        var profile={
				                            "id":signup._id,
				                            "email":signup.email
				                        }
				                        var userinfo={
				                            "role":role,
				                            "type": role.title,
				                            "username":signup.username,
				                            "profile":profile
				                        }
				                        var sid = String(userinfo.profile.id);
										var user = {
											"username": userinfo.username,
											"role": userinfo.role,
											"type": role.title,
											"email": signup.email
										};
										request.server.app.cache.set(sid, {
									        account: userinfo
									        }, 0, function(err) {
									            if (err) reply(err);
									            var cookieOptions = {
									                encoding: encode,
									                password: cookiePassword,
									                isSecure: false,
									                path: '/',
									                isHttpOnly: false
									            };
									            reply({user:user}).state(cookieName, {sid: sid}, cookieOptions);
									        }
									    );
									}

								});
							});	
						});		
					}
				});				
			}
		}
	});
}

// for provider interest
exports.interest = function(server) {
	server.route({
		method: "POST",
		path: "/v1/providerinterest",
		config: {
			validate: {
				payload: {
					name: Joi.string().required(),
					practice: Joi.string().required(),
					email: Joi.string().email().required(),					
					city: Joi.string().required(),
					state: Joi.string().required(),					
					phone: Joi.string().min(10).max(15).required(),
					message: Joi.string()
				}
			}
		},
		handler: function(request, reply) {
			SignUp.findOne({"email": request.payload.email}, function(err, existing) {
				if(err)
					reply(Boom.forbidden(error(err)));
				if(existing) 
					reply(Boom.notAcceptable("You have already registered with us"));
				if(!existing) {
					Interest.findOne({"email": request.payload.email}, function(err, interesting) {
						if(err)
							reply(Boom.forbidden(error(err)));
						if(interesting) 
							reply(Boom.notAcceptable("You have already send an interset to us"));
						if(!interesting) {
							var interstingProvider = new Interest();							
							interstingProvider.name = request.payload.name;
							interstingProvider.city = request.payload.city;
							interstingProvider.state = request.payload.state;
							interstingProvider.practice = request.payload.practice;
							interstingProvider.phone = request.payload.phone;
							interstingProvider.email = request.payload.email;
							interstingProvider.message = request.payload.message;

							interstingProvider.save(function(err, user) {
								if(err) 
									reply(Boom.forbidden(error(err)));
								if(user) {
									var template = swig.compileFile('./mailTemplates/providerInterest.html');
								    var output = template({
								        pagename: 'Thanks for your interest to mdTree',
								        name: request.payload.name
								    });
							    	var data = {
							    		from: 'mdTree <no-reply@mdtree.com>',					    		
							    		to: request.payload.email,
							    		subject: 'Confirmation for your Interest with Us', 
							    		html: output
							    	}
							    	sendMail.templates(data, function(sendemail) {
							    		console.log(sendemail);							    		
							    	});					       
							    	reply({providerinterest:request.payload.email});     
								}
							});
						}
					});					
				}
			});			
		}
	});
}

// for patient registration
exports.register = function(server) {
	server.route({
		method: "POST",
		path: "/v1/patient/register",
		config: {
			validate:{
				payload: {
					firstName: Joi.string().required(),
					lastName: Joi.string().required(),
					zipCode: Joi.string().min(1).max(5).required(),
					gender: Joi.string().required(),
					dob: Joi.date().required(),
					email: Joi.string().email().required(),
					phone: Joi.string().required(),
					password: Joi.string().required(),
					question: Joi.string().required(),
					answer: Joi.string().required()
				}	
			}			
		},
		handler: function(request, reply){
			var patient = new Patient();
			patient.firstName = request.payload.firstName;
			patient.lastName = request.payload.lastName;
			patient.zipCode = request.payload.zipCode;
			patient.gender = request.payload.gender;
			patient.dob = request.payload.dob;
			patient.email = request.payload.email;
			patient.phone = request.payload.phone;
			patient.question = request.payload.question;
			patient.answer = request.payload.answer;

			SignUp.findOne({"email":request.payload.email}, function(err, chkpatient) {
				if(chkpatient) 
					reply(Boom.notAcceptable("You have already registered with us"));				
				if(err)
					reply(Boom.forbidden(error(err)));
				if(!chkpatient) {					
					bcrypt.genSalt(crypt.salt, function(err, salt) {
						bcrypt.hash(request.payload.password, salt, function(err, hash) {
							bcrypt.genSalt(crypt.salt, function(err, salt) {
								bcrypt.hash(request.payload.answer, salt, function(err, hashedAnswer) {
									var role = userRoles.user;
									var signup = new SignUp();
									signup.email = request.payload.email;
									signup.question = request.payload.question;
									signup.answer = hashedAnswer;
									signup.password = hash;
									
									role.title = patientAuth.title;
									signup.role = role;
									// signup.title = patientAuth.title;
									// signup.bitMask = patientAuth.bitMask;
									signup.username = request.payload.firstName;
									signup.save(function(err, signup) {							
										if(err) 
											reply(Boom.forbidden(error(err)));
										if(signup) {											
											patient.save(function(err, patient) {
												if(err)
													reply(Boom.forbidden(error(err)));
												if(patient) {
													var template = swig.compileFile('./mailTemplates/patient.html');
												    var output = template({
												        pagename: 'Welcome to mdTree',
												        name: request.payload.firstName
												    });
											    	var data = {
											    		from: 'mdTree <no-reply@mdtree.com>',					    		
											    		to: request.payload.email,
											    		subject: 'Welcome to mdTree', 
											    		html: output
											    	}
											    	sendMail.templates(data, function(sendemail) {
											    		console.log(sendemail);
											    	});
													// var role={
							      //                       "title":"user",
							      //                       "bitMask":signup.bitMask
							      //                   }
							      					var role = signup.role;
							      					role.title = 'user';
							                        var profile={
							                            "id":signup._id,
							                            "email":signup.email
							                        }
							                        var userinfo={
							                            "role":role,
							                            "type": signup.title,
							                            "username":signup.username,
							                            "profile":profile
							                        }
							                        var sid = String(userinfo.profile.id);
													var user = {
														"username": userinfo.username,
														"role": userinfo.role,
														"type": signup.title,
														"email": signup.email
													};
													request.server.app.cache.set(sid, {
												        account: userinfo
												        }, 0, function(err) {
												            if (err) reply(err);

												            var cookieOptions = {
												                encoding: encode,
												                password: cookiePassword,
												                isSecure: false,
												                path: '/',
												                isHttpOnly: false
												            };
												            reply({user:user}).state(cookieName, {sid: sid}, cookieOptions);
												        }
												    );
												}
											});											
										}									
																				
									});

								});
							});
						});
					});		
				}				
			});
		}
	});
};

// for provider registration
exports.providerReg = function(server) {
	server.route({
		method: "POST",
		path: "/v1/provider/register",
		config: {
			auth: "session",
			validate:{
				payload: {
					category: Joi.string().required(),
					specialty: Joi.string().required(),
					title: Joi.string().required(),
					firstName: Joi.string().required(),
					lastName: Joi.string().required(),
					zipCode: Joi.string().min(1).max(5).required(),
					gender: Joi.string(),
					dob: Joi.date().required(),
					email: Joi.string().email().required(),
					webSite: Joi.string(),
					password: Joi.string().required(),
					question: Joi.string().required(),
					answer: Joi.string().required(),
					notification: Joi.string().email().required(),
					cash: Joi.string().required(),
					offer: Joi.string(),
					cancellationNumber: Joi.string().required(),
					location: Joi.array().required(),
					school: Joi.string().required(),
					residency: Joi.string(),
					fellowship: Joi.string(),
					affilliation: Joi.string(),
					languages: Joi.array().required(),
					insurance: Joi.array(),
					statement: Joi.string(),
					plan: Joi.string().required(),
					billing: Joi.string(),
					price: Joi.string(),
					total: Joi.string(),
					imageFile: Joi.string()
					// imageFile: Joi.object().optional()
				}	
			}			
			// payload: {
			// 	output: 'file',
		 //        maxBytes: 2097152,
		 //        uploads: './temp',
		 //        parse: true,
			// },			
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
			var userRole = request.auth.credentials.role.title; 
			if( userRole === adminAuth.title || userRole === salesManagerrole.title || userRole === salesAdminrole.title) {
				var email = request.auth.credentials.profile.email; 	
			    var username = request.auth.credentials.username;
				var providerArray = [],
					returnProvider,
					locationArray=[],
					file,								
	 				details = new Details();

	            details.category = (request.payload.category).toLowerCase();
	            details.specialty = (request.payload.specialty).toLowerCase();
	            details.title = request.payload.title;
	            details.firstName = request.payload.firstName;
	            details.lastName = request.payload.lastName;
	            details.zipCode = request.payload.zipCode;
	            details.gender = request.payload.gender;
	            details.dob = request.payload.dob;            
	            details.webSite = request.payload.webSite;
	            details.notification = request.payload.notification;
	            details.cash = request.payload.cash;
	            details.offer = request.payload.offer;
	            details.cancellationNumber = request.payload.cancellationNumber;
	            details.subscription.planType = request.payload.plan;
		        details.subscription.billingInterval = request.payload.billing;
		        details.subscription.currentPrice = request.payload.price;
		        details.subscription.currentTotal = request.payload.total;            
	            for (var i =0; i < (request.payload.insurance).length; i++) {
	            	details.insurance.push(request.payload.insurance[i].toLowerCase()); 
	            	if(i === (request.payload.insurance).length - 1) {
	            		if(!details.insurance.has('insure_1'))
	            			details.insurance.push('insure_1');
	            	}	            
	            }
	            console.log('insurance is ', details.insurance);
	            for( var i = 0; i< (request.payload.location).length; i++) {
					var location = {
						practiceName: request.payload.location[i].practiceName,
						address: request.payload.location[i].address,
			            state: request.payload.location[i].state,
			            city: request.payload.location[i].city,
			            zip: request.payload.location[i].zip,
			            phone1: request.payload.location[i].phone1,
			            phone2: request.payload.location[i].phone2,
			            fax: request.payload.location[i].fax,
			            locId: request.payload.email+i
					}				
					details.location.push(location);
				}	
	            details.t = "pdtls";
	            details.email = request.payload.email;
	            details.school = request.payload.school;
	            details.residency = request.payload.residency;
	            details.fellowship = request.payload.fellowship;
	            details.affilliation = request.payload.affilliation;
	            for (var i =0; i < (request.payload.languages).length; i++) {
		            details.languages.push(request.payload.languages[i].toLowerCase()); 
	            }                 
	            details.statement = request.payload.statement;   
	            details.prov = request.payload.email;
	            details.rating = 4;            
				SignUp.findOne({"email":request.payload.email}, function(err,chkprovider) {
					if(err) {					
						reply(Boom.forbidden(error(err)));
					}
					if(chkprovider) {										
						reply(Boom.notAcceptable("You have already registered with us"));
					}
					if(!chkprovider) {	
						// if (request.payload.imageFile) {										
					 //        file = request.payload.imageFile;
					 //        console.log("input type :" + typeof request.payload.imageFile);
					 //        console.log("uploadFile " + file.filename + " (" + file.bytes + " bytes) at " + file.path);
					 //        var extn = (file.filename).substr((file.filename).indexOf('.')+1);
						// 	var path = (file.path).substr((file.path).indexOf('/')+1)
						//     var filename = path+'.'+extn;
						//     console.log("File name isss ", filename);
					 //        Fs.rename(file.path, './userimage/'+filename, function(err) {
					 //            if (err) throw err;
					 //            console.log('successfully uploaded the image file.');
					 //        });		        
					 //        details.image='./userimage/'+filename;
					 //        console.log("imageFile is "+details.image);				        
					 //    }	

					 
					 	details.image = './userimage/nopic.jpeg';	
					 	bcrypt.genSalt(crypt.salt, function(err, salt) {
							bcrypt.hash(request.payload.password, salt, function(err, hash) {
								bcrypt.genSalt(crypt.salt, function(err, salt) {
									bcrypt.hash(request.payload.answer, salt, function(err, hashedAnswer) {
										var role = userRoles.user;
										var signup = new SignUp();				
										signup.email = request.payload.email;
										signup.question = request.payload.question;
										signup.answer = hashedAnswer;
										signup.password = hash;										
										role.title = providerAuth.title;
										signup.role = role;
										// signup.title = providerAuth.title;
										// signup.bitMask = providerAuth.bitMask;
										signup.username = request.payload.firstName;
										signup.save(function(err, signup) {		        
									
											if(err)
												reply(Boom.forbidden(error(err)));								
											if(signup) {
												details.save(function(err, details) {
													if(err) {											
														reply(Boom.forbidden(error(err)));
													}
													if(!details)
														reply(Boom.forbidden('Account created successfully, update profile details using Sign In'));
													if(details) {
														var template = swig.compileFile('./mailTemplates/updateAdmin.html');
													    var output = template({
													        pagename: 'Provider created',
													        name: username,
													        message: 'created provider ('+request.payload.email+') '
													    });
												    	var data = {
												    		from: 'mdTree <no-reply@mdtree.com>',					    		
												    		to: email,
												    		subject: 'New provider created', 
												    		html: output
												    	}
												    	if(request.auth.credentials.role.title != adminAuth.title)
												    		data.cc = 'mdTree <admin@mdtree.com>'

												    	sendMail.templates(data, function(sendemail) {
												    		console.log('Mail has been sent');
												    	});
														reply().code(Created);
													}
												});
											}
										});
									});
								});
							});
						});
					}
				});
			}
			else
				reply(Boom.unauthorized('Not authorized to create provider'));
		}
	});
};

// for login
exports.signin = function(server) {
	server.route({
		method: "POST",
		path: "/v1/login",
		config: {			
			validate: {
				payload: {
					email: Joi.string().required(),
					password: Joi.string().required()
				}
			},
			handler: function(request, reply) {	
				SignUp.findOne({"email": request.payload.email, $or: [{'status': {$exists: false}}, {'status': activate}]}, function(err, user) {
					if(err)
						reply(err);
					if(!user)
						reply(Boom.notFound("No such user!"));					
					if(user) {	
						if(user.temppassword != undefined) 	{
							reply('temppassword');
							// reply(Boom.forbidden("You haven't change your password after you get temporary password. Kindly change your password then login"));
						}
						else {
							var attempt = user.attempt, attempted, date, today = new Date(), triedOn;
							date = today.getDate()+'-'+(today.getMonth()+1)+'-'+ today.getFullYear();
							if(attempt != undefined)
								triedOn = attempt.substr(0, attempt.length-1);
							if(bcrypt.compareSync(request.payload.password, user.password)) {								
								if(triedOn === date) 
									attempted = parseInt(attempt.substr(attempt.length-1));	
								else 
									attempted = 0;	
								if(user.attempt === undefined || attempted <= 3) {
									SignUp.update({"email": request.payload.email}, {$unset: {'attempt':1}}, function(err, updated) {
										if(err)
											reply(err);													
										if(updated) console.log('Updated Successfully');
									});
																	
									// var role={
			      //                       "title": "title",
			      //                       "bitMask":user.bitMask
			      //                   }
			      					var role = user.role;
			                        var profile={
			                            "id":user._id,
			                            "email":user.email
			                        }
			                        var userinfo={
			                            "role":role,
					                    "type": role.title,
			                            "username":user.username,
			                            "profile":profile
			                        }
			                        var sid = String(userinfo.profile.id);
									var user = {
										"username": userinfo.username,
										"role": userinfo.role,
										"type": role.title,
										"email": user.email
									};
									// if(parseInt(user.bitMask) === adminAuth.bitMask) 
									// 	role.title = adminAuth.title;
									// else
									// 	role.title = userAuth.title;
									if(role.title === providerAuth.title || role.title === patientAuth.title)	
										role.title = userAuth.title;
									request.server.app.cache.set(sid, {
								        account: userinfo
								        }, 0, function(err) {
								            if (err) reply(err);

								            var cookieOptions = {
								                encoding: encode,
								                password: cookiePassword,
								                isSecure: false,
								                path: '/',
								                isHttpOnly: false
								            };
								            reply({user:user}).state(cookieName, {sid: sid}, cookieOptions);
								        }
								    );

								}
								else 
									reply(Boom.forbidden("You have crossed today's limit. Try to login tomorrow"));
							}							
							else {
								var tried;	
								if(attempt === undefined || triedOn!= date) {
									tried = date+1;
									
								}
								else {
									var attempted = parseInt(attempt.substr(attempt.length-1));
									console.log(attempted);
									if(attempted >= 3)
										reply(Boom.forbidden("You have crossed today's limit. Try to login tomorrow"));
									else 
										tried = date+(attempted+1);
								}
								SignUp.update({'email': request.payload.email}, {$set: {'attempt': tried}},function(err, updated) {
									if(err)
										reply(err);													
									if(updated) {
										reply( Boom.forbidden('Incorrect username or password'));
									} 
								});							
							}
						}
					}
				});				
			}
		}
	});
};

// for logout
exports.signout = function(server) {
	server.route({
		path: "/logout",
	    method: "POST",
	    config: {
	        handler: function(request, reply) {
	            request.auth.session.clear();
	            reply('Successfully Logged out!');
	        }
	    }
	});
};

// list of emails in database
exports.checkemail = function(server) {
	server.route({
		method: 'GET',
		path: '/v1/checkEmail',
		config: {
			validate: {
				query: {
					email: Joi.string().email().required()
				}
			},
			handler: function(request, reply) {
				SignUp.findOne({'email': request.query.email}, {email:1, _id:0}, function(err, existing) {
					if(err)
						reply(Boom.forbidden(error(err)));
					if(existing)
						reply({exist:true});
					if(!existing)
						reply({exist:false});
				});
			}
		}
	});
};

// creating admins
exports.createRole = function(server) {
	server.route({
		method: 'POST',
		path: '/v1/createRole',
		config: {
			auth: 'session',
			validate: {
				payload: {
					email: Joi.string().email().required(),
					role: Joi.string().required(),
					password: Joi.string().required(),
					name: Joi.string()
				}
			},
			handler: function(request, reply) {
				var givenRole = request.payload.role,
		    		salesAdminrole = userRoles.salesAdmin,
		    		salesManagerrole = userRoles.salesManagerAdmin,
		    		roleObject, username;
		    	var email = request.auth.credentials.profile.email;
		    	var username = request.auth.credentials.username;
		    	console.log('credentials ', request.auth.credentials, salesManagerrole);
		    	if(givenRole === salesadmin || givenRole === salesmanageradmin) {
			    	if(givenRole === salesadmin) {
			    		roleObject = userRoles.salesAdmin;
			    		if(request.auth.credentials.role.title === adminAuth.title || request.auth.credentials.role.title === salesManagerrole.title) {
			    			create();
			    		}	
			    		else
			    			reply(Boom.unauthorized("You cannot create sales admin"));
			    	}
			    	else if(givenRole === salesmanageradmin ) {			    		
			    		roleObject = userRoles.salesManagerAdmin;
			    		if(request.auth.credentials.role.title === adminAuth.title) {
			    			create();
			    		}	
			    		else
			    			reply(Boom.unauthorized("You cannot create sales manager admin"));
			    	}
			    	function create() {
			    		SignUp.findOne({'email': request.payload.email}, function(err, existingUser) {
			    			if(err)
			    				reply(Boom.forbidden(error(err)));
			    			else if(existingUser) 
			    				reply(Boom.forbidden('This user already exists'));
			    			else if(!existingUser) {
			    				bcrypt.genSalt(crypt.salt, function(err, salt) {
									bcrypt.hash(request.payload.password, salt, function(err, hash) {
							    		var signup = new SignUp();
							    		signup.email = request.payload.email;
							    		signup.password = hash;
							    		signup.role = roleObject;
							    		signup.username = request.payload.name;
							    		signup.status = activate;
							    		signup.save(function(err, newRole) {
							    			if(err)
							    				reply(Boom.forbidden(error(err)));
							    			else if(!newRole)
							    				reply(Boom.forbidden('Not able to create new role'));
							    			else if(newRole) {
							    				var template = swig.compileFile('./mailTemplates/createAdmin.html');
											    var output = template({
											        pagename: 'Admin created',
											        email: request.query.email,
											        name: username,
											        role: givenRole
											    });
										    	var data = {
										    		from: 'mdTree <no-reply@mdtree.com>',					    		
										    		to: email,
										    		subject: 'Admin created', 
										    		html: output
										    	}
										    	if(request.auth.credentials.role.title != adminAuth.title)
										    		data.cc = 'mdTree <admin@mdtree.com>'

										    	sendMail.templates(data, function(sendemail) {
										    		console.log('Mail has been sent');
										    	});
							    				reply('Created successfully').code(Created);
							    			}
							    		});
									});
								});
			    			}
			    		});
			    	}
			    }	
				else
					reply(Boom.forbidden('Invalid role option'));
			}
		}
	});
};

// removing admin
exports.deleteAdmin = function(server) {
	server.route({
		method: 'DELETE',
		path: '/v1/deleteAdmin',
		config: {
			auth: 'session',
			validate: {
				query: {
					email: Joi.string().email().required()
				}
			},
			handler: function(request, reply) {
				var givenRole, 
					salesAdminrole = userRoles.salesAdmin,
		    		salesManagerrole = userRoles.salesManagerAdmin;	
		    	var email = request.auth.credentials.profile.email;
		    	var username = request.auth.credentials.username;

				SignUp.findOne({'email': request.query.email}, {'_id':0, 'role':1, 'status':1}, function(err, admin) {
					if(err)
						reply(Boom.forbidden(error(err)));
					else if(!admin)
						reply(Boom.notFound('No such admin'));
					else if(admin) {
						givenRole = admin.role.title;
						console.log('role is ', givenRole);						
				    	if(givenRole === salesadmin) {
				    		if(request.auth.credentials.role.title === adminAuth.title || request.auth.credentials.role.title === salesManagerrole.title) {
				    			deleteRole();
				    		}	
				    		else
				    			reply(Boom.unauthorized("You cannot delete sales admin"));
				    	}
				    	else if(givenRole === salesmanageradmin ) {			    		
				    		if(request.auth.credentials.role.title === adminAuth.title) {
				    			deleteRole();
				    		}	
				    		else
				    			reply(Boom.unauthorized("You cannot delete sales manager admin"));
				    	}
				    	else
				    		reply(Boom.unauthorized('Not authorized to delete admin'));
				    	function deleteRole() {
				    		SignUp.remove({'email': request.query.email}, function(err, remove) {
				    			if(err)
				    				reply(Boom.forbidden(error(err)));
				    			if(!remove)
				    				reply(Boom.forbidden('Not able to delete admin'));
				    			if(remove) {
				    				var template = swig.compileFile('./mailTemplates/deleteAdmin.html');
								    var output = template({
								        pagename: 'Admin removed',
								        email: request.query.email,
								        name: username
								    });
							    	var data = {
							    		from: 'mdTree <no-reply@mdtree.com>',					    		
							    		to: email,
							    		subject: 'Admin removed ', 
							    		html: output
							    	}
							    	if(request.auth.credentials.role.title != adminAuth.title)
							    		data.cc = 'mdTree <admin@mdtree.com>'

							    	sendMail.templates(data, function(sendemail) {
							    		console.log('Mail has been sent');
							    	});
				    				reply('Deleted successfully').code(OK);
				    			}
				    		});
				    	}
					}
				});
			}
		}
	});
};

// active/deactive admin
exports.statusUpdate = function(server) {
	server.route({
		method: 'PUT',
		path: '/v1/statusUpdate',
		config: {
			auth: 'session',
			validate: {
				query: {
					email: Joi.string().email().required(),
					status: Joi.string().required()
				}
			},
			handler: function(request, reply) {
				var givenStatus = request.query.status, givenRole, 
					salesAdminrole = userRoles.salesAdmin,
		    		salesManagerrole = userRoles.salesManagerAdmin;	
		    	var email = request.auth.credentials.profile.email;
		    	var username = request.auth.credentials.username;
		    	if(givenStatus === activate || givenStatus === deactivate) {
					SignUp.findOne({'email': request.query.email, 'status': {$exists: true}}, {'_id':0, 'role':1, 'status':1}, function(err, admin) {
						if(err)
							reply(Boom.forbidden(error(err)));
						else if(!admin)
							reply(Boom.notFound('No such admin'));
						else if(admin) {	
							givenRole = admin.role.title;
							console.log('givenRole is ', givenRole);
					    	if(givenRole === salesadmin) {
					    		if(request.auth.credentials.role.title === adminAuth.title || request.auth.credentials.role.title === salesManagerrole.title) {
					    			changeStatus();
					    		}	
					    		else
					    			reply(Boom.unauthorized("You cannot update sales admin status"));
					    	}
					    	else if(givenRole === salesmanageradmin ) {			    		
					    		if(request.auth.credentials.role.title === adminAuth.title) {
					    			changeStatus();
					    		}	
					    		else
					    			reply(Boom.unauthorized("You cannot update sales manager admin status"));
					    	}
					    	else
					    		reply(Boom.unauthorized('Not authorized to update admin status'));		

					    	function changeStatus() {
					    		if(givenStatus === admin.status)
					    			reply(Boom.forbidden('Already in same status'));
					    		else {
					    			SignUp.update({'email': request.query.email}, {$set: {'status': givenStatus}}, function(err, updated) {
					    				if(err)
					    					reply(Boom.forbidden(error(err)));
					    				else if(!updated)
					    					reply(Boom.forbidden('Not able to update the status'))
					    				else if(updated) {
					    					var template = swig.compileFile('./mailTemplates/statusUpdate.html');
										    var output = template({
										        pagename: 'Status changed',
										        email: request.query.email,
										        name: username,
										        status: givenStatus
										    });
									    	var data = {
									    		from: 'mdTree <no-reply@mdtree.com>',					    		
									    		to: email,
									    		subject: 'Status of the admin is changed', 
									    		html: output
									    	}
									    	if(request.auth.credentials.role.title != adminAuth.title)
									    		data.cc = 'mdTree <admin@mdtree.com>'

									    	sendMail.templates(data, function(sendemail) {
									    		console.log('Mail has been sent');
									    	});
					    					reply('Status updated successfully').code(OK);
					    				}
					    			});
					    		}
					    	}
						}
					});
				}
				else
					reply(Boom.forbidden('Invalid status request'));
			}
		}
	});
};

// list of userRoles
exports.listRoles = function(server) {
	server.route({
		method: 'GET',
		path: '/v1/listRoles',
		config: {
			auth: 'session',
			handler: function(request, reply) {
				console.log('role is ', role);
				var roles = [],
					userRole = request.auth.credentials.role.title,
					salesAdminrole = userRoles.salesAdmin,
		    		salesManagerrole = userRoles.salesManagerAdmin;

				if( userRole === adminAuth.title || userRole === salesManagerrole.title) {					
					console.log('role is ', role.enums);
					_.each(role.enums, function(role) {
						console.log('role is ', role);
						if(role != userRole)
							roles.push(role.value);
					})					
					reply({roles:roles});
				}
				else
					reply(Boom.unauthorized('You cannot see the admin roles'));
			}
		}
	});
};

// list of admins
exports.listAdmin = function(server) {
	server.route({
		method: 'GET',
		path: '/v1/listAdmin',
		config: {
			auth: 'session',
			handler: function(request, reply) {
				var roles = [],
					userRole = request.auth.credentials.role.title,
					salesAdminrole = userRoles.salesAdmin,
		    		salesManagerrole = userRoles.salesManagerAdmin;	    	
		    	console.log('credentials are ', JSON.stringify(request.auth.credentials));
				if( userRole === adminAuth.title || userRole === salesManagerrole.title) {					
					console.log('role is ', role.enums);
					_.each(role.enums, function(role) {
						console.log('role is ', role);
						if(role != userRole)
							roles.push(role.value);
					})					
					SignUp.find({'role.title': {$in: roles}}, {'_id':0, 'email':1, 'username':1, 'role.title':1, 'status':1}, function(err, admins) {
						if(err)
							reply(Boom.forbidden(error(err)));
						if(!admins || admins.length == 0) 
							reply(Boom.notFound('No admins to list'));
						if(admins || admins.length >= 1) {
							var adminArray = [];
							_.each(admins, function(admin) {
								var admin = {
									'email': admin.email,
									'username': admin.username,
									'role': admin.role.title,
									'status': admin.status
								}
								adminArray.push(admin);
							});
							reply({admins:adminArray});
						}
					})
				}
				else
					reply(Boom.unauthorized('You cannot see the admins'));
			}
		}
	});
};

// update admin details
exports.updateAdmin = function(server) {
	server.route({
		method: 'PUT',
		path: '/v1/updateAdmin',
		config: {
			auth: 'session',
			validate: {
				query: {
					email: Joi.string().email().required()
				},
				payload: {
					role: Joi.string(),
					username: Joi.string(),
					password: Joi.string()
				}
			},
			handler: function(request, reply) {
				var roles = [],
					userRole = request.auth.credentials.role.title,
					salesAdminrole = userRoles.salesAdmin,
		    		salesManagerrole = userRoles.salesManagerAdmin;	   
		    	var email = request.auth.credentials.profile.email; 	
		    	var username = request.auth.credentials.username;
		    	console.log('credentials are ', JSON.stringify(request.auth.credentials));
				if( userRole === adminAuth.title || userRole === salesManagerrole.title || userRole === salesAdminrole.title) {
					SignUp.findOne({'email': request.query.email, 'status': {$exists: true}}, {'_id':0, 'role':1, 'status':1}, function(err, admin) {
						if(err)
							reply(Boom.forbidden(error(err)));
						else if(!admin)
							reply(Boom.notFound('No such admin'));
						else if(admin) {	
							givenRole = admin.role.title;
							console.log('givenRole is ', givenRole);
					    	if(givenRole === salesadmin) {
					    		if(request.auth.credentials.role.title === adminAuth.title || request.auth.credentials.role.title === salesManagerrole.title) {
					    			update();
					    		}	
					    		else if(request.query.email === email) {
						    		update();
						    	}
					    		else
					    			reply(Boom.unauthorized("You cannot change sales admin details"));
					    	}
					    	else if(givenRole === salesmanageradmin ) {			    		
					    		if(request.auth.credentials.role.title === adminAuth.title) {
					    			update();
					    		}	
					    		else if(request.query.email === email) {
						    		update();
						    	}
					    		else
					    			reply(Boom.unauthorized("You cannot change sales manager admin details"));
					    	}					    	
					    	else
					    		reply(Boom.unauthorized('Not authorized to change admin details'));		

					    	function update() {
				    			var updateDetail = request.payload;
				    			var password, givenRole;
				    			if(request.payload.password) {
				    				bcrypt.genSalt(crypt.salt, function(err, salt) {
										bcrypt.hash(request.payload.password, salt, function(err, hash) {
											updateDetail.password = hash;
											change();
										});
									});
				    			}
				    			if(request.payload.role) {
				    				givenRole = request.payload.role;
					    			if(givenRole === salesadmin || givenRole === salesmanageradmin) {
					    				if(givenRole === salesadmin) {								    		
								    		if(request.auth.credentials.role.title === adminAuth.title || request.auth.credentials.role.title === salesManagerrole.title) {
								    			updateDetail.role = userRoles.salesAdmin;
								    			change();
								    		}	
								    		else
								    			reply(Boom.unauthorized("You cannot update sales admin details"));
								    	}
								    	else if(givenRole === salesmanageradmin ) {			    										    		
								    		if(request.auth.credentials.role.title === adminAuth.title) {
								    			updateDetail.role = userRoles.salesManagerAdmin;
								    			change();
								    		}	
								    		else
								    			reply(Boom.unauthorized("You cannot update sales manager admin details"));
								    	}
					    			} 
					    			else
					    				reply(Boom.forbidden('Invalid role option'));
					    		}
				    			else
				    				change();					    			
				    			function change() {
				    				console.log('updateDetail ', JSON.stringify(updateDetail));
					    			SignUp.update({'email': request.query.email}, {$set: updateDetail}, function(err, updated) {
					    				if(err)
					    					reply(Boom.forbidden(error(err)));
					    				else if(!updated)
					    					reply(Boom.forbidden('Not able to update the details'))
					    				else if(updated) {
					    					var template = swig.compileFile('./mailTemplates/updateAdmin.html');
										    var output = template({
										        pagename: 'Details updated',
										        name: username,
										        message: 'updated admin ('+request.query.email+') details '
										    });
									    	var data = {
									    		from: 'mdTree <no-reply@mdtree.com>',					    		
									    		to: email,
									    		subject: 'Details of the admin is changed', 
									    		html: output
									    	}
									    	if(request.auth.credentials.role.title != adminAuth.title)
									    		data.cc = 'mdTree <admin@mdtree.com>'

									    	sendMail.templates(data, function(sendemail) {
									    		console.log('Mail has been sent');
									    	});
					    					reply('Details updated successfully').code(OK);
					    				}
					    			});
								}
					    	}
						}
					});
				}
				else
					reply(Boom.unauthorized('You cannot update the admins'));
			}
		}
	});
};