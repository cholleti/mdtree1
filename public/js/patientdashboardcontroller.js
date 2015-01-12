mdtreeApp.controller('patientdashboardcontroller', function providerController($scope,Auth,$state,productService,SelectValueService,$http,$timeout,$upload,fileReader,$location){

	$scope.user = Auth.user;
	$scope.gotoproviderdetails = function(email){
		productService.adddoctorEmailTemp(email);
		$state.go('public.doctorDetails');
	}
	$scope.categories = {};
    $scope.insurance = {};
    $scope.insurance.type = 'insure_1';
    $scope.specialty= {};
    $scope.categories.options = SelectValueService.getCategoryJson();
    $scope.specialty.options = SelectValueService.getDoctorsJson();
    $scope.insurance.options = SelectValueService.getinsuranceJson();
    $scope.dentistslists= {};
    $scope.dentistslists.options = SelectValueService.getdentistslists();
    $scope.otherSpeciality = {};
    $scope.otherSpeciality.options = SelectValueService.getotherSpeciality();
    $scope.chiropractors= {};
    $scope.chiropractors.options = SelectValueService.getchiropractors();
    $scope.gender= {};
    $scope.gender.options = [{gender:"male"},{gender:"female"}];
    $scope.language= {};
    $scope.language.options = SelectValueService.getLangJson();
	$http.get('/v1/appointmentHistory?email='+$scope.user.email+'&&type=past')

	        .success(function(data, status, headers, config) {
	            console.log(data);
	            $scope.pastappointment = data.pastappointment;
                
	        })
	        .error(function(data, status, headers, config) {
	            console.log(data);
	});
	$http.get('/v1/appointmentHistory?email='+$scope.user.email+'&&type=pending')
	        .success(function(data, status, headers, config) {
	            console.log(data);
	            $scope.pendingappointment = data.pendingappointment;
                
	        })
	        .error(function(data, status, headers, config) {
	            console.log(data);
	});
	$http.get('/v1/patient?email='+$scope.user.email)
	        .success(function(data, status, headers, config) {
	            console.log(data);
	            $scope.patient = data.patient;
                if(data.patient.gender === 'female'){
                	$scope.boolChangeClass = true;
                }else{
                	$scope.boolChangeClass = false;
                }
	        })
	        .error(function(data, status, headers, config) {
	            console.log(data);
	});
	$scope.searchoperation = function(zipcode){
		productService.addcategory($scope.categories.type);
        productService.addspecialty($scope.specialty.doctor);
        productService.addinsurance($scope.insurance.type);
        productService.addlocation(zipcode);
        console.log(zipcode);
        $state.go("public.search");
	}
	        $scope.formclick = false;
    $scope.valuefunction = function(){
    	
    	 $scope.formclick = false;
        $scope.password = "";
        $scope.oldpassword = "";
         $scope.repassword = "";
    }
	$scope.passwordchangefn = function(old,newpas){
		var passwordJson = {"password":old,"newpassword":newpas};
		console.log(passwordJson);
		$http.put('/v1/changePassword?email='+$scope.user.email,passwordJson)

	        .success(function(data, status, headers, config) {
	            console.log(data);
	            $scope.valuefunction(data);
	           

	             var msg = data;
                var type = "success";
                $timeout(function(){
                    $scope.alerts.splice(0, 1);
             	}, 5000);
                $scope.passwordalerts =[];
                $scope.passwordalerts.push({msg: msg,type: type});
	        })
	        .error(function(data, status, headers, config) {
	        	$scope.formclick = true;
	            $scope.password = "";
	            $scope.oldpassword = "";
	            $scope.repassword = "";
	            console.log(data);
	             var msg = data.message;
                var type = "danger";
                $timeout(function(){
                    $scope.alerts.splice(0, 1);
             	}, 5000);
                $scope.passwordalerts =[];
                $scope.passwordalerts.push({msg: msg,type: type});
			});

	}
	$scope.ChangeSecurity = false;
	$scope.ChangePassword = false;
	$scope.ChangeSecurityQus = function(){
		$http.put('/v1/changeSecurity?email='+$scope.user.email,{"question":$scope.questions.select,"answer":$scope.Securityanswer})
	        .success(function(data, status, headers, config) {
	            console.log(data);
	            var msg = data;
                var type = "success";
                $timeout(function(){
                    $scope.alerts.splice(0, 1);
             	}, 5000);
                $scope.Securityalerts =[];
                $scope.Securityalerts.push({msg: msg,type: type});
	           	
	        })
	        .error(function(data, status, headers, config) {
	            console.log(data);
	             var msg = data.message;
                var type = "danger";
                $timeout(function(){
                    $scope.alerts.splice(0, 1);
             	}, 5000);
                $scope.Securityalerts =[];
                $scope.Securityalerts.push({msg: msg,type: type});
		});
	}
	$scope.questions = {};
	$scope.questions.options = SelectValueService.getQusTypeJson();
	$scope.displayTermMessage = function(){
      $scope.DisplayTermMessageError ="You must read and accept the Terms & Conditions before submitting the details. "
    }
    $scope.getChangeSecurityQus = function(){
    	$http.get('/v1/getSecurity?email='+$scope.user.email)
	        .success(function(data, status, headers, config) {
	            console.log(data);
	           	$scope.questions.select = data.security.question;
	           	$scope.Securityanswer = data.security.answer;
	        })
	        .error(function(data, status, headers, config) {
	            console.log(data);
		});
    }
    

	$scope.paitentUpdateProfile = function(boolChangeClass){
		console.log(boolChangeClass);
		if(boolChangeClass){
              var gender = "female";
          }else{ var gender = "male" };
          console.log(gender);
		var Patientjson = {"firstName":$scope.patient.username,"lastName":$scope.patient.lastName,"phone":$scope.patient.phone,"zipCode":$scope.patient.zipCode,"gender":gender,"dob":$scope.patient.dob}
		console.log(Patientjson);
		$http.put('/v1/updatePatient?email='+$scope.user.email,Patientjson)

	        .success(function(data, status, headers, config) {
	            console.log(data);
	             var msg = data;
                var type = "success";
                $timeout(function(){
                    $scope.alerts.splice(0, 1);
             	}, 5000);
                $scope.alerts =[];
                $scope.alerts.push({msg: msg,type: type});
	        })
	        .error(function(data, status, headers, config) {
	            console.log(data);
	             var msg = data.message;
                var type = "danger";
                $timeout(function(){
                    $scope.alerts.splice(0, 1);
             	}, 5000);
                $scope.alerts =[];
                $scope.alerts.push({msg: msg,type: type});
	});
	}

});