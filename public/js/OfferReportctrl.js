
mdtreeApp.controller('OfferReportctrl', function OfferReportctrl($scope,$state,productService,SelectValueService,$http,$timeout,Auth){
	$scope.user = Auth.user;
	$scope.selectedOption ='date';
	$scope.statusSelected = {};
	$scope.changeView = function(value){
		$scope.selectedOption = value;
		$scope.offerDetails = null
	}

		
		// if($scope.user.type === 'provider'){
		// 	$http.get('v1/provider?email=' +Auth.user.email+'&type=alllocation')
		//         .success(function(data, status, headers, config) {
		//             $scope.loctaions = data.providerLocations;
		            
		//         })
		//         .error(function(data, status, headers, config) {
		//             console.log(data);
		//     });
		// }
	
		$scope.dateChange = function(formData){
			console.log(formData);

			if(formData.form && formData.to ){
				
				var url ='/v1/listOffer?email='+Auth.user.email+'&fromDate='+formData.form+'&toDate='+formData.to;
				$scope.getDataFromServer(url)
				
				
			}
			
		}
		$scope.monthChange = function(month){
			month=  Number(month) +1 ;
			console.log(month);
			
				var url ='/v1/listOffer?email='+Auth.user.email+'&year='+new Date().getFullYear()+'&month='+month;
				$scope.getDataFromServer(url);
			
		}
		$scope.yearChange = function(year){
			console.log(year);
			
				var url ='/v1/listOffer?email='+Auth.user.email+'&year='+year;
				$scope.getDataFromServer(url);
			
		
			
		}
		$scope.monthyearChange = function(year,month){

			month= Number(month) +1;

			
				var url ='/v1/listOffer?email='+Auth.user.email+'&year='+year+'&month='+month;
				$scope.getDataFromServer(url);
			
			
		}

		$scope.getDataFromServer = function(url){
			console.log(url);
			$http.get(url).success(function(data){  

				$scope.offerDetails =  data.offerDetails

				console.log(data);

				// if(data.appointment.values.length < 1){
				// 	$scope.noAppointments = true;
				// }else{
				// 	$scope.noAppointments = false;
				// }
				// $scope.findlocation();
	            }).error(function(data, status, headers, config) {
	              console.log(data);
	        });
		}
		$scope.getDataFromServer('/v1/listOffer?email='+Auth.user.email)
		// var Selectedinsurance =  _.findWhere($scope.insurance.options, {key:data.slot.slots[i].patient.insurance}) ;
		$scope.availableGenres = [];
		$scope.availableName = [];
		$scope.nameFilter = {};
 //        $scope.findlocation = function(){
 //        	console.log($scope.appointment);
 //        	for(var i =0;i<$scope.appointment.values.length;i++){
 //        		console.log()
 //        		$scope.appointment.values[i].locValue = _.findWhere($scope.loctaions, {locId:$scope.appointment.values[i].location})
 //        	}
 //        	angular.forEach($scope.appointment.values, function(eachValue, index){

 //                angular.forEach(eachValue.slot, function(status, index){
 //                    var exists = false;
 //                	var nameExist = false;

	//                 angular.forEach($scope.availableGenres, function(avGenre, index){
	//                     if(avGenre == status.status){
	//                         exists = true;
	//                     }
	//                 	});
	                    
	            
	//                 angular.forEach($scope.availableName, function(avGenre, index){
	// 	                if(avGenre == status.name){
	// 	                        nameExist = true;
	// 	                    }
	// 	            });
	// 	            if(exists == false){
	//                         $scope.availableGenres.push(status.status);
	//                     }
 //                    if(nameExist == false){
 //                        $scope.availableName.push(status.name);
 //                    }
	// 	            });
 //           console.log($scope.availableGenres);
 //        });
	// }

});



