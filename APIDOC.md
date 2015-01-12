# API DOCUMENT #


## Patient ##

### SIGN UP ###

* Method: POST	
* Path: /v1/patient/register
* Body: firstName - String, lastName - String, zipCode - String, gender - String, dob - Date, email - String(email), phone - String, password - String, question - String, answer - String 
* Sample Input: curl -H "accept:application/json" -H "content-type:application/json" -X POST -d '{"firstName":"ampal","lastName":"testuser","zipCode":"62508","gender":"male","dob":"1983-07-12","email":"user2@gmail.com","phone":"9976545220","password":"testuser","question":"what was your childhood ambition?","answer":"teacher"}' http://localhost:8000/v1/patient/register
* Sample Output: {"user":{"username":"ampal","role":{"title":"patient","bitMask":"3"}}}
* Description: Creates patient's record with given details. It will generate the token for the each patient

### SIGN IN ###

* Method: POST
* Path: /v1/login
* Body: email - String (email), password - String
* Sample Input: curl -H "accept:application/json" -H "content-type:application/json" -X POST -d '{"email":"user2@gmail.com","password":"testuser"}' http://localhost:8000/v1/login
* Sample Output: {"user":{"username":"ampal","role":{"title":"patient","bitMask":"3"}}} 
* Description: It will generate the token for authorized user.


## Provider ##

### SIGN UP ###

* Method: POST
* Path: /v1/provider/register
* Body: 
	* Required Fields: category - String, title - String, firstName - String, lastName - String, zipCode - String, dob - String, email - String(email), password - String, question - String, answer - String, notification - String, cash - String, cancellationNumber - String, address - String, state - String, city - string, zip - String, phone1 - String, school - String, languages - Array, plan - String

	* Optional Fields: specialty - String, gender - String, webSite - String, practiceName - String, pbone2 - String, fax - String, residency - String, fellowship - String, affilliation - String, insurance - array, statement - String, image - String, billing - String, price - String, total - String
* Sample Input: curl -H "accept:application/json" -H "content-type:application/json" -X POST -d '{"category":"doctor","title":"Ms.","firstName":"testdoctor","lastName":"ampal","zipCode":"69856","gender":"female","dob":"1778-05-18","webSite":"www.testwebsite.com","question":"what is your shcool  name","answer":"government school","notification":"testdoctor@gmail.com","cash":"450","cancellationNumber":"8596743215","location":[{"practiceName":"ampal clinic","address":"2,T.Nagar,kovai","state":"tamil nadu","city":"kovai","zip":"60010","phone1":"8798745895","phone2":"9685743217","fax":"5897465"},{"practiceName":"amirtha clinic","address":"2,annanagar,vellore","state":"tamilnadu","city":"vellore","zip":"600 007","phone1":"8998845896","phone2":"9665843218","fax":"8997466"}],"school":"govt school","residency":"89,gandhi nagar,anna salai, chennai","fellowship":"ampal","affilliation":"mail","languages":["tamil","english","spanish"],"statement":"good","insurance":["sbi health insurance"],"specialty":"eyespecialist","email":"ampaldoctor1@ampaltech.com","password":" ampaldoctor ","plan":"gold","billing":"monthly","price":"600","total":"1200","image":"./images/ampaldoctor1}' http://localhost:8000/v1/provider/register
* Sample Output: {"user":{"username":"testdoctor","role":{"title":"provider","bitMask":"2"}}}
* Description: It will create the doctor's record and returns token to the provider

### Sign In ###

* Method: POST
* Path: /v1/login
* Body: email - String (email), password - String
* Sample Input: curl -H "accept:application/json" -H "content-type:application/json" -X POST -d '{"email":"ampaldoctors@gmail.com","password":"ampaldoctor"}' http://localhost:8000/v1/login
* Sample Output: {"user":{"username":"testdoctor","role":{"title":"provider","bitMask":"2"}}}
* Description: It will generate the token for authorized user.

### Provider Interest ###

* Method: POST
* Path: /v1/providerinterest
* Body:
    * Required Fields: name - String, practice - String, email - String(email), message - String
    * Optional Fields: city - String, state - String, phone - String
* Sample Input: curl -H "accept:application/json" -H "content-type:application/json" -X POST -d '{"name":"interset1","email":"vaishnavi@ampaltech.com","practice":"dentist","message":"interest to sign up with mdtree"}' http://localhost:8000/v1/providerinterest
* Sample Output: {"providerinterest":"vaishnavi@ampaltech.com"}
* Description: It will automatically generate an email to the interested provider


## Search ##

* Method: GET
* Path: /v1/provider/search
* Query params: 
	* Required Params: specialty - String, zip - String, category - String
	* Optional Param: insurance - String
* Sample Input: http://localhost:8000/v1/provider/search?zip=90001&specialty=orthodontics&category=dentists
* Given params: zip, specialty, category
* Sample Output: {
    "providers": [
        {
            "email": "thivakar@gmail.com",
            "name": "Dr. thivakar N",
            "image": "../userimage/1410175183050-2746-42144492b652dd90.jpeg",
            "address": "7, main road"
            "city":"AGS",
            "state": "FL",
            "zip": "90002",
            "phone": "8796857485",
            "appointmentSchedules": [
                {
                    "date": "09-15-2014",
                    "slots": []
                },
                {
                    "date": "09-16-2014",
                    "slots": []
                },
                {
                    "date": "09-17-2014",
                    "slots": []
                }
            ],
            "plan": "Gold",
            "offerStmt": "enhancedcare MDCONNECT Member Discount: 50% - 60%"
        },
        {
            "email": "dheeraj@gmail.com",
            "name": "Dr. dheeraj S",
            "image": "./userimage/1410177108694-1338-4f94f6815b2d3bdd.jpeg",
            "address": "23, hallll street,
            "city":"AGS",
            "state": "HI",
            "zip": "90002",
            "phone": "8796857485",
            "appointmentSchedules": [
                {
                    "date": "09-15-2014",
                    "slots": [
                        {
                            "slotStatus": "available",
                            "status": "available",
                            "from": "06:30PM"
                        },
                        {
                            "slotStatus": "available",
                            "status": "available",
                            "from": "07:00PM"
                        },
                        {
                            "slotStatus": "booked",
                            "status": "booked",
                            "from": "07:30PM"
                        }
                    ]
                },
                {
                    "date": "09-16-2014",
                    "slots": []
                },
                {
                    "date": "09-17-2014",
                    "slots": [
                        {
                            "slotStatus": "available",
                            "status": "available",
                            "from": "06:30PM"
                        },
                        {
                            "slotStatus": "available",
                            "status": "available",
                            "from": "07:00PM"
                        },
                        {
                            "slotStatus": "available",
                            "status": "available",
                            "from": "07:30PM"
                        }
                    ]
                }
            ],
            "plan": "Silver",
            "offerStmt": "enhancedcare MDCONNECT Member Discount: 50% - 60%",
            "rating": "3"
        }
    ],
    "total": 2
}

* Sample Input: http://localhost:8000/v1/provider/search?zip=90001&specialty=orthodontics&category=dentists&insurance=aarp
* Given param :zip, specialty, category, insurance
* Sample Output: {
    "providers": [
        {
            "email": "thivakar@gmail.com",
            "name": "Dr. thivakar N",
            "image": "../userimage/1410175183050-2746-42144492b652dd90.jpeg",
            "address": "7, main road"
            "city":"AGS",
            "state": "FL",
            "zip": "90002",
            "phone": "8796857485",
            "appointmentSchedules": [
                {
                    "date": "09-15-2014",
                    "slots": []
                },
                {
                    "date": "09-16-2014",
                    "slots": []
                },
                {
                    "date": "09-17-2014",
                    "slots": []
                }
            ],
            "plan": "Gold",
            "offerStmt": "enhancedcare MDCONNECT Member Discount: 50% - 60%"
        },
        {
            "email": "dheeraj@gmail.com",
            "name": "Dr. dheeraj S",
            "image": "./userimage/1410177108694-1338-4f94f6815b2d3bdd.jpeg",
            "address": "23, hallll street,
            "city":"AGS",
            "state": "HI",
            "zip": "90002",
            "phone": "8796857485",
            "appointmentSchedules": [
                {
                    "date": "09-15-2014",
                    "slots": [
                        {
                            "slotStatus": "available",
                            "status": "available",
                            "from": "06:30PM"
                        },
                        {
                            "slotStatus": "available",
                            "status": "available",
                            "from": "07:00PM"
                        },
                        {
                            "slotStatus": "available",
                            "status": "booked",
                            "from": "07:30PM"
                        }
                    ]
                },
                {
                    "date": "09-16-2014",
                    "slots": []
                },
                {
                    "date": "09-17-2014",
                    "slots": [
                        {
                            "slotStatus": "available",
                            "status": "available",
                            "from": "06:30PM"
                        },
                        {
                            "slotStatus": "available",
                            "status": "available",
                            "from": "07:00PM"
                        },
                        {
                            "slotStatus": "available",
                            "status": "available",
                            "from": "07:30PM"
                        }
                    ]
                }
            ],
            "plan": "Silver",
            "offerStmt": "enhancedcare MDCONNECT Member Discount: 50% - 60%",
            "rating": "3"
        }
    ],
    "total": 2
}
* Description: Return provider details based on given parameter values

* Sample Input: http://localhost:8000/v1/provider/search?zip=90002&specialty=cardiology&category=doctors&insurance=AArp&startindex=1
* Sample Output: {
    "providers": [
        {
            "email": "thivakar@gmail.com",
            "name": "Dr. thivakar N",
            "image": "../userimage/1410175183050-2746-42144492b652dd90.jpeg",
            "address": "7, main road"
            "city":"AGS",
            "state": "FL",
            "zip": "90002",
            "phone": "8796857485",
            "appointmentSchedules": [
                {
                    "date": "09-18-2014",
                    "slots": []
                },
                {
                    "date": "09-19-2014",
                    "slots": []
                },
                {
                    "date": "09-20-2014",
                    "slots": []
                }
            ],
            "plan": "Gold",
            "offerStmt": "enhancedcare MDCONNECT Member Discount: 50% - 60%"
        },
        {
            "email": "dheeraj@gmail.com",
            "name": "Dr. dheeraj S",
            "image": "./userimage/1410177108694-1338-4f94f6815b2d3bdd.jpeg",
            "address": "23, hallll street,
            "city":"AGS",
            "state": "HI",
            "zip": "90002",
            "phone": "8796857485",
            "appointmentSchedules": [
                {
                    "date": "09-18-2014",
                    "slots": []
                },
                {
                    "date": "09-19-2014",
                    "slots": []
                },
                {
                    "date": "09-20-2014",
                    "slots": []
                }
            ],
            "plan": "Silver",
            "offerStmt": "enhancedcare MDCONNECT Member Discount: 50% - 60%",
            "rating": "3"
        }        
    ],
    "total": 2
}
* Description: Response search result with next set of slots

* Sample Input: http://localhost:8000/v1/provider/search?zip=90002&specialty=cardiology&category=doctors&insurance=aarp&email=dheeraj@gmail.com
* Sample Output: {
    "provider": {
        "email": "dheeraj@gmail.com",
        "name": "Dr. dheeraj S",
        "image": "./userimage/1410177108694-1338-4f94f6815b2d3bdd.jpeg",
        "address": "23, hallll street,
        "city":"AGS",
        "state": "HI",
        "zip": "90002",
        "phone": "8796857485",
        "appointmentSchedules": [
            {
                "date": "09-15-2014",
                "slots": [
                    {
                        "slotStatus": "available",
                        "status": "available",
                        "from": "06:30PM"
                    },
                    {
                        "slotStatus": "available",
                        "status": "available",
                        "from": "07:00PM"
                    },
                    {
                        "slotStatus": "booked`",
                        "status": "booked",
                        "from": "07:30PM"
                    }
                ]
            },
            {
                "date": "09-16-2014",
                "slots": []
            },
            {
                "date": "09-17-2014",
                "slots": [
                    {
                        "slotStatus": "available",
                        "status": "available",
                        "from": "06:30PM"
                    },
                    {
                        "slotStatus": "available",
                        "status": "available",
                        "from": "07:00PM"
                    },
                    {
                        "slotStatus": "available",
                        "status": "available",
                        "from": "07:30PM"
                    }
                ]
            },
            {
                "date": "09-18-2014",
                "slots": []
            },
            {
                "date": "09-19-2014",
                "slots": []
            }
        ],
        "plan": "Silver"
    },
    "total": 1
}
* Description: Return specific provider details with next 5 days appointment schedule

