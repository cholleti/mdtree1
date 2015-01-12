var	Boom =  require("boom"),
	bcrypt = require("bcrypt"),
	Joi = require("joi"),
	Provider = require("../models/provdetails").Details,
	Patient = require("../models/patient").Patient,
	SignUp = require("../models/signup").SignUp,
	adminAuth = require('./config').auth.admin,
	userRoles = require('../public/js/routingConfig').userRoles,
    salesAdminrole = userRoles.salesAdmin,
	salesManagerrole = userRoles.salesManagerAdmin,
	http = require('./config').http,
    OK = http.get('OK').value,
    crypt = require('./config').auth.crypt,
	error = require('./config').errorMessage;
var swig  = require('swig'),
	sendMail = require('./config').sendingMail;
 

module.exports = exports = function(server) {		
	exports.changePassword(server);
	exports.getSecurity(server);
	exports.changeSecurity(server);
	exports.updateRatings(server);
	exports.forgotPassword(server);	
};

// for forgot password
exports.forgotPassword = function(server) {
	server.route({
		method: "PUT",
		path: "/v1/forgotPassword",
		config: {
			validate: {		
				query: {
					email: Joi.string().required()
				},	
				payload: {
					question: Joi.string().required(),
					answer: Joi.string().required()
				}	
			},
			handler: function(request, reply) {
				SignUp.findOne({"email": request.query.email}, function(err, user) {
					if(err)
						reply(Boom.forbidden(error(err)));
					if(!user)
						reply(Boom.notFound("No such user registered with us"));
					if(user) {
						if((user.question != request.payload.question) || (!bcrypt.compareSync(request.payload.answer, user.answer))) {
							reply(Boom.forbidden("Incorrect security question or answer"));
						}
						if((user.question === request.payload.question) && (bcrypt.compareSync(request.payload.answer, user.answer))) {								
							var newpwd = Math.floor(Math.random() * 9000) + 1000;
							SignUp.update({"email": request.query.email}, {$set: {"temppassword": newpwd}}, function(err, updated) {
								if(err)
									reply(Boom.forbidden(error(err)));
								if(updated) {
									var template = swig.compileFile('./mailTemplates/forgotPassword.html');
								    var output = template({
								        pagename: 'Temporary password from mdTree',
								        username: request.query.email,
								        password: newpwd
								    });
							    	var data = {
							    		from: 'mdTree <no-reply@mdtree.com>',					    		
							    		to: request.query.email,
							    		subject: 'Temporary password from mdTree', 
							    		html: output
							    	}
							    	sendMail.templates(data, function(sendemail) {
							    		console.log(sendemail);							    		
							    	});
							    	reply({temppassword:newpwd}).code(OK);
								}
							});	
						}
					}
				});
			}
		}
	});
}

