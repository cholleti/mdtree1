mdtreeApp.controller('dashboardReportctrl', function dashboardReportctrl($scope,$state,productService,SelectValueService,$http,$timeout,Auth){
	$scope.user = Auth.user;
	$scope.selectedOption ='date';
	$scope.statusSelected = {};
	$scope.changeView = function(value){
		$scope.selectedOption = value;
		$scope.appointment = null
	}
	if($scope.user.type === 'patient'){
		$scope.paitentreport =true;
		$scope.providerreport = false;
		
	}else{
		var url ='/v1/providerReport?email='+Auth.user.email;
		$scope.providerreport = true;
		$scope.paitentreport =false;
	}
		
		console.log(url);
		if($scope.user.type === 'provider'){
			$http.get('v1/provider?email=' +Auth.user.email+'&type=alllocation')
		        .success(function(data, status, headers, config) {
		            $scope.loctaions = data.providerLocations;
		            
		        })
		        .error(function(data, status, headers, config) {
		            console.log(data);
		    });
		}
	
		$scope.dateChange = function(formData){
			console.log(formData);
			if(formData.form && formData.to ){
				if($scope.providerreport){
					var url ='/v1/providerReport?email='+Auth.user.email+'&fromDate='+formData.form+'&toDate='+formData.to;
					$scope.getDataFromServer(url)
				}else{
					var url ='/v1/patientReport?email='+Auth.user.email+'&fromDate='+formData.form+'&toDate='+formData.to;
					$scope.getDataFromServer(url);
				}
				
			}
			
		}
		$scope.monthChange = function(month){
			month=  Number(month) +1 ;
			console.log(month);
			if($scope.providerreport){
				var url ='/v1/providerReport?email='+Auth.user.email+'&year='+new Date().getFullYear()+'&month='+month;
				$scope.getDataFromServer(url);
			}else{
				var url ='/v1/patientReport?email='+Auth.user.email+'&year='+new Date().getFullYear()+'&month='+month;
				$scope.getDataFromServer(url);
			}
		}
		$scope.yearChange = function(year){
			console.log(year);
			if($scope.providerreport){
				var url ='/v1/providerReport?email='+Auth.user.email+'&year='+year;
				$scope.getDataFromServer(url)
			}else{
				var url ='/v1/patientReport?email='+Auth.user.email+'&year='+year;
				$scope.getDataFromServer(url);
			}
		
			
		}
		$scope.monthyearChange = function(year,month){

			month= Number(month) +1;

			if($scope.providerreport){
				var url ='/v1/providerReport?email='+Auth.user.email+'&year='+year+'&month='+month;
				$scope.getDataFromServer(url);
			}else{
				var url ='/v1/patientReport?email='+Auth.user.email+'&year='+year+'&month='+month;
				$scope.getDataFromServer(url);
			}
			
		}
		$scope.getDataFromServer = function(url){
			console.log(url);
			$http.get(url).success(function(data){  
				$scope.appointment = data.appointment;
	            $scope.appointments = data.appointment;
				console.log(data);
				if(data.appointment.values.length < 1){
					$scope.noAppointments = true;
				}else{
					$scope.noAppointments = false;
				}
				if($scope.providerreport){
					$scope.findlocation();
				}
				
	            }).error(function(data, status, headers, config) {
	              console.log(data);
	        });
		}
		// var Selectedinsurance =  _.findWhere($scope.insurance.options, {key:data.slot.slots[i].patient.insurance}) ;
		$scope.availableGenres = [];
		$scope.availableName = [];
		$scope.nameFilter = {};
        $scope.findlocation = function(){
        	console.log($scope.appointment);
        	for(var i =0;i<$scope.appointment.values.length;i++){
        		console.log()
        		$scope.appointment.values[i].locValue = _.findWhere($scope.loctaions, {locId:$scope.appointment.values[i].location})
        	}
        	angular.forEach($scope.appointment.values, function(eachValue, index){

                angular.forEach(eachValue.slot, function(status, index){
                    var exists = false;
                	var nameExist = false;

	                angular.forEach($scope.availableGenres, function(avGenre, index){
	                    if(avGenre.status == status.status){
	                        exists = true;
	                    }
	                	});
	                    
	            
	                angular.forEach($scope.availableName, function(avGenre, index){
		                if(avGenre == status.name){
		                        nameExist = true;
		                    }
		            });
		            if(exists == false){
		            	if(status.status === 'available'){
		            		var name = 'Cancelled';
		            	}else{
		            		 var name = status.status;
		            	}
		            	
	                        $scope.availableGenres.push({status : status.status,name:name});

	                    }
                    if(nameExist == false){
                        $scope.availableName.push(status.name);
                    }
		            });
           console.log($scope.availableGenres);
        });
	}

});


// mdtreeApp.filter('isGenre', function(){

//     return function (input, genre){
//     	console.log(input,genre);
//         if( typeof genre == 'undefined' || genre == null) {
//             return input;
//         } else {
        	
//         	// var temp = JSON.parse(JSON.stringify(input));
//             var out = [];
//             var temp = [];
//             console.log(input.length);
//             for (var a=0; a < input.length; a++){
//                 for(var b=0; b < input[a].slot.length; b++) {
//                 	// console.log(input[a].slot[b].status,genre);
//                     if(input[a].slot[b].status == genre) {
//                     	temp.push(input[a].slot[b]);
//                     	console.log(b);
                       
//                     }

//                 }
//             }
//             return temp;
//         }
//     };
// });