* Sample Input: http://localhost:8000/v1/provider/search?zip=90002&specialty=cardiology&category=doctors&insurance=AArp&startindex=1&email=dheeraj@gmail.com
* Sample Output: {
    "provider": {
        "email": "dheeraj@gmail.com",
        "name": "Dr. dheeraj S",
        "image": "./userimage/1410177108694-1338-4f94f6815b2d3bdd.jpeg",
        "address": "23, hallll street,
        "city":"AGS",
        "state": "HI",
        "zip": "90002",
        "phone": "8796857485",
        "appointmentSchedules": [
            {
                "date": "09-20-2014",
                "slots": []
            },
            {
                "date": "09-21-2014",
                "slots": []
            },
            {
                "date": "09-22-2014",
                "slots": [
                    {
                        "slotStatus": "available",
                        "status": "available",
                        "from": "06:30PM"
                    },
                    {
                        "slotStatus": "available",
                        "status": "available",
                        "from": "07:00PM"
                    },
                    {
                        "slotStatus": "available",
                        "status": "available",
                        "from": "07:30PM"
                    }
                ]
            },
            {
                "date": "09-23-2014",
                "slots": [
                    {
                        "slotStatus": "available",
                        "status": "available",
                        "from": "06:30PM"
                    },
                    {
                        "slotStatus": "available",
                        "status": "available",
                        "from": "07:00PM"
                    },
                    {
                        "slotStatus": "available",
                        "status": "available",
                        "from": "07:30PM"
                    }
                ]
            },
            {
                "date": "09-24-2014",
                "slots": []
            }
        ],
        "plan": "Silver"
    },
    "total": 1
}
* Description: List next set of slots for the provider

* Sample Input: http://localhost:8000/v1/provider/search?zip=90002&specialty=cardiology&category=doctors&insurance=aarp&name=dheeraj
* Sample Output: {
    "provider": {
        "email": "dheeraj@gmail.com",
        "name": "Dr. dheeraj S",
        "image": "./userimage/1410177108694-1338-4f94f6815b2d3bdd.jpeg",
        "address": "23, hallll street,
        "city":"AGS",
        "state": "HI",
        "zip": "90002",
        "phone": "8796857485",
        "appointmentSchedules": [
            {
                "date": "09-15-2014",
                "slots": [
                    {
                        "slotStatus": "available",
                        "status": "available",
                        "from": "06:30PM"
                    },
                    {
                        "slotStatus": "available",
                        "status": "available",
                        "from": "07:00PM"
                    },
                    {
                        "slotStatus": "available",
                        "status": "booked",
                        "from": "07:30PM"
                    }
                ]
            },
            {
                "date": "09-16-2014",
                "slots": []
            },
            {
                "date": "09-17-2014",
                "slots": [
                    {
                        "slotStatus": "available",
                        "status": "available",
                        "from": "06:30PM"
                    },
                    {
                        "slotStatus": "available",
                        "status": "available",
                        "from": "07:00PM"
                    },
                    {
                        "slotStatus": "available",
                        "status": "available",
                        "from": "07:30PM"
                    }
                ]
            },
            {
                "date": "09-18-2014",
                "slots": []
            },
            {
                "date": "09-19-2014",
                "slots": []
            }
        ],
        "plan": "Silver"
    },
    "total": 1
}
* Description: Return specific provider details

* http://localhost:8000/v1/provider/search?zip=90002&specialty=cardiology&category=doctors&insurance=AArp&languages=["English","Tamil"]
* Sample Output: {
    "providers": [
        {
            "email": "thivakar@gmail.com",
            "name": "Dr. thivakar N",
            "image": "../userimage/1410175183050-2746-42144492b652dd90.jpeg",
            "address": "23, hallll street,
            "city":"AGS",
            "state": "HI",
            "zip": "90002",
            "phone": "8796857485",
            "appointmentSchedules": [
                {
                    "date": "09-15-2014",
                    "slots": []
                },
                {
                    "date": "09-16-2014",
                    "slots": []
                },
                {
                    "date": "09-17-2014",
                    "slots": []
                }
            ],
            "plan": "Gold",
            "offerStmt": "enhancedcare MDCONNECT Member Discount: 50% - 60%"
        },
        {
            "email": "dheeraj@gmail.com",
            "name": "Dr. dheeraj S",
            "image": "./userimage/1410177108694-1338-4f94f6815b2d3bdd.jpeg",
            "address": "23, hallll street,
            "city":"AGS",
            "state": "HI",
            "zip": "90002",
            "phone": "8796857485",
            "appointmentSchedules": [
                {
                    "date": "09-15-2014",
                    "slots": [
                        {
                            "slotStatus": "available",
                            "status": "available",
                            "from": "06:30PM"
                        },
                        {
                            "slotStatus": "available",
                            "status": "available",
                            "from": "07:00PM"
                        },
                        {
                            "slotStatus": "booked",
                            "status": "booked",
                            "from": "07:30PM"
                        }
                    ]
                },
                {
                    "date": "09-16-2014",
                    "slots": []
                },
                {
                    "date": "09-17-2014",
                    "slots": [
                        {
                            "slotStatus": "available",
                            "status": "available",
                            "from": "06:30PM"
                        },
                        {
                            "slotStatus": "available",
                            "status": "available",
                            "from": "07:00PM"
                        },
                        {
                            "slotStatus": "available",
                            "status": "available",
                            "from": "07:30PM"
                        }
                    ]
                }
            ],
            "plan": "Silver",
            "offerStmt": "enhancedcare MDCONNECT Member Discount: 50% - 60%",
            "rating": "3"
        }
    ],
    "total": 2
}
* Description: Return specific provider details 

* Sample Input: http://localhost:8000/v1/provider/search?zip=90002&specialty=cardiology&category=doctors&insurance=aarp&gender=male
* Sample Output: {
    "providers": [
        {
            "email": "thivakar@gmail.com",
            "name": "Dr. thivakar N",
            "image": "../userimage/1410175183050-2746-42144492b652dd90.jpeg",
            "address": "7, main road"
            "city":"AGS",
            "state": "FL",
            "zip": "90002",
            "phone": "8796857485",
            "appointmentSchedules": [
                {
                    "date": "09-15-2014",
                    "slots": []
                },
                {
                    "date": "09-16-2014",
                    "slots": []
                },
                {
                    "date": "09-17-2014",
                    "slots": []
                }
            ],
            "plan": "Gold",
            "offerStmt": "enhancedcare MDCONNECT Member Discount: 50% - 60%"
        },
        {
            "email": "dheeraj@gmail.com",
            "name": "Dr. dheeraj S",
            "image": "./userimage/1410177108694-1338-4f94f6815b2d3bdd.jpeg",
            "address": "23, hallll street,
            "city":"AGS",
            "state": "HI",
            "zip": "90002",
            "phone": "8796857485",
            "appointmentSchedules": [
                {
                    "date": "09-15-2014",
                    "slots": [
                        {
                            "slotStatus": "available",
                            "status": "available",
                            "from": "06:30PM"
                        },
                        {
                            "slotStatus": "available",
                            "status": "available",
                            "from": "07:00PM"
                        },
                        {
                            "slotStatus": "booked",
                            "status": "booked",
                            "from": "07:30PM"
                        }
                    ]
                },
                {
                    "date": "09-16-2014",
                    "slots": []
                },
                {
                    "date": "09-17-2014",
                    "slots": [
                        {
                            "slotStatus": "available",
                            "status": "available",
                            "from": "06:30PM"
                        },
                        {
                            "slotStatus": "available",
                            "status": "available",
                            "from": "07:00PM"
                        },
                        {
                            "slotStatus": "available",
                            "status": "available",
                            "from": "07:30PM"
                        }
                    ]
                }
            ],
            "plan": "Silver",
            "offerStmt": "enhancedcare MDCONNECT Member Discount: 50% - 60%",
            "rating": "3"
        }
    ],
    "total": 2
}
* Description: Return specific provider details 

* Sample Input: http://localhost:8000/v1/provider/search?zip=90002&specialty=cardiology&category=doctors&insurance=aarp&gender=male
* Sample Output: {
    "providers": [
        {
            "email": "thivakar@gmail.com",
            "name": "Dr. thivakar N",
            "image": "../userimage/1410175183050-2746-42144492b652dd90.jpeg",
            "address": "7, main road"
            "city":"AGS",
            "state": "FL",
            "zip": "90002",
            "phone": "8796857485",
            "appointmentSchedules": [
                {
                    "date": "09-15-2014",
                    "slots": []
                },
                {
                    "date": "09-16-2014",
                    "slots": []
                },
                {
                    "date": "09-17-2014",
                    "slots": []
                }
            ],
            "plan": "Gold",
            "offerStmt": "enhancedcare MDCONNECT Member Discount: 50% - 60%"
        },
        {
            "email": "dheeraj@gmail.com",
            "name": "Dr. dheeraj S",
            "image": "./userimage/1410177108694-1338-4f94f6815b2d3bdd.jpeg",
            "address": "23, hallll street,
            "city":"AGS",
            "state": "HI",
            "zip": "90002",
            "phone": "8796857485",
            "appointmentSchedules": [
                {
                    "date": "09-15-2014",
                    "slots": [
                        {
                            "slotStatus": "available",
                            "status": "available",
                            "from": "06:30PM"
                        },
                        {
                            "slotStatus": "available",
                            "status": "available",
                            "from": "07:00PM"
                        },
                        {
                            "slotStatus": "booked",
                            "status": "booked",
                            "from": "07:30PM"
                        }
                    ]
                },
                {
                    "date": "09-16-2014",
                    "slots": []
                },
                {
                    "date": "09-17-2014",
                    "slots": [
                        {
                            "slotStatus": "available",
                            "status": "available",
                            "from": "06:30PM"
                        },
                        {
                            "slotStatus": "available",
                            "status": "available",
                            "from": "07:00PM"
                        },
                        {
                            "slotStatus": "available",
                            "status": "available",
                            "from": "07:30PM"
                        }
                    ]
                }
            ],
            "plan": "Silver",
            "offerStmt": "enhancedcare MDCONNECT Member Discount: 50% - 60%",
            "rating": "3"
        }
    ],
    "total": 2
}
* Description: Return specific provider details 

## Create Time Schedule ##

* Method: POST   
* Path: /v1/timeschedule
* Body: email - String(email), date - Array, slots - Array
* Sample Input: curl -H "accept:application/json" -H "content-type:application/json" -X POST -d '{"date":["09-15-2014","09-17-2014"],"slots":[{"from":"06:30PM","to":"07:00PM","locId":"dheeraj@gmail.com0"},{"from":"07:00PM","to":"07:30PM","locId":"dheeraj@gmail.com0"},{"from":"07:30PM","to":"08:00PM","locId":"dheeraj@gmail.com0"},{"from":"06:00AM","to":"06:30AM","locId":"dheeraj@gmail.com1"},{"from":"06:30AM","to":"07:00AM","locId":"dheeraj@gmail.com1"}],"email":"dheeraj@gmail.com"}' http://localhost:8000/v1/timeschedule
* Sample Output: successfully inserted
* Description: Updates provider's time schedule for given date with given time