//for change password
exports.changePassword = function(server) {
	server.route({
		method: "PUT",
		path: "/v1/changePassword",
		config: {
			auth: {
				mode: 'try',
				strategy: "session"
			},	
			validate: {
				query: {
					email: Joi.string().email()					
				},
				payload: {
					newpassword: Joi.string().required(),
					password: Joi.string().required()
				},
			},
			handler: function(request, reply) {	
				if(!request.auth.isAuthenticated) {
					passwordUpdate();
				}

				if(request.auth.isAuthenticated) {
					var userRole = request.auth.credentials.role.title; 
					if( request.query.email === request.auth.credentials.profile.email || userRole === adminAuth.title || userRole === salesManagerrole.title || userRole === salesAdminrole.title) {
						passwordUpdate();
					}
					else
						reply(Boom.forbidden("Cannot get other's details"));
				}
				function passwordUpdate() {
					SignUp.findOne({"email": request.query.email}, function(err, getUser) {					
						if(err)
							reply(Boom.forbidden(error(err)));
						if(!getUser) 
							reply(Boom.notFound("No such user with us"));
						if(getUser) {
							var pwd = request.payload.password.trim();
							if(getUser.temppassword != undefined || getUser.temppassword) {
								if(pwd === getUser.temppassword) {
									bcrypt.genSalt(crypt.salt, function(err, salt) {
										var newpwd = request.payload.newpassword.trim();
										bcrypt.hash(newpwd, salt, function(err, hash) {
											if(err)
												reply(Boom.forbidden(error(err)));
											if(hash) {
												SignUp.update({"email": request.query.email}, {$set: {"password": hash}}, 
													{$unset: {"temppassword":1}}, function(err, updated) {
														if(err)
															reply(Boom.forbidden(error(err)));
														if(updated) {
															SignUp.update({"email": request.query.email}, {$unset: {"temppassword":1}}, function(err, unset) {
																if(err)
																	reply(Boom.forbidden(error(err)));
																if(unset)
																	reply("Updated Successfully").code(OK);
															});														
														}
													}
												);		
											}
										});									
									});
								}
								if(pwd != getUser.temppassword)
									reply(Boom.forbidden('Incorrect temporary password'));
							}
							if(getUser.temppassword === undefined || !getUser.temppassword ) {
								if(bcrypt.compareSync(pwd, getUser.password)) {
									bcrypt.genSalt(crypt.salt, function(err, salt) {
										var newpwd = request.payload.newpassword.trim();
										bcrypt.hash(newpwd, salt, function(err, hash) {
											if(err)
												reply(Boom.forbidden(error(err)))
											if(hash)
											{
												SignUp.update({"email": request.query.email}, {$set: {"password": hash}}, 
													function(err, updated) {
														if(err)
															reply(Boom.forbidden(error(err)));
														if(updated) {
															reply("Updated Successfully").code(OK);
														}
													}
												);		
											}										
										});
									});
								}
								if(!bcrypt.compareSync(pwd, getUser.password)) {
									reply(Boom.forbidden("Invalid password"));
								}
							}						
						}
					});	
				}				
			}
		}
	});
}

// to get security details
exports.getSecurity = function(server) {
	server.route({
		method: "GET",
		path: "/v1/getSecurity",
		config: {
			auth: 'session',
			validate: {
				query: {
					email: Joi.string().email().required()
				}
			},
			handler: function(request, reply) {
				var email = request.query.email;				
				var userRole = request.auth.credentials.role.title; 
				if( request.query.email === request.auth.credentials.profile.email || userRole === adminAuth.title || userRole === salesManagerrole.title || userRole === salesAdminrole.title) {
					SignUp.findOne({"email": email}, function(err, getUser) {						
						if(err) 
							reply(Boom.forbidden(error(err)));
						if(!getUser) 
							reply(Boom.notFound("No such user"));
						if(getUser) {
							var security = {
								"question": getUser.question
							}
							reply({security:security});
						}
					});
				}
				else
					reply(Boom.forbidden("Cannot get other's details"));				
			}
		}
	});
}

// to change security details
exports.changeSecurity = function(server) {
	server.route({
		method: "PUT",
		path: "/v1/changeSecurity",
		config: {
			auth: "session",
			validate: {
				query: {
					email: Joi.string().email().required()
				},
				payload: {
					question: Joi.string().required(),
					answer: Joi.string().required()					
				}
			},
			handler: function(request, reply) {
				var email = request.query.email;
				var userRole = request.auth.credentials.role.title; 
				if( request.query.email === request.auth.credentials.profile.email || userRole === adminAuth.title || userRole === salesManagerrole.title || userRole === salesAdminrole.title) {
					bcrypt.genSalt(crypt.salt, function(err, salt) {
						bcrypt.hash(request.payload.answer, salt, function(err, hash) {				
							SignUp.update({"email": email},
								{$set: {
									"question": request.payload.question,
									"answer": hash
									}
								}, function(err, updated) {
								if(err) 
									reply(Boom.forbidden(error(err)));
								if(!updated) 
									reply(Boom.notFound("No such user"));
								if(updated) {
									reply('Updated Successfully').code(OK);
								}
							});	
						});			
					});
				}			
				else
					reply(Boom.forbidden("Cannot change other's details"));	
			}
		}
	});
}

// to update ratings of the provider
exports.updateRatings = function(server) {
	server.route({
		method: "PUT",
		path: "/v1/updateRatings",
		config:{
			handler: function(request, reply) {
				Provider.update({"email": request.query.email}, {$set: {"rating": request.payload.rating}},
					function(err, provider) {
						if(err)
							reply(Boom.forbidden(error(err)));
						if(!provider)
							reply(Boom.notFound("No such provider exists"));
						if(provider) {
							reply("Updated successfully").code(OK);
						}
					}
				);
			}
		}
	});
}