var Boom =  require("boom"),
	Joi = require("joi"),
	error = require('./config').errorMessage,
	_ = require("underscore"),
	adminAuth = require('./config').auth.admin,
	patAppointments = require("../models/patientapptmnt").patientAppointments,
	providerAuth = require('./config').auth.provider,
	SignUp = require("../models/signup").SignUp,
	Details = require("../models/provdetails").Details,
	dumpProvider = require('../models/dumpProvider').Dump,
	Appointments = require("../models/provappts").Appointments;

module.exports = exports = function(server) {
	exports.hitAnalysis(server);
	exports.hitAnalysisType(server);
	exports.providerAnalysis(server);
	exports.onBoard(server);
	exports.onBoardType(server);
	exports.patientReport(server);
	exports.providerReport(server);
}

exports.hitAnalysis = function(server) {
	server.route({
		method: 'GET',
		path: '/v1/hitAnalysis',
		config: {
			auth: 'session',
			validate: {
				query: {
					month: Joi.string(),
					year: Joi.string(),
					fromDate: Joi.string(),
					toDate: Joi.string()
				}
			},
			handler: function(request, reply) {
				var uniqueValue;
				var locationId = [];
				var userRole = request.auth.credentials.role.title; 
				if(userRole === adminAuth.title ) {
					Date.prototype.today = function () { 
						return (((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) + "-"+ ((this.getDate() < 10)?"0":"") + this.getDate() +"-"+ this.getFullYear();
					}												
					var givenYear = new Date().getFullYear();
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
					console.log('dates ', firstDay, lastDay);
					var matchData = {
			            'date': { 
		                	$gte: firstDay, 
		                  	$lte: lastDay
		                },
		                'slots.patient': {$exists: true}
		         	};	
		         	if(request.query.year && !request.query.month) {         	
		         		givenYear = request.query.year;			    
		         		delete matchData.date;
		         	} 
					Details.aggregate({$match: {'email': {$exists: true}}}, {$group: {_id: '$location.zip'}}, function(err, providers) {
						if(err)
							reply(Boom.forbidden(error(err)));
						else if(!providers) 
							reply(Boom.notFound('No providers'));
						else if(providers ) {
							if(providers.length ==0) {
								var result ={};
								reply({hitAnalysis:result});
							}
							else {
								var zipArray = [];
								_.each(providers, function(provider, i) {
									_.each(provider._id, function(location, j) {								
										zipArray.push(location);								
										if((j === provider._id.length-1) && (i === providers.length-1)) {
											uniqueValue = _.uniq(zipArray)
											calculate(0);
										}
									});
								});
							}
						}
					});
					function calculate (i) {
						if(i < uniqueValue.length) {
							var unique = uniqueValue[i];
							Details.find({'location.zip': unique, 'email': {$exists: true}}, {'_id':0, 'location.$.locId':1, 'firstName':1}, function(err, providerLocaiton) {
								if(err)
									reply(Boom.forbidden(error(err)));
								else if(!providerLocaiton) 
									reply(Boom.notFound('No providers'));
								else if(providerLocaiton) {
									var location = [];
									_.each(providerLocaiton, function(locationDetails, j) {
										if(j === providerLocaiton.length-1) {
											// location.push(locationDetails.location[0].locId);
											var providerDetail = {
												'name': locationDetails.firstName,
												'locId': locationDetails.location[0].locId
											}
											location.push(providerDetail);
											var newLocation = {
												'zip': unique,
												'location': location
											}																															
											locationId.push(newLocation);
											calculate(i+1);
										}
										else {
											// location.push(locationDetails.location[0].locId);
											var providerDetail = {
												'name': locationDetails.firstName,
												'locId': locationDetails.location[0].locId
											}
											location.push(providerDetail);
										}
									});
								}
							});	
						}
						if( uniqueValue[i] === undefined || i > uniqueValue.length-1) {
							var resultArray = [];
							_.each(locationId, function(singleProvider, i) {
								var firstIndex = i;
								_.each(singleProvider.location, function(location, j) {
									var lastIndex = j;
									var zipDetails = [];
									matchData.loc = location.locId;
									Appointments.aggregate({$match: matchData},{$project: {year: {'$year': '$date'}}}, {$match: {year: parseInt(givenYear)}}, {$group : {_id : "$loc",total: {$sum: 1}}}, function(err, appt) {
										if(err)
											reply(Boom.forbidden(error(err)));
										else if(!appt || appt.length < 1) {
											console.log('no appointments');
											if(firstIndex === locationId.length-1)
												reply({hitAnalysis:resultArray});				
										}
										else if(appt || appt.length >= 1) {
											zipDetails = [];
											if(lastIndex === singleProvider.location.length-1) {
												var netTotal = 0;																				
												if(firstIndex === locationId.length-1) {
													var result = [];
													result.push(location.name);
													result.push(appt[0].total);
													netTotal = parseInt(netTotal) + appt[0].total;
													zipDetails.push(result);
													var value = {
														values: zipDetails
													}
													var providers = [];
													providers.push(value);
													var provider = [];
													provider.push(singleProvider.zip);
													provider.push(netTotal);
													provider.push({providers: providers});
													// var provider = {
													// 	'zip': singleProvider.zip,
													// 	'total': netTotal,
													// 	'values': zipDetails
													// }
													resultArray.push(provider);
													reply({hitAnalysis:resultArray});
												}						
												else {
													var result = [];
													result.push(location.name);
													result.push(appt[0].total);
													netTotal = parseInt(netTotal) + appt[0].total;
													zipDetails.push(result);
													// var provider = {
													// 	'zip': singleProvider.zip,
													// 	'total': netTotal,
													// 	'values': zipDetails
													// }
													var value = {
														values: zipDetails
													}
													var providers = [];
													providers.push(value);
													var provider = [];
													provider.push(singleProvider.zip);
													provider.push(netTotal);
													provider.push({providers: providers});
													resultArray.push(provider);
												}
											}
											else {												
												var result = [];
												result.push(location.name);
												result.push(appt[0].total);
												zipDetails.push(result);
												console.log('zipDetails ', JSON.stringify(zipDetails));
											}
										}
									});
								});
							});
						}
					}
				}
				else
					reply(Boom.unauthorized('Not authorized to view report'));
			}
		}
	});
};

exports.hitAnalysisType = function(server) {
	server.route({
		method: 'GET',
		path: '/v1/hitAnalysisType',
		config: {
			auth: 'session',
			validate: {
				query: {
					month: Joi.string(),
					year: Joi.string(),
					fromDate: Joi.string(),
					toDate: Joi.string()
				}
			},
			handler: function(request, reply) {
				var uniqueValue;
				var locationId = [];				
				var userRole = request.auth.credentials.role.title; 
				if(userRole === adminAuth.title ) {
					Date.prototype.today = function () { 
						return (((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) + "-"+ ((this.getDate() < 10)?"0":"") + this.getDate() +"-"+ this.getFullYear();
					}												
					var givenYear = new Date().getFullYear();
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
					console.log('dates ', firstDay, lastDay);
					var matchData = {
			            'date': { 
		                	$gte: firstDay, 
		                  	$lte: lastDay
		                },
		                'slots.patient': {$exists: true}
		         	};	
		         	if(request.query.year && !request.query.month) {         	
		         		givenYear = request.query.year;			    
		         		delete matchData.date;
		         	}     								         	
		         	var returnArray = [];
		   //       	if(request.query.year && !request.query.month)         	
		   //       		givenYear = request.query.year;

					Details.aggregate({$match: {'t':'pdtls'}}, {$group: {_id: {type: '$subscription.planType'}, count: {$sum:1}}}, function(err, providers) {
						console.log('providers ', JSON.stringify(providers));
						if(err)
							reply(Boom.forbidden(error(err)));
						else if(!providers) 
							reply(Boom.notFound('No providers'));
						else if(providers ) {
							if(providers.length ==0) {
								var result ={};
								reply({hitAnalysis:result});
							}
							else {
								getProvider(0);
								function getProvider(i) {
									if(i == providers.length) {
										reply({report:returnArray});
									}
									else {
										var provider = providers[i]._id.type;
										var matchString = {
											't': 'pdtls',
											'subscription.planType': provider
										};
										Details.aggregate({$match: matchString},
											{$project : { email : 1, _id:0},
											}, function(err, result) {
												var dates = [];
												calcDate(0);
												function calcDate(cnt) {
													if(cnt == result.length) {																												
														var returnData = {
															'key': provider,
															'values': dates,
															'total': providers[i].count
														}
														returnArray.push(returnData);
														getProvider(i+1);
													}
													else {
														// var matchString = {
														// 	'prov': result[cnt].email,
														// 	'slots.patient': {$exists: true}
														// }
														matchData.prov = result[cnt].email
														console.log('ct matchString is ', JSON.stringify(matchData));
														// Appointments.find(matchString, {'_id':0,'date':1, 'slots.patient':1}, function(err, appts) {
														Appointments.aggregate(
															{$match: matchData},
															{$project: {
																'_id':0,
																'date':1, 
																'slots.patient':1,
													            'new_date': {
												                        "year": {"$year": "$date"},
												                        "month": {"$month": "$date"},
												                        "date": {"$dayOfMonth": "$date"}
												                    }
													            }
													        },
													        {$match: {'new_date.year': parseInt(givenYear)}},function(err, appts) {
															if(err)
																reply(Boom.forbidden(error(err)));
															else {
																var totalCount = 0;
																console.log('result is ', appts);
																if(appts.length >= 1) {
																	var dateArray = [];
																	_.each(appts, function(appt,k) {
																		if(k == appts.length-1) {
																			var totalCount = 0;
																			_.each(appt.slots,function(slott){
																				if(slott.patient)
																					totalCount = ++totalCount;
																			});
																			var countdata = [];
																			countdata.push((appt.date).today());
																			countdata.push(parseInt(totalCount));
																			// var countdata = {
																			// 	'date': appt.date,
																			// 	'total': parseInt(totalCount)
																			// }
																			// function isEmpty(ob){
																			// 	for(var i in ob){ 
																			// 		return false;
																			// 	}
																			// 	return true;
																			// }

																			// var empties = appt.slots.length; 
																			// appt.slots.forEach(function(x){ 
																			// 	console.log('\n x',x,x.length);
																			// 	// if(x.length == 0 || x.length ==undefined)  
																			// 	if(isEmpty(x))
																			// 		empties-- 
																			// });	
																																					
																			dateArray.push(countdata);
																			var sortDate = _.sortBy(dateArray);
																			var data = {
																				'provider': result[cnt].email,
																				'values': sortDate
																			};
																			dates.push(data);
																			calcDate(cnt+1);
																		}
																		else {
																			// var uniqueData =  appt.slots.filter(Object).length;
																			var totalCount = 0;
																			_.each(appt.slots,function(slott){
																				if(slott.patient)
																					totalCount = ++totalCount;
																			});
																			var countdata = [];
																			// countdata.push(appt.date);
																			countdata.push((appt.date).today());
																			countdata.push(parseInt(totalCount));
																			// var countdata = {
																			// 	'date': appt.date,
																			// 	'total': parseInt(totalCount)
																			// }
																			dateArray.push(countdata);
																		}

																	});
																}
																else {
																	var data = {
																		'provider': result[cnt].email,
																		'values': appts
																	};
																	dates.push(data);
																	calcDate(cnt+1);
																}
																
															}															
														});
													}
												}												
											}
										);
									}						
								}
							}
						}
					});
				}
				else
					reply(Boom.unauthorized('Not authorized to view report'));
			}
		}
	});
};

exports.providerAnalysis = function(server) {
	server.route({
		method: 'GET',
		path: '/v1/providerAnalysis',
		config: {
			auth: 'session',
			handler: function(request, reply) {
				var userRole = request.auth.credentials.role.title; 
				if(userRole === adminAuth.title ) {
					var uniqueValue = [], providerArray = [];
					var resultArray = [], netTotal = 0;
					var zipDetails = [];
					Details.find({'email': {$exists: true}}, {'_id':0, 'email':1, 'location':1, 'firstName':1}, function(err, providers) {
						if(err)
							reply(Boom.forbidden(error(err)));
						else if(!providers) 
							reply(Boom.notFound('No providers'));
						else if(providers) {							
							console.log(JSON.stringify(providers));
							if(providers.length ==0) {
								var result ={};
								reply({hitAnalysis:result});
							}
							else {
								_.each(providers, function(provider, i) {
									var locId = [];
									_.each(provider.location, function(location, j) {	
										var location ={
											zip: location.zip,
											locId: location.locId
										} 	
										locId.push(location);
										if(j === provider.location.length-1) {
											
											if(i === providers.length-1) {
												var user = {
													'name': provider.firstName,
													'location': locId
												}
												uniqueValue.push(user);
												calculate(0);
											}
											else {
												var user = {
													'name': provider.firstName,
													'location': locId
												}
												uniqueValue.push(user);
											}
										} 
									});
								});
							}
						}
					});
					function calculate(i) {
						if(i < uniqueValue.length) {
							var firstIndex = i;
							var singleProvider = uniqueValue[i], lastIndex;
							console.log('singleProvider ', JSON.stringify(uniqueValue[i]));
							_.each(singleProvider.location, function(location, j) {
								lastIndex = j;							
								console.log('ct locaion isss ', location, location.locId);
								Appointments.aggregate({$match: {'loc': location.locId, 'slots.patient': {$exists: true}}},{$group : {_id : "$loc",total: {$sum: 1}}}, function(err, appt) {
									if(err)
										reply(Boom.forbidden(error(err)));
									else if(!appt || appt.length < 1) {
										console.log('no appointments');	
										if(lastIndex === singleProvider.location.length-1)
											calculate(i+1);						
									}
									else if(appt || appt.length >= 1) {
										zipDetails = [];
										if(lastIndex === singleProvider.location.length-1) {
											var result = [];
											result.push(location.zip);
											result.push(appt[0].total);
											netTotal = parseInt(netTotal) + appt[0].total;
											zipDetails.push(result);
											// var provider = {
											// 	'zip': singleProvider.zip,
											// 	'total': netTotal,
											// 	'values': zipDetails
											// }
											var value = {
												values: zipDetails
											}
											var providers = [];
											providers.push(value);
											var provider = [];
											provider.push(singleProvider.name);
											provider.push(netTotal);
											provider.push({providers: providers});
											resultArray.push(provider);
											console.log('\nresultArray is ', JSON.stringify(resultArray));
											calculate(i+1);
										}
										else {												
											var result = [];
											result.push(location.zip);
											result.push(appt[0].total);
											zipDetails.push(result);
											console.log('zipDetails ', JSON.stringify(zipDetails));
										}
									}
								});
							});
						}
						if(i >= uniqueValue.length ) {
							console.log('lastIndex');
							reply({hitAnalysis:resultArray});
						}
					}
				}
				else
					reply(Boom.unauthorized('Not authorized to view report'));
			}
		}
	});
};

exports.onBoard = function(server) {
	server.route({
		method: 'GET',
		path:'/v1/onBoard',
		config: {
			auth: 'session',
			validate: {
				query: {
					month: Joi.string(),
					year: Joi.string(),
					fromDate: Joi.string(),
					toDate: Joi.string()
				}
			},
			handler: function(request, reply) {
				var userRole = request.auth.credentials.role.title; 
				var givenYear = new Date().getFullYear();
				if(userRole === adminAuth.title ) {
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
					console.log('dates ', firstDay, lastDay);
					var matchString = {
						't':'pdtls',
			            'createdAt': { 
		                	$gte: firstDay, 
		                  	$lte: lastDay
		                }
		         	};	
		         	if(request.query.year && !request.query.month) {        	
		         		givenYear = request.query.year;
		         		delete matchString.createdAt;
		         	}
		         	//console.log('matchString is ', JSON.stringify(matchString));				         	
					dumpProvider.aggregate([
						{$match: matchString},	
				        {$project: {
				            createdAt: 1,
				            new_date: {
			                        "year": {"$year": "$createdAt"},
			                        "month": {"$month": "$createdAt"},
			                        "date": {"$dayOfMonth": "$createdAt"}
			                    }
				            }
				        },
				        {$match: {'new_date.year': parseInt(givenYear)}},
				        {$group:
				            {						            	
				            	_id: "$new_date",
				            	books: {$sum: 1}
				            }
				        },
				        {$sort: {"_id.new_date":1 }}
					    ], function(err, reports) {
							console.log(reports);
							if(err)
								reply(Boom.forbidden(error(err)));
							if(!reports )
								reply(Boom.notFound('Registration not found'));
							if(reports) {
								// reply(reports);
								var result = [];
								if(reports.length == 0) {
									var result = {};
									reply({report:result})
								}
								else {
									_.each(reports, function(report, i) {
										var month = report._id.month;
										var day = report._id.date
										if(month < 10)
											month = '0'+month;
										if(day < 10)
											day = '0'+day;								
										var date = (month+'-'+day+'-'+report._id.year);								
										var individual = {
											'date': date,
											'total': report.books
										}
										result.push(individual);
										if(i === reports.length-1) {
											var returnData = [];
											var total = 0;
											var sorted = _.sortBy(result, function(sortedResult){
												return(sortedResult.date);
											});
											console.log('sorted list ', sorted);
											_.each(sorted, function(single, i) {
												var individual = [];
												var date = new Date(single.date).getTime();
												// var date = (single.date);
												individual.push(date);
												individual.push(single.total);
												total = parseInt(total)+ single.total;
												returnData.push(individual);
												if(i === sorted.length-1) {
													var data = {
														'key': 'provider',
														'values': returnData,
														'total': total
													}
													reply({report:data});
												}
											});
										}
									});	
								}
							}
						}
					);
				}
				else
					reply(Boom.unauthorized('Not authorized to view report'));
			}
		}
	});
};

exports.onBoardType = function(server) {
	server.route({
		method: 'GET',
		path:'/v1/onBoardType',
		config: {
			auth: 'session',
			validate: {
				query: {
					month: Joi.string(),
					year: Joi.string(),
					fromDate: Joi.string(),
					toDate: Joi.string()
				}
			},
			handler: function(request, reply) {
				var userRole = request.auth.credentials.role.title; 
				if(userRole === adminAuth.title ) {
					var m, y, d=1, date, firstDay, lastDay;
					var givenYear = new Date().getFullYear();
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
					console.log('dates ', firstDay, lastDay);
					var matchString = {
						't':'pdtls',
			            'createdAt': { 
		                	$gte: firstDay, 
		                  	$lte: lastDay
		                }
		         	};
		         	if(request.query.year && !request.query.month) {
		         		givenYear = request.query.year;
		         		delete matchString.createdAt;
		         	}
					dumpProvider.aggregate([
						{$match: matchString},	
				        {$project: {
					            createdAt: 1,
					            'subscription.planType': 1,
					            year: {$year: '$createdAt'}
				            }
				        },
				        {$match: {year: parseInt(givenYear)}},
				        {$group:
				            {						            	
				            	_id: "$subscription.planType",
				            	books: {$sum: 1}
				            }
				        },
				        {$sort: {"_id.subscription.planType":1 }}
					    ], function(err, reports) {
							console.log(reports);
							if(err)
								reply(Boom.forbidden(error(err)));
							if(!reports)
								reply(Boom.notFound('Registration not found'));
							if(reports) {
								console.log('result for onBoardType ', JSON.stringify(reports));
								var result = [];
								if(reports.length == 0) {
									var result = {};
									reply({report:result})
								}
								else {
									_.each(reports, function(report, i) {
										console.log('current report', report);						
										var individual = {
											'type': report._id,
											'total': report.books
										}
										result.push(individual);
										if(i === reports.length-1) {
											var returnData = [];
											var total = 0;
											_.each(result, function(single, i) {
												var individual = [];
												individual.push(single.type);
												individual.push(single.total);
												total = parseInt(total)+ single.total;
												returnData.push(individual);
												if(i === result.length-1) {
													var data = {
														'key': 'provider',
														'values': returnData,
														'total': total
													}
													reply({report:data});
												}
											});
										}
									});
								}	
							}
						}
					);
				}
				else
					reply(Boom.unauthorized('Not authorized to view report'));
			}
		}
	});
};

exports.patientReport = function(server) {
	server.route({
		method: 'GET',
		path: '/v1/patientReport',
		config: {
			auth: 'session',
			validate:{
				query: {
					email: Joi.string().email().required(),
					fromDate: Joi.string(),
					toDate: Joi.string(),
					month: Joi.string(),
					year: Joi.string()
					// type: Joi.string().required()
				}
			},
			handler: function(request, reply) {
				if(request.query.email != request.auth.credentials.profile.email)
					reply(Boom.forbidden("Cannot access other's details"));
				if(request.query.email === request.auth.credentials.profile.email) {
					var m, y, d=1, date, firstDay, lastDay;
					var givenYear = new Date().getFullYear();
					Date.prototype.today = function () { 
					    return (((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) + "-"+ ((this.getDate() < 10)?"0":"") + this.getDate() +"-"+ this.getFullYear();
					}
					// var today = new Date().today();
					if(request.query.month && request.query.year) {
						m = parseInt(request.query.month) - 1;
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

					console.log(firstDay, ' is firstDay ', lastDay);
					var matchString = {
						"patient": request.query.email,
			            "date" : { 
		                	$gte: firstDay,
		                  	$lte: lastDay
		                }

		         	};
		         	if(request.query.year && !request.query.month) {
		         		givenYear = request.query.year;
		         		delete matchString.date;
		         	}
		         	console.log('string ', JSON.stringify(matchString));
					patAppointments.aggregate({$match: matchString}, 
						{$project: {
							'_id':0, 'date':1, 'time':1, 'prov':1, 'provEmail':1, 'loc':1, 'reason':1, 'offer':1, 'year': {'$year': '$date'}
						}}, 
						{$match: {year: parseInt(givenYear)}}, 
						{$sort: {'date':1}},
						function(err, getPatient) {
							console.log('getPatient', JSON.stringify(getPatient));
						if(err) reply(Boom.forbidden(error(err)));
						if(!getPatient) reply(Boom.notFound('No past appointment'));
						if(getPatient) {
							Date.prototype.today = function () { 
								return (((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) + "-"+ ((this.getDate() < 10)?"0":"") + this.getDate() +"-"+ this.getFullYear();
							}
							if(getPatient.length <= 0) {
								var result = {
									values: getPatient,
									total: getPatient.length
								}
								// console.log('result is ', result);
								reply({appointment:result});
							}
							else {
								_.each(getPatient, function(patient, i) {
									patient.date = (patient.date).today();
									delete patient.year;
									if(i == getPatient.length-1) {
										var result = {
											values: getPatient,
											total: getPatient.length
										}
										// console.log('result is ', result);
										reply({appointment:result});		
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

exports.providerReport = function(server) {
	server.route({
		method: 'GET',
		path: '/v1/providerReport',
		config: {
			auth: 'session',
			validate: {
				query: {
					email: Joi.string().email().required(),
					fromDate: Joi.string(),
					toDate: Joi.string(),
					month: Joi.string(),
					year: Joi.string()
				}
			},
			handler: function(request, reply) {				
				if(request.query.email != request.auth.credentials.profile.email)
					reply(Boom.forbidden("Cannot access other's details"));
				if(request.query.email === request.auth.credentials.profile.email) {
					var m, y, d=1, date, firstDay, lastDay;
					var givenYear = new Date().getFullYear();
					Date.prototype.today = function () { 
					    return (((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) + "-"+ ((this.getDate() < 10)?"0":"") + this.getDate() +"-"+ this.getFullYear();
					}
					// var today = new Date().today();
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

					console.log(firstDay, ' is firstDay ', lastDay);
					var matchString = {
						'prov':request.query.email,
						$or: [{'slots.patient':{$exists:true}}, {'slots.cancelled': {$exists:true}}],
						// 'slots.patient':{$exists:true},
			            "date" : { 
		                	$gte: firstDay,
		                  	$lte: lastDay
		                }

		         	};
		         	if(request.query.year && !request.query.month) {
		         		givenYear = request.query.year;
		         		delete matchString.date;
		         	}
		         	console.log('string ', JSON.stringify(matchString));

					Appointments.aggregate({$match: matchString},
						{$project: {'_id':0,'date':1,'loc':1,'slots':1, 'year': {'$year': '$date'}}}, 
						{$match: {year: parseInt(givenYear)}}, {$sort: {'date':1}},function(err, appointments) {
						if(err)
							reply(Boom.forbidden(error(err)));
						if(!appointments) 
							reply(Boom.notFound('No appointments'));
						if(appointments) {	
							var totalLength = 0;;
							var resultArray = [];
							resultCalc(0);
							function resultCalc(i) {
								if(i == appointments.length) {
									var result = {
										values: resultArray,
										total: totalLength
									}
									reply({appointment:result});
								}
								else {									
									var slots = [];
									_.each(appointments[i].slots, function(slot) {
										delete slot.year;
										if(slot.patient)
											slots.push(slot)
										else if(slot.cancelled)
											slots.push(slot)
									});									
									var result = {
										date: appointments[i].date.today(),
										location: appointments[i].loc,
										slot: slots
									}
									totalLength = parseInt(totalLength)+slots.length;
									resultArray.push(result);
									resultCalc(i+1);
								}
							}
						}
					});
				}
			}
		}
	});
};