## Modify time slots ##

* Method: PUT
* Path: /v1/modifyslots
* Body: email - String(email), date - String, locId - String, slots - Array
* Sample Input: curl -H "accept:application/json" -H "content-type:application/json" -X PUT -d '{"email":"dheeraj@gmail.com","date":"09-17-2014","locId":"dheeraj@gmail.com0","slots":[{"from":"06:30PM","to":"07:00PM","status":"available"},{"from":"07:00PM","to":"07:30PM","status":"booked"},{"from":"07:30PM","to":"08:00PM","status":"booked"},{"from":"06:00AM","to":"06:30AM","status":"available"},{"from":"06:30AM","to":"07:00AM","status":"available"}]}' http://localhost:8000/v1/modifyslots
* Sample Outpu: {"modifiedslots":[{"from":"06:30PM","to":"07:00PM","status":"available"},{"status":"booked","to":"07:30PM","from":"07:00PM","patient":{"email":"priya@gmail.com","name":"priya","purpose":"regular checkup","inusurance":"health","gender":"female","message":"none5"}},{"status":"booked","to":"08:00PM","from":"07:30PM","patient":{"email":"priya@gmail.com","name":"priya","purpose":"regular checkup","inusurance":"health","gender":"female","message":"none5"}},{"from":"06:00AM","to":"06:30AM","status":"available"},{"from":"06:30AM","to":"07:00AM","status":"available"}]}
* Description: Updates with new set of slots, and remains the booked slots as it is

## Upload Provider Image ##

* Method: PUT
* Path: /v1/imageupload
* Body: email - String(email), imageFile - file (object)
* Description: Update image to the given provider

## Forgot Password ##

* Method: PUT
* Path: /v1/forgotPassword
* Body: question - String, answer - String, email - String(email)
* Sample Input: curl -H "accept:application/json" -H "content-type:application/json" -X PUT -d '{"answer":"chennai","question":"What is the name of your hometown?"}' http://localhost:8000/v1/forgotPassword?email=thanesh@gmail.com
* Sample Output: {"temppassword":8105}
* Description: Generates temporary password and save into the user's collection

## Change Password ##

* Method: PUT
* Path: /v1/changePassword
* Query Param: email - String(email)
* Body: password - string, newpassword - String
* Sample Input: curl -H "accept:application/json" -H "content-type:application/json" -X PUT -d '{"password":"shama","newpassword"sharma123"}' http://localhost:8000/v1/changePassword?email=sharma@gmail.com
* Sample Output: Updated Successfully
* Description: It will update the loggedIn user details with new password


## Change Security ##

* Method: GET
* Path: /v1/getSecurity
* Sample Input: http://localhost:8000/v1/changeSecurity?email=sharma@gmail.com
* Sample Output: {
    "security": {
        "question": "name",
        "answer": "sharma"
    }
}
* Description: It will response the object with the security question and password of the loggedIn user

* Method: PUT
* Path: /v1/changeSecurity
* Query: email - String(email)
* Body: question - String, answer - String
* Sample Input - curl -H "accept:authorization/json" -H "content-type:application/josn" -X PUT -d '{"question":"what was your first school name","answer":"government school"} 'http://localhost:8000/v1/changeSecurity?email=sharma@gmail.com
* Sample Output - Updated Successfully
* Description: It will response the object with the updated security question and password of the loggedIn user

## Get Patient Details ##

* Method: GET
* Path: /v1/patient
* Sample Input: http://localhost:8000/v1/patient?email=priya@gmail.com
* Sample Output: {
    "patient": {
        "username": "priya",
        "lastName": "M",
        "gender": "female",
        "dob": "2008-02-13T12:30:32.537Z",
        "zipCode": "68954",
        "email": "priya@gmail.com",
        "phone": "8978945698"
    }
}
* Description: It will response with the patient details

## Get patient appointment details ##

* Method: GET
* Path: /v1/appointmentHistory
* Query: email - string (email), type - String
* Sample Input: http://localhost:8000/v1/appointmentHistory?email=priya@gmail.com&type=past
* Sample Output: {
    "pastappointment": [        
        {
            "date": "09-17-2014",
            "time": "07:30PM",
            "provider": "dheerajj, T",
            "providerEmail": "dheeraj@mdtree.com",
            "location": {
                "address": "23, hallll street",
                "city": "AGS",
                "state": "HI",
                "zip": "90002"
            },
            "reason": "regular checkup"
        }
    ]
}
* Description: Returns past appointments

* Method: GET
* Path: /v1/appointmentHistory
* Query: email - string (email), type - String
* Sample Input: http://localhost:8000/v1/appointmentHistory?email=priya@gmail.com&type=pending
* Sample Output: {
    "pendingappointment": [        
        {
            "date": "09-19-2014",
            "time": "07:30PM",
            "provider": "dheerajj, T",
            "providerEmail": "dheeraj@mdtree.com",
            "location": {
                "address": "23, hallll street",
                "city": "AGS",
                "state": "HI",
                "zip": "90002"
            },
            "reason": "regular checkup"
        }
    ]
}
* Description: Returns upcoming appointments

## Patient with minimum details

* Method: GET
* Path: /v1/patient
* Sample Input: http://localhost:8000/v1/patient?email=priya@gmail.com&view=info
* Sample Output: {
    "patient": {
        "gender": "female",
        "email": "priya@gmail.com",
        "phone": "8978945698"
    }
}
* Description: It will response with minimum of patient details

## Update Patient Details ##

* Method: PUT
* Path: /v1/updatePatient
* Body: firstName - String, lastName - String, zipCode - String, gender - String, dob - Date, phone - String
* Query: email - String(email)
* Sample Input: curl -H "accept:application/json" -H "content-type:application/json" -X PUT -d '{"firstName":"priya","lastName":"Jain","phone":"4521635213","zipCode":"90002","gender":"female","dob":"09-14-1991"}' http://localhost:8000/v1/updatePatient?email=priya@gmail.com 
* Sample Output: Updated Successfully
* Description: Update patient profile with the given new details 


## Appointment Booking ##

* Method: PUT
* Path: /v1/appointment
* Body: 
    * Required: provideremail - String(email), date - String,  location - String, slot - String, name - String, email - String(email), purpose -String, phoneno - String, gender - String
    * Optional: message - String, insurance - String
* Sample Input: curl -H "accept:application/json" -H "content-type:application/json" -X PUT -d '{"location":"dheeraj@gmail.com0","provideremail":"dheeraj@gmail.com","date":"09-17-2014","email":"priya@gmail.com","name":"priya","purpose":"regular checkup","insurance":"health","gender":"female","message":"none","phoneno":"9987546585","slot":"07:30PM"}' http://localhost:8000/v1/appointment
* Sample Output: Appointment booked successfully
* Description: Appointment is booked for the given patient. Updates status of the provider appointment list

## Status Update ##

* Method: PUT
* Path: /v1/updateStatus
* Body: provideremail - String(email), date - String,  location - String, slot - String
* Sample Input:  curl -H "accept:application/json" -H "content-type:application/json" -X PUT -d '{"provideremail":"dheeraj@gmail.com","date":"09-17-2014","location":"dheeraj@gmail.com0","slot":"07:00PM","status":"Cancel","reason":"emergency"}' http://localhost:8000/v1/updateStatus
* Sample Output: Status updated successfully

* Sample Input: curl -H "accept:application/json" -H "content-type:application/json" -X PUT -d '{"provideremail":"dheeraj@gmail.com","date":"09-17-2014","location":"dheeraj@gmail.com0","slot":"07:30PM","status":"Done"}' http://localhost:8000/v1/updateStatus
* Sample Output: Status updated successfully

* Sample Input: curl -H "accept:application/json" -H "content-type:application/json" -X PUT -d '{"provideremail":"dheeraj@gmail.com","date":"09-17-2014","location":"dheeraj@gmail.com0","slot":"07:30PM","status":"NoShow"}' http://localhost:8000/v1/updateStatus
* Sample Output: Status updated successfully

* Description: Updates appointment status of the provider


## Get Provider Details ##

* Method: GET
* Path: /v1/provider
* Query: email - String (email), type - String
* Sample Input: http://localhost:8000/v1/provider?email=anuradha.md@gmail.com&type=personal
* Sample Output: {
    "providerDetails": {
        "category": "doctor",
        "specialty": "cardiology",
        "title": "Dr.",
        "firstName": "Anuradha",
        "lastName": "Tanwar",
        "dob": "1987-05-18T00:00:00.000Z",
        "zipCode": "69856",
        "email": "anuradha.md@gmail.com",
        "webSite": "www.mdtree.com",
        "notification": "anuradha@gmail.com",
        "cash": "450",
        "cancellationNumber": "8596743215"
    }
}
* Description: Reply provider's personal details

* Method: GET
* Path: /v1/provider
* Query: email - String (email), type - String
* Sample Input: http://localhost:8000/v1/provider?email=anuradha.md@gmail.com&type=personal&view=tiny
* Sample Output: {
    "providerDetails": {
        "title": "Dr.",
        "firstName": "Anuradha",
        "lastName": "Tanwar",
        "email": "anuradha.md@gmail.com",
        "image": "./userimage/1413612768971-469-d4aeed19552297de.png"
    }
}
* Description: Reply provider's personal details


* Method: GET
* Path: /v1/provider
* Query: email - String (email), type - String
* Sample Input: http://localhost:8000/v1/provider?email=anuradha.md@gmail.com&type=location&locId=anuradha.md@gmail.com0
* Sample Output: {
    "providerLocation": {
        "practiceName": "Medical college",
        "address": "28, AK Street",
        "city": "Arrow racho",
        "state": "AK",
        "zip": "90001",
        "phone1": "8798745895",
        "phone2": "9685743217",
        "fax": "5897465"
    }
}
* Description: Reply provider's specific location details

* Method: GET
* Path: /v1/provider
* Query: email - String (email), type - String
* Sample Input: http://localhost:8000/v1/provider?email=anuradha.md@gmail.com&type=alllocation
* Sample Output: {
    "providerLocations": [
        {
            "address": "78, t nagar,AGS,CA,90002",
            "locId": "thanesh@gmail.com0"
        }
    ]
}

* Description: Reply provider's specific location details

* Method: GET
* Path: /v1/provider
* Query: email - String (email), type - String
* Sample Input: http://localhost:8000/v1/provider?email=karthik.md@gmail.com&type=accreditation
* Sample Output: {
    "providerAccreditation": {
        "school": "Residencial school",
        "residency": "62, Anna nagar, chennai",
        "fellowship": "mdTree",
        "affilliation": "email",
        "languages": [
            "English",
            "Spanish",
            "Tamil"
        ],
        "insurance": [
            "aarp"
        ],
        "statement": "Average"
    }
}
* Description: Reply provider's accreditation details

