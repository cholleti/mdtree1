var Boom =  require("boom"),
	Joi = require("joi"),
	_ = require("underscore"),
	error = require('./config').errorMessage,
	Details = require("../models/provdetails").Details,
	Appointments = require("../models/provappts").Appointments;

module.exports = exports = function(server) {
	exports.search(server);
};

exports.search = function(server) {
	server.route({
		method: "GET",
		path: "/v1/provider/search",
		config: {
			validate: {
				query: {
					specialty: Joi.string().required(),
					insurance: Joi.string(),
					zip: Joi.string().required(),
					category: Joi.string().required(),
					start: Joi.string(),
					count: Joi.string(),
					email: Joi.string().email(),
					gender: Joi.string(),
					languages: Joi.array(),
					name: Joi.string(),
					startindex: Joi.number()
				}
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
			var today = new Date();
			var	dates=[], resultantArray=[], appointment=[],  apptDate=[], apptSlot=[], chkdates=[], timeschedule=[];
			var	locId, count, providers = [], err, dateCount, queryString, i, j, queryparam, getproviders =[];			
			if(request.query.email === undefined) 
				dateCount=3;
			if(request.query.email != undefined)
				dateCount=5;
			var dates=[];
			var today = new Date();
			var startindex, dateindex;
			if(request.query.startindex === undefined)
				dateindex = 0;
			if(request.query.startindex != undefined)
				dateindex = parseInt(dateCount) * request.query.startindex;
			for (var i=0; i<dateCount; i++) {
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
			var url = require('url'),
				url_parts = url.parse(request.url, true),
				query = url_parts.query,
				newquery,
				languages = [];
			if(request.query.languages != undefined) {
				for (var i=0; i< (request.query.languages).length; i++) 
					languages.push((request.query.languages)[i].toLowerCase());
			}
			var insurance = [];
			if(query.insurance != undefined && query.insurance != 'insure_1') {
				insurance.push('insure_1');
				insurance.push(query.insurance);
			}
			else if(query.insurance === undefined || query.insurance === 'insure_1') 
				insurance.push('insure_1');

			if(query.name != undefined) {
				newquery = {
					"category": (query.category).toLowerCase(),
					"location.zip": query.zip,
					"specialty": (query.specialty).toLowerCase(),
					"insurance": {$in:insurance},
					"languages": {$in:languages},
					"gender": query.gender,
					"email": query.email,
					$or: [{"firstName": {$regex:".*"+query.name+".*"}},{"lastName": {$regex:".*"+query.name+".*"}}]
				}
			}
			if(query.name === undefined) {
				newquery = {
					"category": (query.category).toLowerCase(),
					"location.zip": query.zip,
					"specialty": (query.specialty).toLowerCase(),
					"insurance": {$in:insurance},
					"languages": {$in: languages},
					"gender": query.gender,
					"email": query.email
				}
			}
			if(query.insurance === undefined)
				delete newquery.insurance;
			if(query.insurance != undefined)
				newquery.insurance = newquery.insurance;
			if(query.languages === undefined)
				delete newquery.languages;
			if(query.email === undefined)
				delete newquery.email;
			if(query.gender === undefined)
				delete newquery.gender;
			if(query.name === undefined)
				delete newquery.firstName;
			if(query.name === undefined)
				delete newquery.lastName;	
			console.log('newquery to find is ', newquery);
			if(query != undefined) {
				
				Details.find(newquery).exec(function(err, getproviders) {
					if(err)
						reply(Boom.forbidden(error(err)));
					if(getproviders.length === 0) 
						reply(Boom.notFound("No exact matching"));
					if(getproviders.length != 0) {						
						var goldProviders = [], silverProviders = [], bronzeProviders = [], freeProviders =[], randomArray =[];						
						getproviders = _.shuffle(getproviders);
						var group = _.groupBy(getproviders, function(getproviders) {
							return (getproviders.subscription.planType)
						});	
						// console.log("Result from DB" + JSON.stringify(group));
						goldProviders = (group["gold"]);
						silverProviders = (group["silver"]);
						bronzeProviders = (group["bronze"]);
						freeProviders = (group["free"]);								
						if(goldProviders !=undefined) {
							for(var index=0; index<goldProviders.length; index++) {						
								if(goldProviders[index] != undefined)
									randomArray.push(goldProviders[index]);
							}
						}
						
						if(silverProviders != undefined) {
							for(var index=0; index<silverProviders.length; index++) {
								if(silverProviders[index] != undefined)
									randomArray.push(silverProviders[index]);
							}
						}
						if(bronzeProviders != undefined) {
							for(var index=0; index<bronzeProviders.length; index++){
								if(bronzeProviders[index] != undefined)
									randomArray.push(bronzeProviders[index]);
							}
						}
						if(freeProviders != undefined) {
							for(var index=0; index<freeProviders.length; index++) {
								if(freeProviders[index] != undefined)
									randomArray.push(freeProviders[index]);
							}
						}
						for( var index =0; index<randomArray.length; index++)
							providers.push(randomArray[index]);
						console.log('finished pushing... ', providers);
						getDetails(0);
					}
				});
			}	

			function getDetails(a) {
				// console.log('Provider index', a);
				// console.log('In getDetails method - providers ', JSON.stringify(resultantArray[a-1]));
				console.log('from outside count value:', count);
				console.log('from outside a value:', a);
				if(a < providers.length) {
					for(var i=0; i<(providers[a].location).length; i++) {
						if(providers[a].location[i].zip === request.query.zip) {
							var specialOfferDates = [];
							loc = i;
							locId = providers[a].location[i].locId;
							appts=[], appointment=[];
							if(providers[a].specialOffer)
								specialOfferDates = providers[a].specialOffer.dates;
							Appointments.find({"loc": locId, "date":{$in: dates}},
								{"date":1, "slots.status":1, "slots.from":1, "_id":0},
								{sort:({date:1})},
								function(err, appts) {											
									var count = a;
								if(err)
									reply(Boom.forbidden(error(err)));
								if(appts) {
									if(appts.length === 0) {
										appointment=[];
										for( var k=0; k<dates.length;k++) {																										
											var slot=[];
											var apptSchedule = {
												"date": dates[k],
												"slots": slot
											}	
											appointment.push(apptSchedule);	
										}
									}
									if(appts.length != 0) {
										for(var m=0; m<dates.length; m++) {
											var len = appts.length;
											var title, description;
											for(var n=0; n<appts.length; n++) {
												if(dates[m] === appts[n].date) {													
													apptSchedule = {														
														"date": dates[m],
														"slots": appts[n].slots
													}
													if(specialOfferDates.has(dates[m])) {
														apptSchedule.title = providers[a].specialOffer.title; 
														apptSchedule.description = providers[a].specialOffer.description;
													}
													
													appointment.push(apptSchedule);
													appts.splice(n, 1);
													break;
												}
												if(dates[m] != appts[n].date) {
													var slot=[];
													apptSchedule = {
														"date": dates[m],
														"slots": slot
													}	
													appointment.push(apptSchedule);	
													break;
												}
											}													
											if(dates[m] != apptSchedule.date ) {
												var slot=[];
												var apptSchedule = {
													"date": dates[m],
													"slots": slot
												}	
												appointment.push(apptSchedule);
											}
										}
									}
								}
								if(dateCount === 3) {
									console.log('inside count value:', count);
									console.log('inside a value:', a);
									var result = {
										"email": providers[count].email,												
										"name": providers[count].title+" "+providers[count].firstName+" "+providers[count].lastName,
										"image": providers[count].image,	
										"locationId": providers[count].location[loc].locId,						
										"address": providers[count].location[loc].address,
										"city": providers[count].location[loc].city,
										"state": providers[count].location[loc].state,
										"zip": providers[count].location[loc].zip,
										"phone": providers[count].location[loc].phone1,
										"appointmentSchedules": appointment,
										"plan": providers[count].subscription.planType,
										"cash": providers[count].cash,
							            "offerStmt": providers[count].offer,
							            "website": providers[count].webSite,
							            "rating": providers[count].rating
									}
									if(resultantArray.length === 0)
										resultantArray.push(result);
									else if(resultantArray.length > 0) {
										var len = resultantArray.length;
										if(resultantArray[len-1].email === result.email) {
											resultantArray.pop();
											resultantArray.push(result);											 
										}
										else
											resultantArray.push(result);
									}
									getDetails(count+1);
								}
								if(dateCount === 5) {
									var result = {
										"email": providers[count].email,												
										"name": providers[count].title+" "+providers[count].firstName+" "+providers[count].lastName,
										"image": providers[count].image,
										"locationId": providers[count].location[loc].locId,							
										"address": providers[count].location[loc].address,
										"city": providers[count].location[loc].city,
										"state": providers[count].location[loc].state,
										"zip": providers[count].location[loc].zip,
										"phone": providers[count].location[loc].phone1,
										"appointmentSchedules": appointment,
										"plan": providers[count].subscription.planType
									}
									reply({provider:result, total: providers.length});
								}
							});																		
						}									
					}							
				}	
				if(a >= providers.length) {
					// if(request.query.start != undefined && request.query.count != undefined) {
					// 	var cnt;
					// 	if(request.query.count <= providers.length)
					// 		cnt = request.query.count;
					// 	if(request.query.count > providers.length)
					// 		cnt = providers.length;
					// 	reply({provider: resultantArray.slice(request.query.start, request.query.count), start: request.query.start, count: cnt, total: providers.length});
					// }
					// else if(request.query.start == undefined && request.query.count == undefined)
					// 	reply({providers: resultantArray, total: providers.length});
					// console.log("Result is ", JSON.stringify(resultantArray));
					reply({providers:resultantArray, total: providers.length});
				}
			}		
			function generate() {
				if(err)
					reply(Boom.forbidden(error(err)));
				if(providers.length === 0) 
					reply(Boom.notFound("No exact matching"));
				if(providers.length != 0) {
					getDetails(0);																
				}
			}									
		}
	});
};