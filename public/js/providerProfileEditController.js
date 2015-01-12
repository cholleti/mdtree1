mdtreeApp.controller('providerProfileEditController', function providerProfileEditController(Auth,$scope,$state,productService,SelectValueService,$http,$timeout,$upload,fileReader,$location){
	
    if(Auth.user.type == 'admin' || Auth.user.type == 'salesManagerAdmin' || Auth.user.type == 'salesAdmin'){
        var email = productService.gettemppublisheremail();
        $scope.user = {"email":email};
        if(email){
            $scope.ProviderAvaliable = true;
        }
        
    }else{
        $scope.user = Auth.user;
    }
    
    console.log(Auth.user.type);
    $scope.categories = {};
     $scope.categories.options = SelectValueService.getCategoryJson();
    $scope.specialty= {};
    $scope.title= {};

     

    $scope.title.options = SelectValueService.gettitleJson();

    $scope.state ={};
    $scope.state.options = SelectValueService.getStateJson();
    $scope.languages ={};
    $scope.specialty= {};
    $scope.specialty.options = SelectValueService.getDoctorsJson();
    $scope.dentistslists= {};
    $scope.dentistslists.options = SelectValueService.getdentistslists();
    $scope.chiropractors= {};
    $scope.chiropractors.options = SelectValueService.getchiropractors();
    $scope.vision = {}
    $scope.vision.options = SelectValueService.getvision();
    $scope.otherSpeciality = {};
    $scope.otherSpeciality.options = SelectValueService.getotherSpeciality();
    $scope.languages.options = SelectValueService.getLangJson();
    $scope.plan ={};

    $scope.plan.options = SelectValueService.getplanType();
    $scope.insurance ={};
    $scope.offer = {};
    $scope.BillingInterval ={};
    $scope.offer.options = SelectValueService.getOfferJson();
    $scope.getChangeSecurityQus = function(){
        $scope.changePhotoHide = true;
        $scope.changePasswordHide = true;
        $scope.ChangeSecurity = !$scope.ChangeSecurity;
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
    $scope.questions = {};
    $scope.questions.options = SelectValueService.getQusTypeJson();
    $scope.ChangeAllValue = function(){
        $scope.ChangeSecurity = false;
    }
    $scope.QusChangeSecurity = function(){
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
                $scope.ChangeSecurity = !$scope.ChangeSecurity;
                
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
    $scope.add = function (newValue) {

        var obj = {};
        obj.id = newValue;
        obj.key = newValue;
        console.log(obj)
        $scope.offer.options.push(obj);
        // $scope.group.name = obj;
        $scope.providerDetails.offer = obj.key;
    }
    // $scope.BillingInterval.options = [{id:"Monthly ($200 / mo )"},{id:"Quarterly ($180 / mo )"},{id:"Biannually ($150 / mo )"},{id:"Annually ($100 / mo )"}];
    // $scope.payment ={};
    // $scope.payment.options = [{id:"ACH"},{id:"BCH"},{id:"HDFC"},{id:"ICICI"}];
    // $scope.ExistingAddress ={};
    // $scope.ExistingAddress.options = [{id:"Location 1"},{id:"Location 2"},{id:"Location 3"},{id:"Location 4"}];
    $scope.cashprice ={};

    $scope.cashprice.options = SelectValueService.getcashPriceJson();
    $scope.insurance.options = SelectValueService.getinsuranceJson();
    $http.get('/v1/provider?email='+$scope.user.email + '&type=personal').success(function(data){  
            console.log(data.providerDetails.specialty);
            $scope.ProviderAvaliable = true;
            $scope.providerDetails = data.providerDetails;
           var SelectedSpeciality = ( _.findWhere($scope.specialty.options, {key:data.providerDetails.specialty} )
             || _.findWhere($scope.dentistslists.options, {key:data.providerDetails.specialty})
             || _.findWhere($scope.chiropractors.options, {key:data.providerDetails.specialty})
             || _.findWhere($scope.otherSpeciality.options, {key:$scope.specialty.doctor})  
             || _.findWhere($scope.vision.options, {key:$scope.specialty.doctor})
             ); 
           console.log(SelectedSpeciality.value);
           $scope.providerDetails.specialty = SelectedSpeciality.key;

            if($scope.providerDetails.gender == 'female'){
                $scope.boolChangeClass = true;

            }
        }).error(function(data, status, headers, config) {
          console.log(data);
          if(email){
            $scope.ProviderAvaliable = false;
            $scope.errormsg = email +" - This Provider not registered with us.";
          }
            

    }); 
    $scope.locData = [];
    $scope.locationsValues = [];
    $scope.getLoctaionDetails = function(){
    	$http.get('v1/provider?email=' +$scope.user.email+'&type=alllocation')
	        .success(function(data, status, headers, config) {
                console.log(data); 
                console.log(data.providerLocations);
	            $scope.locationsValues.options = data.providerLocations;
	            $scope.locationsValues.locations = data.providerLocations[0].locId;
                $scope.locationsValues.options.push({locId: "new",address: "Add a new location"});
	           	console.log(data); 

	           	$scope.getSpecificLocation(data.providerLocations[0].locId);
	        })
	        .error(function(data, status, headers, config) {
	            console.log(data);
	    });
    }
    $scope.getImage = function(){
        $http.get('v1/provider?email=' +$scope.user.email+'&type=personal&view=tiny')
            .success(function(data, status, headers, config) {
                console.log(data); 
                $scope.providerimage =  data.providerDetails;
                
                console.log(data); 
                
            })
            .error(function(data, status, headers, config) {
                console.log(data);
        });
    }
    $scope.getImage();


    $scope.changePasswordHide = true;
    $scope.changePhotoHide = true;
    $scope.changepassword = function(){
        $scope.changePasswordHide = !$scope.changePasswordHide;
        $scope.changePhotoHide = true;
        $scope.ChangeSecurity = false;
    }
    $scope.changePhoto = function(){
        $scope.changePhotoHide = !$scope.changePhotoHide;
        $scope.changePasswordHide = true;
        $scope.ChangeSecurity = false;
    }
    $scope.onFileSelect = function($files) {
        for (var i = 0; i < $files.length; i++) {
          $scope.file = $files[i];
          console.log($scope.file);
        }
      
      };
    $scope.getSpecificLocation  = function(locid){
    	console.log(locid)
        if(locid === 'new'){
            $scope.providerLocation = ""
        }else{
            var url = '/v1/provider?email='+$scope.user.email+'&type=location&locId='+locid;
            console.log(url);
            $http.get(url)
                .success(function(data, status, headers, config) {
                    console.log(data);
                    $scope.providerLocation = data.providerLocation;
                    $scope.phone1 = data.providerLocation.phone1;
                    $scope.modelValuephone = data.providerLocation.phone2;
                    console.log($scope.phone1,$scope.modelValuephone)
                    console.log(data.providerLocation.address);
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
            });
        }
        
    }
    // $scope.modelValuephone = "2827827900";
    $scope.imageupload = function  () {
        var email=$scope.user.email;
        $upload.upload({

        url: '/v1/imageupload', //upload.php script, node.js route, or servlet url
        method: 'PUT',
        //headers: {'header-key': 'header-value'},
        //withCredentials: true,
        
        data: {imageFile: $scope.file,email:email}
        
      }).progress(function(evt) {
        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      })
      .success(function(data, status, headers, config) {
        console.log(data);
         $scope.getImage();
         $scope.changePhotoHide = !$scope.changePhotoHide;
            var msg = data;
            var type = "success";
            $timeout(function(){
                    $scope.alerts.splice(0, 1);
             }, 5000);
            $scope.alerts =[];
            $scope.alerts.push({msg: msg,type: type});
      }).error(function(data, status, headers, config) {
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
    $scope.accreditationDetails = function(){
        $http.get('/v1/provider?email='+$scope.user.email+'&type=accreditation')
            .success(function(data, status, headers, config) {
                console.log(data);
                $scope.providerAccreditation = data.providerAccreditation;

            })
            .error(function(data, status, headers, config) {
                console.log(data);
        });
    }
    $scope.changeproviderPassword =function  () {
        $http.put('/v1/changePassword?email='+$scope.user.email,{password:$scope.oldpassword,newpassword:$scope.newpassword})
            .success(function(data, status, headers, config) {
                console.log(data);
                 var msg = data;
                var type = "success";
                $timeout(function(){
                        $scope.alerts.splice(0, 1);
                 }, 5000);
                $scope.alerts =[];
                $scope.alerts.push({msg: msg,type: type});
                $scope.changePasswordHide = !$scope.changePasswordHide;

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

// * Method: PUT
// * Path: /v1/changePassword
// * Query Param: email - String(email)
// * Body: password - string, newpassword - String
// * Sample Input: curl -H "accept:application/json" -H "content-type:application/json" -X PUT -d '{"password":"shama","newpassword"sharma123"}' http://localhost:8000/v1/changePassword?email=sharma@gmail.com
// * Sample Output: Updated Successfully
// * Description: It will update the loggedIn user details with new password
    $scope.gender = 'female';
    $scope.setGender = function  (value) {
        if(value=== 'male'){
          $scope.gender = 'male';
          $scope.boolChangeClass = false;
        }
        else{
          $scope.gender = 'female';
          $scope.boolChangeClass = true;
        }
    }
    $scope.updateProfile = function(){
        
        if($scope.boolChangeClass ==undefined){
            $scope.gender  = "male";
        }
        if($scope.providerDetails.webSite){
          var urlJson =   {"specialty":$scope.providerDetails.specialty,"category":$scope.providerDetails.category,"title":$scope.providerDetails.title,
            "firstName":$scope.providerDetails.firstName,
            "lastName":$scope.providerDetails.lastName,"dob":$scope.providerDetails.dob,"gender":$scope.gender,
            "zipCode":$scope.providerDetails.zipCode,
            "notification":$scope.providerDetails.notification,
            "cash":$scope.providerDetails.cash,"offer":$scope.providerDetails.offer,
            "cancellationNumber":$scope.providerDetails.cancellationNumber,"webSite":$scope.providerDetails.webSite};
           
        }else{
            var urlJson = 
            {"specialty":$scope.providerDetails.specialty,"category":$scope.providerDetails.category,"title":$scope.providerDetails.title,
            "firstName":$scope.providerDetails.firstName,
            "lastName":$scope.providerDetails.lastName,"dob":$scope.providerDetails.dob,"gender":$scope.gender,
            "zipCode":$scope.providerDetails.zipCode,
            "notification":$scope.providerDetails.notification,
            "cash":$scope.providerDetails.cash,"offer":$scope.providerDetails.offer,
            "cancellationNumber":$scope.providerDetails.cancellationNumber};
            
        }
        console.log("msg json is",urlJson);
        $http.put('/v1/updateProvider?email='+$scope.user.email+'&type=personal',urlJson)
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
    $scope.updateLoctaion = function(locationDetails){
        
        var urlChange = '/v1/updateProvider?email='+$scope.user.email+'&type=location&locId='+$scope.locationsValues.locations;
        var urlJson = {"location":[{"address":locationDetails.address,"practiceName":locationDetails.practiceName,"state":locationDetails.state,"city":locationDetails.city,"zip":locationDetails.zip,"phone1":locationDetails.phone1,"phone2":locationDetails.phone2,"fax":locationDetails.fax}]}
        console.log(urlJson);
        
        $http.put(urlChange,urlJson)
            .success(function(data, status, headers, config) {
                console.log(data);
                $scope.getLoctaionDetails();
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
    $scope.updateaccreditation = function(){
        var urlJson =  {"school":$scope.providerAccreditation.school,"languages":$scope.providerAccreditation.languages,"insurance":$scope.providerAccreditation.insurance,
        }
        console.log($scope.providerAccreditation.statement);
        console.log($scope.providerAccreditation.fellowship);
        console.log($scope.providerAccreditation.residency);
        if($scope.providerAccreditation.statement){
            console.log($scope.providerAccreditation.statement);
            urlJson.statement = $scope.providerAccreditation.statement;
        }
        if($scope.providerAccreditation.fellowship){
            urlJson.fellowship = $scope.providerAccreditation.fellowship;
        }
        if($scope.providerAccreditation.residency){
            urlJson.residency = $scope.providerAccreditation.residency;
        }
        if($scope.providerAccreditation.affilliation){
            urlJson.affilliation = $scope.providerAccreditation.affilliation;
        }
        

        console.log(urlJson);
       $http.put('/v1/updateProvider?email='+$scope.user.email+'&type=accreditation',urlJson)
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
                 }, 3000);
                $scope.alerts =[];
                $scope.alerts.push({msg: msg,type: type});
        });
    }

});