* Method: GET
* Path: /v1/provider
* Query: email - String (email), type - String
* Sample Input: http://localhost:8000/v1/provider?email=karthik.md@gmail.com
* Sample Output: {
    "provider": {
        "category": "doctors",
        "specialty": "cardiology",
        "name": "Dr. dheeraj S",
        "dob": "2014-01-08T18:30:00.000Z",
        "image": "./userimage/1410177108694-1338-4f94f6815b2d3bdd.jpeg",
        "primarylocation": {
            "address": "23, hallll street,AGS",
            "state": "AGS"
        },
        "zipCode": "90002",
        "email": "dheeraj@gmail.com",
        "notification": "dheeraj@gmail.com",
        "cash": "$100 - $150",
        "cancellationNumber": "8596745896",
        "locations": [
            {
                "practiceName": "dheeraj clinic",
                "address": "23, hallll street,AGS",
                "state": "HI",
                "zip": "90002",
                "phone1": "9865748596",
                "phone2": "",
                "fax": "",
                "appointmentSchedules": [
                    {
                        "date": "09-15-2014",
                        "slots": [
                            {
                                "slotStatus": "available",
                                "status": "available",
                                "from": "06:30PM"
                            },
                            {
                                "slotStatus": "available",
                                "status": "available",
                                "from": "07:00PM"
                            },
                            {
                                "slotStatus": "booked",
                                "status": "booked",
                                "from": "07:30PM",
                                "patient": {
                                    "email": "priya@gmail.com",
                                    "name": "priya",
                                    "purpose": "regular checkup",
                                    "inusurance": "health",
                                    "gender": "female",
                                    "message": "none",
                                    "phoneno": "987546585"
                                }
                            }
                        ]
                    },
                    {
                        "date": "09-16-2014",
                        "slots": []
                    },
                    {
                        "date": "09-17-2014",
                        "slots": [
                            {
                                "slotStatus": "available",
                                "status": "available",
                                "from": "06:30PM"
                            },
                            {
                                "slotStatus": "available",
                                "status": "available",
                                "from": "07:00PM"
                            },
                            {
                                "slotStatus": "available",
                                "status": "available",
                                "from": "07:30PM"
                            }
                        ]
                    },
                    {
                        "date": "09-18-2014",
                        "slots": []
                    },
                    {
                        "date": "09-19-2014",
                        "slots": []
                    },
                    {
                        "date": "09-20-2014",
                        "slots": []
                    },
                    {
                        "date": "09-21-2014",
                        "slots": []
                    }
                ]
            }, {
                "practiceName": "health care",
                "locationId": "dheeraj@gmail.com1",
                "address": "80,2nd main,AGS",
                "state": "canada",
                "zip": "90002",
                "phone1": "8796857485",
                "phone2": null,
                "fax": null,
                "appointmentSchedules": [
                    {
                        "date": "09-15-2014",
                        "slots": []
                    },
                    {
                        "date": "09-16-2014",
                        "slots": []
                    },
                    {
                        "date": "09-17-2014",
                        "slots": []
                    },
                    {
                        "date": "09-18-2014",
                        "slots": []
                    },
                    {
                        "date": "09-19-2014",
                        "slots": []
                    },
                    {
                        "date": "09-20-2014",
                        "slots": []
                    },
                    {
                        "date": "09-21-2014",
                        "slots": []
                    }
                ]
            }
        ],
        "school": "school",
        "languages": [
            "English"
        ],
        "insurance": [
            "aarp"
        ]
    }
}
* Description: Reply provider's specific details with next 7 days appointment schedule 


* Sample Input: http://localhost:8000/v1/provider?email=dheeraj@gmail.com&startindex=1
* Sample Output: {
    "provider": {
        "category": "doctors",
        "specialty": "cardiology",
        "name": "Dr. dheeraj S",
        "dob": "2014-01-08T18:30:00.000Z",
        "image": "./userimage/1410177108694-1338-4f94f6815b2d3bdd.jpeg",
        "primarylocation": {
            "address": "23, hallll street,AGS",
            "state": "AGS"
        },
        "zipCode": "90002",
        "email": "dheeraj@gmail.com",
        "notification": "dheeraj@gmail.com",
        "cash": "$100 - $150",
        "cancellationNumber": "8596745896",
        "locations": [
            {
                "practiceName": "dheeraj clinic",
                "locationId": "dheeraj@gmail.com0",
                "address": "23, hallll street,AGS",
                "state": "HI",
                "zip": "90002",
                "phone1": "9865748596",
                "phone2": "",
                "fax": "",
                "appointmentSchedules": [
                    {
                        "date": "09-22-2014",
                        "slots": [
                            {
                                "slotStatus": "available",
                                "status": "available",
                                "from": "06:30PM"
                            },
                            {
                                "slotStatus": "available",
                                "status": "available",
                                "from": "07:00PM"
                            },
                            {
                                "slotStatus": "available",
                                "status": "available",
                                "from": "07:30PM"
                            }
                        ]
                    },
                    {
                        "date": "09-23-2014",
                        "slots": [
                            {
                                "slotStatus": "available",
                                "status": "available",
                                "from": "06:30PM"
                            },
                            {
                                "slotStatus": "available",
                                "status": "available",
                                "from": "07:00PM"
                            },
                            {
                                "slotStatus": "available",
                                "status": "available",
                                "from": "07:30PM"
                            }
                        ]
                    },
                    {
                        "date": "09-24-2014",
                        "slots": []
                    },
                    {
                        "date": "09-25-2014",
                        "slots": []
                    },
                    {
                        "date": "09-26-2014",
                        "slots": []
                    },
                    {
                        "date": "09-27-2014",
                        "slots": []
                    },
                    {
                        "date": "09-28-2014",
                        "slots": []
                    }
                ]
            },
            {
                "practiceName": "health care",
                "locationId": "dheeraj@gmail.com1",
                "address": "80,2nd main,AGS",
                "state": "canada",
                "zip": "90002",
                "phone1": "8796857485",
                "phone2": null,
                "fax": null,
                "appointmentSchedules": [
                    {
                        "date": "09-22-2014",
                        "slots": [
                            {
                                "slotStatus": "available",
                                "status": "available",
                                "from": "06:00AM"
                            },
                            {
                                "slotStatus": "available",
                                "status": "available",
                                "from": "06:30AM"
                            }
                        ]
                    },
                    {
                        "date": "09-23-2014",
                        "slots": [
                            {
                                "slotStatus": "available",
                                "status": "available",
                                "from": "06:00AM"
                            },
                            {
                                "slotStatus": "available",
                                "status": "available",
                                "from": "06:30AM"
                            }
                        ]
                    },
                    {
                        "date": "09-24-2014",
                        "slots": []
                    },
                    {
                        "date": "09-25-2014",
                        "slots": []
                    },
                    {
                        "date": "09-26-2014",
                        "slots": []
                    },
                    {
                        "date": "09-27-2014",
                        "slots": []
                    },
                    {
                        "date": "09-28-2014",
                        "slots": []
                    }
                ]
            }
        ],
        "school": "school",
        "languages": [
            "English"
        ],
        "insurance": [
            "aarp"
        ]
    }
}
* Description: Shows next set of slots of provider for all location

* Sample Input: http://localhost:8000/v1/provider?email=dheeraj@gmail.com&startindex=1&getLocation=dheeraj@gmail.com0
* Sample Output: {
    "provider": {
        "category": "doctors",
        "specialty": "cardiology",
        "name": "Dr. dheeraj S",
        "dob": "2014-01-08T18:30:00.000Z",
        "image": "./userimage/1410177108694-1338-4f94f6815b2d3bdd.jpeg",
        "primarylocation": {
            "address": "23, hallll street,AGS",
            "state": "AGS"
        },
        "zipCode": "90002",
        "email": "dheeraj@gmail.com",
        "notification": "dheeraj@gmail.com",
        "cash": "$100 - $150",
        "cancellationNumber": "8596745896",
        "locations": [
            {
                "practiceName": "dheeraj clinic",
                "locationId": "dheeraj@gmail.com0",
                "address": "23, hallll street,AGS",
                "state": "HI",
                "zip": "90002",
                "phone1": "9865748596",
                "phone2": "",
                "fax": "",
                "appointmentSchedules": [
                    {
                        "date": "09-22-2014",
                        "slots": [
                            {
                                "slotStatus": "available",
                                "status": "available",
                                "from": "06:30PM"
                            },
                            {
                                "slotStatus": "available",
                                "status": "available",
                                "from": "07:00PM"
                            },
                            {
                                "slotStatus": "available",
                                "status": "available",
                                "from": "07:30PM"
                            }
                        ]
                    },
                    {
                        "date": "09-23-2014",
                        "slots": [
                            {
                                "slotStatus": "available",
                                "status": "available",
                                "from": "06:30PM"
                            },
                            {
                                "slotStatus": "available",
                                "status": "available",
                                "from": "07:00PM"
                            },
                            {
                                "slotStatus": "available",
                                "status": "available",
                                "from": "07:30PM"
                            }
                        ]
                    },
                    {
                        "date": "09-24-2014",
                        "slots": []
                    },
                    {
                        "date": "09-25-2014",
                        "slots": []
                    },
                    {
                        "date": "09-26-2014",
                        "slots": []
                    },
                    {
                        "date": "09-27-2014",
                        "slots": []
                    },
                    {
                        "date": "09-28-2014",
                        "slots": []
                    }
                ]
            }
        ],
        "school": "school",
        "languages": [
            "English"
        ],
        "insurance": [
            "aarp"
        ]
    }
}
* Description: Shows next set of slots of provider for specific location

## Get Slots created Dates ## 

* Method: GET
* Path: /v1/slottedDate
* Query: email - String(email)
* Sample Input: curl -H "accept:application/json" -H "content-type:application/json" http://localhost:8000/v1/slottedDate?email=guru@gmail.com
* Sample Output: {
    "slotCreatedDates": [
        "09-29-2014",
        "09-30-2014",
        "10-02-2014",
        "10-03-2014",
        "10-08-2014",
        "10-09-2014",
        "10-10-2014",
        "10-15-2014",
        "10-16-2014",
        "10-23-2014",
        "10-24-2014"
    ]
}
* Description: It will reply the array of appointment created dates by provider

## Get Slot Status ##

* Method: GET
* Path: /v1/slotStatus
* Query: email - String, location - String, date - String, slot - String
* Sample Input: curl -H "accept:application/json" -H "content-type:application/json" http://localhost:8000/v1/slotStatus?location=guru@gmail.com0&email=guru@gmail.com&date=10-24-2014&slot=07:30PM
* Sample Output: {
    "status": "progress"
}
* Description: It will update the slot status into progress. It should called while booking an appointment to set the time limit. If status exprired, then patient not able the book the appointment. 

## Add Offer ##

* Method: PUT
* Path: /v1/offer
* Query: email - String(email)
* Body: startDate - String, endDate- String, title - String, description - String
* Sample Input: curl -H "accept:application/json" -H "content-type:application/json" -X PUT -d '{"location":["udhai@mdtree.com0"],"startDate":"11-03-2014","endDate":"11-06-2014","title":"test offer","description":"checking offer for the provider"}' http://localhost:8000/v1/offer?email=udhai@gmail.com
* Sample Output: Updated Successfully.
* Description: Creates provider offer.

## Update Provider Profile ##

### Update Provider Personal Information

* Method: PUT
* Path: /v1/updateProvider
* Query: type - String, email - String(email)
* Body: 
    * Required Fields: category - String, specialty - String, title - String, firstName - String, lastName - String, zipCode - String, dob - String, notification - String, cash - String, cancellationNumber - String

    * Optional Fields: gender - String, webSite - String, offer -String
* Sample Input: curl -H "accept:application/json" -H "content-type:application/json" -X PUT -d '{"specialty":"cardiology","category":"doctors","title":"Mr.","firstName":"dheerajj","lastName":"T","dob":"09-24-1987","gender":"male","zipCode":"90002","notification":"dheeraj@gmail.com","cash":"$100 - $150","offer":"30","cancellationNumber":"8974549658","webSite":"www.mdtree.com"}' "http://localhost:8000/v1/updateProvider?email=dheeraj@gmail.com&type=personal"
* Sample Output: Updated Successfully
* Description: Updates provider details with given new values

### Update Provider Accreditation Information

* Method: PUT
* Path: /v1/updateProvider
* Query: type - String, email - String(email)
* Body:
    * Required Fields: school - String, languages - Array

    * Optional Fields: residency - String, fellowship - String, affilliation - String, insurance - array, statement - String
* Sample Input: curl -H "accept:application/json" -H "content-type:application/json" -X PUT -d '{"school":"residential school1","languages":["English","Tamil"],"insurance":["aarp"],"fellowship":"email","affilliation":"aff","residency":"23, jai nagar","statement":"good"}' "http://localhost:8000/v1/updateProvider?email=thilakar@gmail.com&type=accreditation"
* Sample Output: {"provider":{"school":"residential school1","languages":["English","Tamil"]}}
* Description: Updates provider details with given new values

### Update Provider Location Information

* Method: PUT
* Path: /v1/updateProvider
* Query: type - String, email - String(email), locId - String
* Sample Input: curl -H "accept:application/json" -H "content-type:application/json" -X PUT -d '{"location":[{"address":"85,2nd main","practiceName":"health caring","state":"canada","city":"KAS","zip":"90002","phone1":"8796857485"}]}' "http://localhost:8000/v1/updateProvider?email=thilakar@gmail.com&type=location&locId=thilakar@gmail.com0"
* Sample Output: updated Successfully
* Description: Updates provider's specific location with given new values

### Update Provider with new location details

* Method: PUT
* Path: /v1/updateProvider
* Query: type - String, email - String(email), locId - String
* Sample Input: curl -H "accept:application/json" -H "content-type:application/json" -X PUT -d '{"location":[{"address":"80,2nd main","practiceName":"health care","state":"canada","city":"AGS","zip":"90002","phone1":"8796857485"}]}' "http://localhost:8000/v1/updateProvider?email=kumar@gmail.com&type=location&locId=new"   
* Sample Output: updated Successfully
* Description: Updates provider details with given new location details

## Update Rating ##

* Method: PUT
* Path: /v1/updateRatings
* Body: rating - String
* Query: email - String(email)
* Sample Input: curl -H "accept:application/json" -H "content-type:application/json" -X PUT -d '{"rating":"3"}' http://localhost:8000/v1/updateRatings?email=dheeraj@gmail.com 
* Sample Output: Updated successfully
* Description: Updates the rating of the given provider

## Admin Creation ##

* Method: POST
* Path: /v1/createAdmin
* Sample Input: curl -H "accept:application/json" -H "content-type:application/json" -X POST http://localhost:8000/v1/createAdmin
* Sample Output: {"user":{"username":"admin","role":{"title":"admin","bitMask":"4"},"type":"admin"}}
* Description: Admin created with default values.

* Method: POST
* Path: /v1/createAdmin
* Sample Input: curl -H "accept:application/json" -H "content-type:application/json" -X POST -d '{"name":"admin","email":"admin@mdtree.com","password":"administrator"}' http://localhost:8000/v1/createAdmin
* Sample Output: {"user":{"username":"admin","role":{"title":"admin","bitMask":"4"},"type":"admin"}}
* Description: Admin created with given values.

## Daily View of Provider appointment ##

* Method: GET
* Path: /v1/getslot
* Query: email - String(email), locId - String, view - String
* Sample Input: http://localhost:8000/v1/getslot?email=dheeraj@gmail.com&view=daily&locId=dheeraj@gmail.com1&date=09-17-2014
* Sample Output: {
    "slot": {
        "date": "09-17-2014",
        "slots": [
            {
                "slotStatus": "available",
                "status": "available",
                "from": "06:00AM"
            },
            {
                "slotStatus": "available",
                "status": "available",
                "from": "06:30AM"
            }
        ]
    }
}
* Description: It shows given date's appointment details of the provider with that specific location

* Sample Input: http://localhost:8000/v1/getslot?email=dheeraj@gmail.com&view=daily&locId=dheeraj@gmail.com1
* Sample Output: {
    "slot": {
        "date": "09-17-2014",
        "slots": [
            {
                "slotStatus": "available",
                "status": "available",
                "from": "06:00AM"
            },
            {
                "slotStatus": "available",
                "status": "available",
                "from": "06:30AM"
            }
        ]
    }
}
*Description: If date is not given it shows current date details

## Weekly View of Provider appointment ##

* Method: GEt
* Path: /v1/getslot
* Query: email - String(email), locId - String, view - String
* Sample Input: http://localhost:8000/v1/getslot?email=dheeraj@gmail.com&view=weekly&locId=dheeraj@gmail.com1
* Sample Output: {
    "slots": [
        {
            "date": "09-15-2014",
            "slots": [
                {
                    "slotStatus": "available",
                    "status": "available",
                    "from": "06:00AM"
                },
                {
                    "slotStatus": "available",
                    "status": "available",
                    "from": "06:30AM"
                }
            ]
        },
        {
            "date": "09-16-2014",
            "slots": []
        },
        {
            "date": "09-17-2014",
            "slots": [
                {
                    "slotStatus": "available",
                    "status": "available",
                    "from": "06:00AM"
                },
                {
                    "slotStatus": "available",
                    "status": "available",
                    "from": "06:30AM"
                }
            ]
        },
        {
            "date": "09-18-2014",
            "slots": []
        },
        {
            "date": "09-19-2014",
            "slots": []
        },
        {
            "date": "09-20-2014",
            "slots": []
        },
        {
            "date": "09-21-2014",
            "slots": []
        }
    ]
}
* Description: It shows weekly appointment details of the provider with that specific location


* Sample Input: http://localhost:8000/v1/getslot?email=dheeraj@gmail.com&view=weekly&locId=dheeraj@gmail.com1&date=09-17-2014&startindex=1
* Sample Output: {
    "slots": [
        {
            "date": "09-21-2014",
            "slots": []
        },
        {
            "date": "09-22-2014",
            "slots": [
                {
                    "slotStatus": "available",
                    "status": "available",
                    "from": "06:00AM"
                },
                {
                    "slotStatus": "available",
                    "status": "available",
                    "from": "06:30AM"
                }
            ]
        },
        {
            "date": "09-23-2014",
            "slots": [
                {
                    "slotStatus": "available",
                    "status": "available",
                    "from": "06:00AM"
                },
                {
                    "slotStatus": "available",
                    "status": "available",
                    "from": "06:30AM"
                }
            ]
        },
        {
            "date": "09-24-2014",
            "slots": []
        },
        {
            "date": "09-25-2014",
            "slots": []
        },
        {
            "date": "09-26-2014",
            "slots": []
        },
        {
            "date": "09-27-2014",
            "slots": []
        }
    ]
}

* Sample Input: http://localhost:8000/v1/getslot?email=dheeraj@gmail.com&view=weekly&locId=dheeraj@gmail.com1&date=09-15-2014
* Sample Output: {
    "slots": [
        {
            "date": "09-14-2014",
            "slots": []
        },
        {
            "date": "09-15-2014",
            "slots": [
                {
                    "slotStatus": "available",
                    "status": "available",
                    "from": "06:00AM"
                },
                {
                    "slotStatus": "available",
                    "status": "available",
                    "from": "06:30AM"
                }
            ]
        },
        {
            "date": "09-16-2014",
            "slots": []
        },
        {
            "date": "09-17-2014",
            "slots": [
                {
                    "slotStatus": "available",
                    "status": "available",
                    "from": "06:00AM"
                },
                {
                    "slotStatus": "available",
                    "status": "available",
                    "from": "06:30AM"
                }
            ]
        },
        {
            "date": "09-18-2014",
            "slots": []
        },
        {
            "date": "09-19-2014",
            "slots": []
        },
        {
            "date": "09-20-2014",
            "slots": []
        }
    ]
}

## Schedule Existing Patient ##

* Method: GET
* Path: /v1/getSlot
* Query: email - String(email), locId - String, view - String
* Sample Input: http://localhost:8000/v1/getslot?email=vinai@mdtree.com&view=schedule&locId=vinai@mdtree.com0
* Sample Output: {
    "slots": [
        {
            "date": "10-30-2014",
            "slots": [
                {
                    "status": "available",
                    "to": "08:20AM",
                    "from": "08:00AM"
                },
                {
                    "status": "available",
                    "to": "08:40AM",
                    "from": "08:20AM"
                },
                {
                    "status": "available",
                    "to": "09:00AM",
                    "from": "08:40AM"
                },
                {
                    "status": "available",
                    "to": "09:20AM",
                    "from": "09:00AM"
                },
                {
                    "status": "available",
                    "to": "09:40AM",
                    "from": "09:20AM"
                },
                {                  
                    "status": "booked",
                    "to": "10:00AM",
                    "from": "09:40AM"
                    "by": "patient1@mdtree.com",
                    "at": 67993,
                    "patient": {
                        "name": "patient",
                        "email": "patient1@mdtree.com",
                        "phoneno": "9987546585",
                        "gender": "female",
                        "purpose": "regular checkup",
                        "message": "none",
                        "insurance": "health",
                        "offer": {
                            "date": "10-31-2014",
                            "title": "offer",
                            "description": "check offer for available slots"
                        }
                    }
                }
            ],
            "title": "offer",
            "description": "check offer for available slots"
        },
        {
            "date": "10-31-2014",
            "slots": [
                {
                    "status": "available",
                    "to": "08:20AM",
                    "from": "08:00AM"
                },
                {
                    "status": "available",
                    "to": "08:40AM",
                    "from": "08:20AM"
                },
                {
                    "status": "blocked",
                    "to": "09:00AM",
                    "from": "08:40AM",
                    "by": "patient1@mdtree.com",
                    "at": 55811
                },
                {
                    "status": "available",
                    "to": "09:20AM",
                    "from": "09:00AM"
                },
                {
                    "status": "available",
                    "to": "09:40AM",
                    "from": "09:20AM"
                },
                {
                    "status": "blocked",
                    "to": "10:00AM",
                    "from": "09:40AM",
                    "by": "vinai@mdtree.com",
                    "at": 49939
                }
            ]
        },
        {
            "date": "11-01-2014",
            "slots": []
        },
        {
            "date": "11-02-2014",
            "slots": []
        },
        {
            "date": "11-03-2014",
            "slots": []
        },
        {
            "date": "11-04-2014",
            "slots": []
        },
        {
            "date": "11-05-2014",
            "slots": []
        }
    ]
}
* Description: It will list the slots of upcoming dates. It never show past dates appointments

* Sample Input: http://localhost:8000/v1/getslot?email=vinai@mdtree.com&view=schedule&locId=vinai@mdtree.com0&startindex=1
* Sample Output: {
    "slots": [
        {
            "date": "11-06-2014",
            "slots": []
        },
        {
            "date": "11-07-2014",
            "slots": [
                {
                    "status": "available",
                    "to": "08:20AM",
                    "from": "08:00AM"
                },
                {
                    "status": "available",
                    "to": "08:40AM",
                    "from": "08:20AM"
                },
                {
                    "status": "blocked",
                    "to": "09:00AM",
                    "from": "08:40AM",
                    "by": "patient1@mdtree.com",
                    "at": 55811
                }
            ]
        },
        {
            "date": "11-08-2014",
            "slots": []
        },
        {
            "date": "11-09-2014",
            "slots": []
        },
        {
            "date": "11-10-2014",
            "slots": []
        },
        {
            "date": "11-11-2014",
            "slots": []
        },
        {
            "date": "11-12-2014",
            "slots": []
        }
    ]
}
* Description: List next set of slots for upcoming dates.

## Check Email ##

* Method: GET
* Path: /v1/checkEmail
* Query: email - String(email)
* Sample Input: http://localhost:8000/v1/checkEmail?email=guru@gmail.com
* Sample Output: {
    "exist": true
}

* Sample Input: http://localhost:8000/v1/checkEmail?email=alps@gmail.com
* Sample Output: {
    "exist": false
}
* Description: It checks that the email is existing or not


## Upload dump file ##

* Method: POST
* path: v1/uploadDump
* Body: dumpFile - object
* Sample Output: {"dumpProvider":{"success":[{"messsage":"Successfully inserted","provider":"1003007469"},{"messsage":"Successfully inserted","provider":"1003010299"},{"messsage":"Successfully inserted","provider":"1003010299"},{"messsage":"Successfully inserted","provider":"1003010950"}],"falied":[{"messsage":"Already inserted","provider":"1003010299"},{"messsage":"Already inserted","provider":"1003010950"},{"messsage":"Login created not able to insert details","provider":"1003013335"},{"messsage":"Login created not able to insert details","provider":"1003015736"},{"messsage":"Already inserted","provider":"1003010299"},{"messsage":"Already inserted","provider":"1003013335"},{"messsage":"Already inserted","provider":"1003010299"},{"messsage":"Login created not able to insert details","provider":"1003013335"},{"messsage":"Login created not able to insert details","provider":"1003016007"},{"messsage":"Already inserted","provider":"1003015736"},{"messsage":"Already inserted","provider":"1003010950"},{"messsage":"Already inserted","provider":"1003015736"},{"messsage":"Login created not able to insert details","provider":"1003015736"},{"messsage":"Already inserted","provider":"1003010950"},{"messsage":"Login created not able to insert details","provider":"1003016023"},{"messsage":"Login created not able to insert details","provider":"1003016007"},{"messsage":"Already inserted","provider":"1003015736"},{"messsage":"Already inserted","provider":"1003016007"},{"messsage":"Login created not able to insert details","provider":"1003016007"},{"messsage":"Login created not able to insert details","provider":"1003018177"},{"messsage":"Already inserted","provider":"1003013335"},{"messsage":"Already inserted","provider":"1003016007"},{"messsage":"Login created not able to insert details","provider":"1003016023"},{"messsage":"Already inserted","provider":"1003016007"},{"messsage":"Login created not able to insert details","provider":"1003016023"},{"messsage":"Already inserted","provider":"1003013335"},{"messsage":"Already inserted","provider":"1003016023"},{"messsage":"Already inserted","provider":"1003016023"},{"messsage":"Already inserted","provider":"1003016007"},{"messsage":"Login created not able to insert details","provider":"1003018177"},{"messsage":"Already inserted","provider":"1003016023"},{"messsage":"Already inserted","provider":"1003016023"},{"messsage":"Already inserted","provider":"1003018177"},{"messsage":"Already inserted","provider":"1003015736"},{"messsage":"Already inserted","provider":"1003016023"},{"messsage":"Login created not able to insert details","provider":"1003018177"},{"messsage":"Already inserted","provider":"1003018177"},{"messsage":"Already inserted","provider":"1003016023"},{"messsage":"Already inserted","provider":"1003018177"},{"messsage":"Already inserted","provider":"1003015736"},{"messsage":"Already inserted","provider":"1003018177"},{"messsage":"Already inserted","provider":"1003018177"},{"messsage":"Already inserted","provider":"1003016023"},{"messsage":"Already inserted","provider":"1003018177"},{"messsage":"Already inserted","provider":"1003018177"},{"messsage":"Already inserted","provider":"1003016007"},{"messsage":"Already inserted","provider":"1003018177"},{"messsage":"Already inserted","provider":"1003018177"},{"messsage":"Already inserted","provider":"1003016007"},{"messsage":"Already inserted","provider":"1003018177"},{"messsage":"Already inserted","provider":"1003016023"},{"messsage":"Already inserted","provider":"1003016023"},{"messsage":"Already inserted","provider":"1003018177"},{"messsage":"Already inserted","provider":"1003018177"}],"err":[{"messsage":{"data":null,"isBoom":true,"output":{"statusCode":403,"payload":{"statusCode":403,"error":"Forbidden","message":"Path `title` is required. Path `school` is required. "},"headers":{}}},"provider":"1003013335"},{"messsage":{"data":null,"isBoom":true,"output":{"statusCode":403,"payload":{"statusCode":403,"error":"Forbidden","message":"Path `title` is required. Path `school` is required. "},"headers":{}}},"provider":"1003015736"},{"messsage":{"data":null,"isBoom":true,"output":{"statusCode":403,"payload":{"statusCode":403,"error":"Forbidden","message":"Path `title` is required. Path `school` is required. "},"headers":{}}},"provider":"1003013335"},{"messsage":{"data":null,"isBoom":true,"output":{"statusCode":403,"payload":{"statusCode":403,"error":"Forbidden","message":"Path `title` is required. Path `school` is required. "},"headers":{}}},"provider":"1003016007"},{"messsage":{"data":null,"isBoom":true,"output":{"statusCode":403,"payload":{"statusCode":403,"error":"Forbidden","message":"Path `title` is required. Path `school` is required. "},"headers":{}}},"provider":"1003015736"},{"messsage":{"data":null,"isBoom":true,"output":{"statusCode":403,"payload":{"statusCode":403,"error":"Forbidden","message":"Path `school` is required. "},"headers":{}}},"provider":"1003016023"},{"messsage":{"data":null,"isBoom":true,"output":{"statusCode":403,"payload":{"statusCode":403,"error":"Forbidden","message":"Path `title` is required. Path `school` is required. "},"headers":{}}},"provider":"1003016007"},{"messsage":{"data":null,"isBoom":true,"output":{"statusCode":403,"payload":{"statusCode":403,"error":"Forbidden","message":"Path `title` is required. Path `school` is required. "},"headers":{}}},"provider":"1003016007"},{"messsage":{"data":null,"isBoom":true,"output":{"statusCode":403,"payload":{"statusCode":403,"error":"Forbidden","message":"Path `title` is required. "},"headers":{}}},"provider":"1003018177"},{"messsage":{"data":null,"isBoom":true,"output":{"statusCode":403,"payload":{"statusCode":403,"error":"Forbidden","message":"Path `school` is required. "},"headers":{}}},"provider":"1003016023"},{"messsage":{"data":null,"isBoom":true,"output":{"statusCode":403,"payload":{"statusCode":403,"error":"Forbidden","message":"Path `school` is required. "},"headers":{}}},"provider":"1003016023"},{"messsage":{"data":null,"isBoom":true,"output":{"statusCode":403,"payload":{"statusCode":403,"error":"Forbidden","message":"Path `title` is required. "},"headers":{}}},"provider":"1003018177"},{"messsage":{"data":null,"isBoom":true,"output":{"statusCode":403,"payload":{"statusCode":403,"error":"Forbidden","message":"Path `title` is required. "},"headers":{}}},"provider":"1003018177"}]}}
* Description: Upload provider dump into database

## Role based Admin ##

### Creating admin ###

* Method: POST
* path: /v1/createRole
* Body: email - String(email), password - string, role - String, name - String
(For sales admin)
* Sample Input: curl -H "accept:application/json" -H "content-type:application/json" -X POST -d '{"email":"sales2@mdtree.com","role":"salesAdmin","password":"salesmd","name":"Raj"}' http://localhost:8000/v1/createRole

* Sample Input: curl -H "accept:application/json" -H "content-type:application/json" -X POST -d '{"email":"manager1@mdtree.com","role":"salesManagerAdmin","password":"managermd","name":"Guru"}' http://localhost:8000/v1/createRole
* Sample Output: Created successfully
* Description: Create admin based on given role

### Delete admin ###

* Method: DELETE
* Path: /v1/deleteAdmin
* Query Param: email - String(email)
* Sample Input: http://localhost:8000/v1/deleteAdmin?email=manager2@mdtree.com
* Sample Output: Deleted successfully
* Description: Delete existing admin

### Update admin status ###
 
* Method: PUT
* Path: /v1/statusUpdate
* Query Param: email - String (email), status - String
* Sample Input: http://localhost:8000/v1/statusUpdate?email=sales1@mdtree.com&status=activate
* Sample Output: Status updated successfully
* Description: Update status of the existing admin

### List of adminroles ###

* Method: GET
* Path: /v1/listRoles
* Sample Input: http://localhost:8000/v1/listRoles
* Sample Output: {
    "roles": [
        "salesAdmin",
        "salesManagerAdmin"
    ]
}
* Description: List of all admin roles for master admin and sales manager admin

* Sample Output: {
    "roles": [
        "salesAdmin"
    ]
}
* Description: List roles which is below the hierarchy 

### List of admins ###

* Method: GET
* Path: /v1/listAdmin
* Sample Input: http://localhost:8000/v1/listAdmin
* Sample Output for admin: {
    "admins": [        
        {
            "email": "sales3@mdtree.com",
            "username": "salesAdmin",
            "role": "salesAdmin",
            "status": "deactivate"
        },
        {
            "email": "manager5@mdtree.com",
            "username": "Yashis",
            "role": "salesManagerAdmin",
            "status": "activate"
        },
        {
            "email": "sales4@mdtree.com",
            "username": "salesAdmin",
            "role": "salesAdmin",
            "status": "deactivate"
        },
        {
            "email": "manager2@mdtree.com",
            "username": "salesManagerAdmin",
            "role": "salesManagerAdmin",
            "status": "activate"
        },
        {
            "email": "manager3@mdtree.com",
            "username": "salesManagerAdmin",
            "role": "salesManagerAdmin",
            "status": "deactivate"
        },
        {
            "email": "manager4@mdtree.com",
            "username": "salesManagerAdmin",
            "role": "salesManagerAdmin",
            "status": "deactivate"
        },
        {
            "email": "sales2@mdtree.com",
            "username": "salesAdmin",
            "role": "salesAdmin",
            "status": "activate"
        }
    ]
}

* Sample Output for sales manager admin: {
    "admins": [
        {
            "email": "sales3@mdtree.com",
            "username": "salesAdmin",
            "role": "salesAdmin",
            "status": "deactivate"
        },
        {
            "email": "sales4@mdtree.com",
            "username": "salesAdmin",
            "role": "salesAdmin",
            "status": "deactivate"
        },
        {
            "email": "sales2@mdtree.com",
            "username": "salesAdmin",
            "role": "salesAdmin",
            "status": "activate"
        }
    ]
}
* Description: List all admins which is below the hierarchy

### Update admin details ###

* Method: PUT
* Path: v1/updateAdmin
* Query: email - string(email)
* Body: email - String(email), password - string, role - String, name - String
* Sample Input: curl -H "accept:application/json" -H "content-type:application/json" -X PUT -d '{"username":"Raj","password":"sales","role":"salesAdmin"}' http://localhost:8000/v1/updateAdmin?email=sales3@mdtree.com
* Sample Output: Details updated successfully
* Description: Update the admin details

## Hit Analysis ##

* Method: GET
* Path: /v1/hitAnalysis
* Sample Input: http://localhost:8000/v1/hitAnalysis
* Sample Output: {
    "hitAnalysis": [
        [
            "90001",
            6,
            {
                "providers": [
                    {
                        "values": [
                            [
                                "Udhai",
                                6
                            ]
                        ]
                    }
                ]
            }
        ]
    ]
}
* Description: Hit analysis based on zip code

* Method: GET
* Path: /v1/hitAnalysis
* Sample Input: http://localhost:8000/v1/providerAnalysis
* Sample Output: {
    "hitAnalysis": [
        [
            "Udhai",
            6,
            {
                "zip": [
                    [
                        "90001",
                        6
                    ]
                ]
            }
        ]
    ]
}
* Description: Hit analysis based on provider

## Hit analysis with plantype ##

* Method: GET
* Path: /v1/hitAnalysisType
* Sample Input: http://localhost:8000/v1/hitAnalysisType
* Sample Output: {
    "report": [
        {
            "key": "bronze",
            "values": [
                {
                    "provider": "provider1@mdtree.com",
                    "values": []
                },
                {
                    "provider": "guru@mdtree.com",
                    "values": []
                },
                {
                    "provider": "john@mdtree.com",
                    "values": []
                }
            ],
            "total": 3
        },
        {
            "key": "gold",
            "values": [
                {
                    "provider": "jack@mdtree.com",
                    "values": []
                },
                {
                    "provider": "rishi@mdtree.com",
                    "values": []
                },
                {
                    "provider": "udhai@mdtree.com",
                    "values": [
                        [
                            "11-05-2014",
                            1
                        ],
                        [
                            "11-10-2014",
                            2
                        ],
                        [
                            "11-07-2014",
                            1
                        ],
                        [
                            "11-06-2014",
                            1
                        ],
                        [
                            "11-21-2014",
                            1
                        ],
                        [
                            "11-22-2014",
                            1
                        ],
                        [
                            "01-05-2015",
                            1
                        ],
                        [
                            "01-07-2015",
                            1
                        ],
                        [
                            "12-10-2014",
                            2
                        ],
                        [
                            "12-05-2014",
                            1
                        ]
                    ]
                }
            ],
            "total": 3
        },
        {
            "key": "silver",
            "values": [
                {
                    "provider": "yashis@mdtree.com",
                    "values": []
                },
                {
                    "provider": "vinai@mdtree.com",
                    "values": []
                }
            ],
            "total": 2
        }
    ]
}
* Description: Hit analysis based on plantype

## Report ##

### Onboard report for current year ###

* Method: GET
* Path: /v1/onBoard
* Sample Input: http://localhost:8000/v1/onBoard
* Sample Output: {
    "report": {
        "key": "provider",
        "values": [
            [
                1417717800000,
                7625
            ],
            [
                1417977000000,
                6
            ]
        ],
        "total": 7631
    }
}
* Description: Onboard report for current month

### Onboard report for specific year ###

* Method: GET
* Path: /v1/onBoard
* Query param: year - string
* Sample Input: http://localhost:8000/v1/onBoard?year=2013
* Sample Output: {
    "report": {}
}
* Description: Onboard report for current month

### Onboard report for given month and year ###

* Method: GET
* Path: /v1/onBoard
* Query param: month - string, year - string
* Sample Input: http://localhost:8000/v1/onBoard?month=12&year=2014
* Sample Output: {
    "report": {
        "key": "provider",
        "values": [
            [
                1417717800000,
                7625
            ],
            [
                1417977000000,
                6
            ]
        ],
        "total": 7631
    }
}
* Description: Onboard report for given month and given year

### Onboard report for given dates ###

* Method: GET
* Path: /v1/onBoard
* Query Param: fromDate - string, toDate - string
* Sample Input: http://localhost:8000/v1/onBoard?fromDate=07-06-2014&toDate=12-08-2014
* Sample Output: {
    "report": {
        "key": "provider",
        "values": [
            [
                1417717800000,
                7625
            ],
            [
                1417977000000,
                6
            ]
        ],
        "total": 7631
    }
}
* Description: Onboard report for given dates 

## Onboard report with plan type ##

### Onboard report with plan type current year ###

* Method: GET
* Path: /v1/onBoardType
* Sample Input: http://localhost:8000/v1/onBoardType
* Sample Output: {
    "report": {
        "key": "provider",
        "values": [
            [
                "bronze",
                3
            ],
            [
                "gold",
                3
            ],
            [
                "silver",
                2
            ]
        ],
        "total": 8
    }
}
* Description: Report for current year

### Onboard report with plan type for specific year ###

* Method: GET
* Path: /v1/onBoardType
* Sample Input: http://localhost:8000/v1/onBoardType?year=2013
* Sample Output: {
    "report": {}
}
* Description: Report for given year

### Onboard report with plan type for given dates ###

* Method: GET
* Path: /v1/onBoardType
* Query Param: fromDate - string, toDate - string
* Sample Input: http://localhost:8000/v1/onBoardType?fromDate=12-07-2014&toDate=12-09-2014
* Sample Output: {
    "report": {
        "key": "provider",
        "values": [
            [
                "bronze",
                3
            ],
            [
                "gold",
                3
            ],
            [
                "silver",
                2
            ]
        ],
        "total": 8
    }
}
* Description: report for given dates

### Onboard report with plan type for given month and year ###

* Method: GET
* Path: /v1/onBoardType
* Query Param: month - string, year - string
* Sample Input: http://localhost:8000/v1/onBoardType?month=11&year=2014
* Sample Output: {
    "report": {}
}
* Description: Report for given month and year

## Patient report ##

### Current month report for patient ###

* Method: GET
* Path: /v1/patientReport
* Query Param: email - string(email)
* Sample Input: http://localhost:8000/v1/patientReport?email=patient2@mdtree.com
* Sample Output: {
    "appointment": {
        "values": [
            {
                "reason": "Hair loss",
                "provEmail": "udhai@mdtree.com",
                "prov": "Udhai, S",
                "time": "09:15PM",
                "date": "12-05-2014",
                "loc": {
                    "zip": "90001",
                    "state": "CA",
                    "city": "city1",
                    "address": "clinic1"
                }
            },
            {
                "reason": "Allergies",
                "provEmail": "udhai@mdtree.com",
                "prov": "Udhai, S",
                "time": "09:15PM",
                "date": "12-10-2014",
                "loc": {
                    "zip": "90001",
                    "state": "CA",
                    "city": "city1",
                    "address": "clinic1"
                }
            },
            {
                "reason": "Coughing",
                "provEmail": "udhai@mdtree.com",
                "prov": "Udhai, S",
                "time": "09:45PM",
                "date": "12-10-2014",
                "loc": {
                    "zip": "90001",
                    "state": "CA",
                    "city": "city1",
                    "address": "clinic1"
                }
            },
            {
                "reason": "Abdominal pain",
                "provEmail": "jack@mdtree.com",
                "prov": "Jack, T",
                "time": "01:45AM",
                "date": "12-12-2014",
                "loc": {
                    "zip": "90255",
                    "state": "CA",
                    "city": "city1",
                    "address": "clinic1"
                }
            },
            {
                "reason": "Fibroids",
                "provEmail": "jack@mdtree.com",
                "prov": "Jack, T",
                "time": "01:15PM",
                "date": "12-17-2014",
                "loc": {
                    "zip": "90255",
                    "state": "CA",
                    "city": "city1",
                    "address": "clinic1"
                }
            },
            {
                "reason": "Gum pain",
                "provEmail": "jack@mdtree.com",
                "prov": "Jack, T",
                "time": "03:00AM",
                "date": "12-14-2014",
                "loc": {
                    "zip": "90255",
                    "state": "CA",
                    "city": "city1",
                    "address": "clinic1"
                }
            }
        ],
        "total": 6
    }
}
* Description: List overll appointment of the user


### Report for specific year ###

* Method: GET
* Path: /v1/patientReport
* Query param: year - string
* Sample Input: http://localhost:8000/v1/patientReport?email=patient2@mdtree.com&year=2015
* Sample Output: {
    "appointment": {
        "values": [
            {
                "reason": "Dental pain",
                "provEmail": "udhai@mdtree.com",
                "prov": "Udhai, S",
                "time": "04:00PM",
                "date": "01-05-2015",
                "loc": {
                    "zip": "90001",
                    "state": "CA",
                    "city": "city1",
                    "address": "clinic1"
                }
            },
            {
                "reason": "Chest pain",
                "provEmail": "udhai@mdtree.com",
                "prov": "Udhai, S",
                "time": "04:20PM",
                "date": "01-07-2015",
                "loc": {
                    "zip": "90001",
                    "state": "CA",
                    "city": "city1",
                    "address": "clinic1"
                }
            }
        ],
        "total": 2
    }
}
* Description: Report for current month

### Report for given month and year ###

* Method: GET
* Path: /v1/patientReport
* Query param: month - string, year - string
* Sample Input: http://localhost:8000/v1/patientReport?email=patient2@mdtree.com&year=2014&month=12
* Sample Output: {
    "appointment": {
        "values": [
            {
                "reason": "Hair loss",
                "provEmail": "udhai@mdtree.com",
                "prov": "Udhai, S",
                "time": "09:15PM",
                "date": "12-05-2014",
                "loc": {
                    "zip": "90001",
                    "state": "CA",
                    "city": "city1",
                    "address": "clinic1"
                }
            },
            {
                "reason": "Allergies",
                "provEmail": "udhai@mdtree.com",
                "prov": "Udhai, S",
                "time": "09:15PM",
                "date": "12-10-2014",
                "loc": {
                    "zip": "90001",
                    "state": "CA",
                    "city": "city1",
                    "address": "clinic1"
                }
            },
            {
                "reason": "Coughing",
                "provEmail": "udhai@mdtree.com",
                "prov": "Udhai, S",
                "time": "09:45PM",
                "date": "12-10-2014",
                "loc": {
                    "zip": "90001",
                    "state": "CA",
                    "city": "city1",
                    "address": "clinic1"
                }
            },
            {
                "reason": "Abdominal pain",
                "provEmail": "jack@mdtree.com",
                "prov": "Jack, T",
                "time": "01:45AM",
                "date": "12-12-2014",
                "loc": {
                    "zip": "90255",
                    "state": "CA",
                    "city": "city1",
                    "address": "clinic1"
                }
            },
            {
                "reason": "Fibroids",
                "provEmail": "jack@mdtree.com",
                "prov": "Jack, T",
                "time": "01:15PM",
                "date": "12-17-2014",
                "loc": {
                    "zip": "90255",
                    "state": "CA",
                    "city": "city1",
                    "address": "clinic1"
                }
            },
            {
                "reason": "Gum pain",
                "provEmail": "jack@mdtree.com",
                "prov": "Jack, T",
                "time": "03:00AM",
                "date": "12-14-2014",
                "loc": {
                    "zip": "90255",
                    "state": "CA",
                    "city": "city1",
                    "address": "clinic1"
                }
            }
        ],
        "total": 6
    }
}
* Description: Report for given month and given year

### Report for given dates ###

* Method: GET
* Path: /v1/patientReport
* Query Param: fromDate - string, toDate - string
* Sample Input: http://localhost:8000/v1/patientReport?email=patient2@mdtree.com&fromDate=12-11-2014&toDate=12-17-2014
* Sample Output: {
    "appointment": {
        "values": [
            {
                "reason": "Abdominal pain",
                "provEmail": "jack@mdtree.com",
                "prov": "Jack, T",
                "time": "01:45AM",
                "date": "12-12-2014",
                "loc": {
                    "zip": "90255",
                    "state": "CA",
                    "city": "city1",
                    "address": "clinic1"
                }
            },
            {
                "reason": "Fibroids",
                "provEmail": "jack@mdtree.com",
                "prov": "Jack, T",
                "time": "01:15PM",
                "date": "12-17-2014",
                "loc": {
                    "zip": "90255",
                    "state": "CA",
                    "city": "city1",
                    "address": "clinic1"
                }
            },
            {
                "reason": "Gum pain",
                "provEmail": "jack@mdtree.com",
                "prov": "Jack, T",
                "time": "03:00AM",
                "date": "12-14-2014",
                "loc": {
                    "zip": "90255",
                    "state": "CA",
                    "city": "city1",
                    "address": "clinic1"
                }
            }
        ],
        "total": 3
    }
}
* Description: Report for given dates 

## Provider Report ##

### Current month report of the provider ###

* Method: GET
* Path: /v1/providerReport
* Query Param: email - string(email)
* Sample Input: http://localhost:8000/v1/providerReport?email=udhai@mdtree.com
* Sample Output: {
    "appointment": {
        "values": [
            {
                "date": "12-10-2014",
                "location": "udhai@mdtree.com0",
                "slot": [
                    {
                        "from": "09:45PM",
                        "to": "10:00PM",
                        "status": "booked",
                        "by": "patient2@mdtree.com",
                        "at": 54518,
                        "patient": {
                            "name": "patient",
                            "email": "patient2@mdtree.com",
                            "phoneno": "7987545412",
                            "gender": "male",
                            "purpose": "Coughing",
                            "message": null,
                            "insurance": "insure_3"
                        }
                    },
                    {
                        "from": "09:15PM",
                        "to": "09:30PM",
                        "status": "booked",
                        "by": "patient2@mdtree.com",
                        "at": 70585,
                        "patient": {
                            "name": "patient",
                            "email": "patient2@mdtree.com",
                            "phoneno": "7987545412",
                            "gender": "male",
                            "purpose": "Allergies",
                            "message": null,
                            "insurance": "insure_3"
                        }
                    }
                ]
            },
            {
                "date": "12-05-2014",
                "location": "udhai@mdtree.com0",
                "slot": [
                    {
                        "from": "09:15PM",
                        "to": "09:30PM",
                        "status": "booked",
                        "by": "patient2@mdtree.com",
                        "at": 42628,
                        "patient": {
                            "name": "patient",
                            "email": "patient2@mdtree.com",
                            "phoneno": "7987545412",
                            "gender": "male",
                            "purpose": "Hair loss",
                            "message": null,
                            "insurance": "insure_3"
                        }
                    }
                ]
            }
        ],
        "total": 3
    }
}
* Description: Current month appointment report of provider

### Report for specific year ###

* Method: GET
* Path: /v1/providerReport
* Query param: year - string
* Sample Input: http://localhost:8000/v1/providerReport?email=udhai@mdtree.com&year=2015
* Sample Output: {
    "appointment": {
        "values": [
            {
                "date": "01-05-2015",
                "location": "udhai@mdtree.com0",
                "slot": [
                    {
                        "from": "04:00PM",
                        "to": "04:20PM",
                        "status": "booked",
                        "by": "patient2@mdtree.com",
                        "at": 50115,
                        "patient": {
                            "name": "patient",
                            "email": "patient2@mdtree.com",
                            "phoneno": "7987545412",
                            "gender": "male",
                            "purpose": "Dental pain",
                            "message": null,
                            "insurance": "insure_3"
                        }
                    }
                ]
            },
            {
                "date": "01-07-2015",
                "location": "udhai@mdtree.com0",
                "slot": [
                    {
                        "from": "04:20PM",
                        "to": "04:40PM",
                        "status": "booked",
                        "by": "patient2@mdtree.com",
                        "at": 50209,
                        "patient": {
                            "name": "patient",
                            "email": "patient2@mdtree.com",
                            "phoneno": "7987545412",
                            "gender": "male",
                            "purpose": "Chest pain",
                            "message": null,
                            "insurance": "insure_3"
                        }
                    }
                ]
            }
        ],
        "total": 2
    }
}
* Description: Report for specific year

### Report for given month and year ###

* Method: GET
* Path: /v1/providerReport
* Query param: month - string, year - string
* Sample Input: http://localhost:8000/v1/providerReport?email=udhai@mdtree.com&year=2014&month=11 
* Sample Output: {
    "appointment": {
        "values": [
            {
                "date": "11-05-2014",
                "location": "udhai@mdtree.com0",
                "slot": [
                    {
                        "status": "booked",
                        "to": "10:30AM",
                        "from": "10:00AM",
                        "by": "patient1@mdtree.com",
                        "at": 68130,
                        "patient": {
                            "name": "patient1",
                            "email": "patient1@mdtree.com",
                            "phoneno": "3434134343",
                            "gender": "male",
                            "purpose": "Abdominal pain",
                            "message": null,
                            "insurance": "insure_3",
                            "offer": {
                                "date": "11-05-2014",
                                "title": "test offer",
                                "description": "checking offer for the provider"
                            }
                        }
                    }
                ]
            },
            {
                "date": "11-10-2014",
                "location": "udhai@mdtree.com0",
                "slot": [
                    {
                        "from": "06:30PM",
                        "to": "07:00PM",
                        "status": "booked",
                        "by": "patient1@mdtree.com",
                        "at": 68476,
                        "patient": {
                            "name": "patient1",
                            "email": "patient1@mdtree.com",
                            "phoneno": "3434134343",
                            "gender": "male",
                            "purpose": "Abdominal pain",
                            "message": null,
                            "insurance": "insure_3",
                            "offer": {
                                "date": "11-10-2014",
                                "title": null,
                                "description": null
                            }
                        }
                    },
                    {
                        "from": "07:00PM",
                        "to": "07:30PM",
                        "status": "booked",
                        "by": "patient1@mdtree.com",
                        "at": 68658,
                        "patient": {
                            "name": "patient1",
                            "email": "patient1@mdtree.com",
                            "phoneno": "3434134343",
                            "gender": "male",
                            "purpose": "Abdominal pain",
                            "message": null,
                            "insurance": "insure_3",
                            "offer": {
                                "date": "11-10-2014",
                                "title": null,
                                "description": null
                            }
                        }
                    }
                ]
            },
            {
                "date": "11-07-2014",
                "location": "udhai@mdtree.com0",
                "slot": [
                    {
                        "status": "booked",
                        "to": "10:30AM",
                        "from": "10:00AM",
                        "by": "patient1@mdtree.com",
                        "at": 69711,
                        "patient": {
                            "name": "patient1",
                            "email": "patient1@mdtree.com",
                            "phoneno": "3434134343",
                            "gender": "male",
                            "purpose": "Abdominal pain",
                            "message": null,
                            "insurance": "insure_3"
                        }
                    }
                ]
            },
            {
                "date": "11-06-2014",
                "location": "udhai@mdtree.com0",
                "slot": [
                    {
                        "status": "booked",
                        "to": "10:30AM",
                        "from": "10:00AM",
                        "by": "patient1@mdtree.com",
                        "at": 69746,
                        "patient": {
                            "name": "patient1",
                            "email": "patient1@mdtree.com",
                            "phoneno": "3434134343",
                            "gender": "male",
                            "purpose": "Abdominal pain",
                            "message": null,
                            "insurance": "insure_3",
                            "offer": {
                                "date": "11-06-2014",
                                "title": "test offer",
                                "description": "checking offer for the provider"
                            }
                        }
                    }
                ]
            },
            {
                "date": "11-21-2014",
                "location": "udhai@mdtree.com0",
                "slot": [
                    {
                        "from": "10:00AM",
                        "to": "10:30AM",
                        "status": "booked",
                        "by": "patient1@mdtree.com",
                        "at": 49477,
                        "patient": {
                            "name": "patient1",
                            "email": "patient1@mdtree.com",
                            "phoneno": "3434134343",
                            "gender": "male",
                            "purpose": "Anxiety",
                            "message": null,
                            "insurance": "insure_3",
                            "offer": {
                                "date": "11-21-2014",
                                "title": "check new offer",
                                "description": "limited offer"
                            }
                        }
                    }
                ]
            },
            {
                "date": "11-22-2014",
                "location": "udhai@mdtree.com0",
                "slot": [
                    {
                        "from": "10:00AM",
                        "to": "10:30AM",
                        "status": "booked",
                        "by": "patient1@mdtree.com",
                        "at": 49751,
                        "patient": {
                            "name": "patient1",
                            "email": "patient1@mdtree.com",
                            "phoneno": "3434134343",
                            "gender": "male",
                            "purpose": "Coughing",
                            "message": null,
                            "insurance": "insure_3"
                        }
                    }
                ]
            }
        ],
        "total": 7
    }
}
* Description: Report for given month and given year

### Report for given dates ###

* Method: GET
* Path: /v1/providerReport
* Query Param: fromDate - string, toDate - string
* Sample Input: http://localhost:8000/v1/providerReport?email=udhai@mdtree.com&fromDate=12-10-2014&toDate=12-20-2014
* Sample Output: {
    "appointment": {
        "values": [
            {
                "date": "12-10-2014",
                "location": "udhai@mdtree.com0",
                "slot": [
                    {
                        "from": "09:45PM",
                        "to": "10:00PM",
                        "status": "booked",
                        "by": "patient2@mdtree.com",
                        "at": 54518,
                        "patient": {
                            "name": "patient",
                            "email": "patient2@mdtree.com",
                            "phoneno": "7987545412",
                            "gender": "male",
                            "purpose": "Coughing",
                            "message": null,
                            "insurance": "insure_3"
                        }
                    },
                    {
                        "from": "09:15PM",
                        "to": "09:30PM",
                        "status": "booked",
                        "by": "patient2@mdtree.com",
                        "at": 70585,
                        "patient": {
                            "name": "patient",
                            "email": "patient2@mdtree.com",
                            "phoneno": "7987545412",
                            "gender": "male",
                            "purpose": "Allergies",
                            "message": null,
                            "insurance": "insure_3"
                        }
                    }
                ]
            }
        ],
        "total": 2
    }
}
* Description: Report for given dates

## Special offer list of a provider ##

### Current month list ###

* Method: GET
* Path: /v1/listOffer
* Query Param: email - string(email)
* Sample Input: http://localhost:8000/v1/listOffer?email=guru@mdtree.com
* Sample Output: {
    "offerDetails": [
        {
            "title": "0fferid1",
            "description": "offer1",
            "createdAt": "12-23-2014",
            "fromDate": "12-23-2014",
            "toDate": "12-24-2014",
            "appointment": 3
        },
        {
            "title": "0fferid2",
            "description": "offer2",
            "createdAt": "12-23-2014",
            "fromDate": "12-25-2014",
            "toDate": "12-25-2014",
            "appointment": 3
        },
        {
            "title": "0fferid3",
            "description": "offer3",
            "createdAt": "12-23-2014",
            "fromDate": "12-26-2014",
            "toDate": "12-29-2014",
            "appointment": 1
        },
        {
            "title": "0fferid4",
            "description": "offer4",
            "createdAt": "12-23-2014",
            "fromDate": "12-30-2014",
            "toDate": "01-05-2015"
        },
        {
            "title": "offer11",
            "description": "offer11",
            "createdAt": "12-23-2014",
            "fromDate": "12-24-2014",
            "toDate": "12-24-2014",
            "appointment": 2
        },
        {
            "title": "offer12",
            "description": "offer12",
            "createdAt": "12-23-2014",
            "fromDate": "12-27-2014",
            "toDate": "12-27-2014"
        }
    ]
}
* Description: Offers in current month

### Current given month and year list ###

* Method: GET
* Path: /v1/listOffer
* Query Param: email - string(email), month - String, year - String
* Sample Input: http://localhost:8000/v1/listOffer?email=guru@mdtree.com&month=1&year=2015
* Sample Output: {
    "offerDetails": [
        {
            "title": "offer6",
            "description": "offer6",
            "createdAt": "12-23-2014",
            "fromDate": "01-01-2015",
            "toDate": "01-02-2015",
            "appointment": 1
        }
    ]
}
* Description: Offers in given month and year

### Current given dates list ###

* Method: GET
* Path: /v1/listOffer
* Query Param: email - string(email), fromDate - String, toDate - string
* Sample Input: http://localhost:8000/v1/listOffer?email=guru@mdtree.com&fromDate=12-23-2014&toDate=12-26-2014
* Sample Output: {
    "offerDetails": [
        {
            "title": "0fferid1",
            "description": "offer1",
            "createdAt": "12-23-2014",
            "fromDate": "12-23-2014",
            "toDate": "12-24-2014",
            "appointment": 3
        },
        {
            "title": "0fferid2",
            "description": "offer2",
            "createdAt": "12-23-2014",
            "fromDate": "12-25-2014",
            "toDate": "12-25-2014",
            "appointment": 3
        },
        {
            "title": "0fferid3",
            "description": "offer3",
            "createdAt": "12-23-2014",
            "fromDate": "12-26-2014",
            "toDate": "12-29-2014",
            "appointment": 1
        },
        {
            "title": "offer11",
            "description": "offer11",
            "createdAt": "12-23-2014",
            "fromDate": "12-24-2014",
            "toDate": "12-24-2014",
            "appointment": 2
        }
    ]
}
* Description: Offers in given dates