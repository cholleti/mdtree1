mdtreeApp.controller('mdTreeController',
 	function mdTreeController($scope,productService,SelectValueService,$state,$http) {
        productService.addsignupclicked(false);
        $scope.signout = function(){
            productService.addname(undefined);
        }
        $scope.$watch(function () { return productService.getsignupclicked();}, function (data) { 
            $scope.signupclicked = data;
            //return true or false
        });
        $scope.usernameavaliable = function(){
            $scope.name = productService.getname();
            if($scope.name == undefined){
                return false;

            }
            else{
                
                return true;
            }
        }


        $scope.alertForm = function(e, response) {
        alert(response.responseText)
    }
    
    // function sendFormFromHTML(form) {
    //     var formData = new FormData(form);
    //     // formData.append('id', '123456'); // alternative to hidden fields
    //     var xhr = new XMLHttpRequest();
    //     xhr.open('PUT', form.action, true);
    //     xhr.onload = function(e) { alert(this.responseText) };
    //     xhr.send(formData);
    //     return false;
    // }
        $scope.sendFormFromHTML = function (form) {

            $http({method: 'PUT',
                    url: '/v1/imageupload',
                    data: {email:$scope.email ,imageFile:$scope.imageFile},
                    headers: {'Content-Type': 'multipart/form-data'}})
            .success(function(data, status, headers, config) {
                $scope.doctordetails = data;
            })
            .error(function(data, status, headers, config) {
                console.log(data);
            });

            var formData = new FormData(form);
            // formData.append('id', '123456'); // alternative to hidden fields

            var xhr = new XMLHttpRequest();
            xhr.open('PUT', form.action, true);
            xhr.onload = function(e) { alert(this.responseText) };
            xhr.send(formData);
            return false;
        }
        $scope.name = productService.getname();

        $scope.items={
            details:[{
            "listMenu":'Doctors',
            "image":'images/doctor.png',
            "key" : "doctors"
            },
            {
            "listMenu":"Dentists",
            "image":"images/dental.png",
            "key" : "dentists"
            },{
            "listMenu":"Chiropractors",
            "image":"images/Chiropractors.png",
            "key" : "chiropractors"
            },{
            "listMenu":'Vision/Hearing',
            "image":"images/vision.png",
            "key" : "vision"
            },{
            "listMenu":'Other Providers',
            "image":"images/otherproviders.png",
            "key" : "others"
            }]
            }    
              
        $scope.searchinfo = function() {
            console.log($scope.specialty.doctor);
            productService.addspecialty($scope.specialty.doctor);

            
            // $scope.InsuranceValue = $scope.insurance.options[($scope.insurance.valueSelect-1)].value;
            // console.log($scope.InsuranceValue);
            // productService.addinsurance($scope.InsuranceValue);
            
            productService.addinsurance($scope.insurance.valueSelect);
            productService.addlocation($scope.zipcode);
            $state.transitionTo("public.search",{
              },{
                reload: true,
                notify: true
            });
        };
        $scope.specialty= {};
        $scope.specialty.doctor = "doc_spl_1";  
        $scope.specialty.options = SelectValueService.getDoctorsJson();
        $scope.dentistslists= {};
        $scope.dentistslists.options = SelectValueService.getdentistslists();
        $scope.chiropractors= {};
        $scope.chiropractors.options = SelectValueService.getchiropractors();
        $scope.Vision= {};
        $scope.Vision.options = SelectValueService.getvision();
        $scope.otherSpeciality = {};
        $scope.otherSpeciality.options = SelectValueService.getotherSpeciality();
        $scope.Other= {};
        $scope.Other.options = [{id:"Choose a specialty"}]
        $scope.insurance = {};
        $scope.insurance.valueSelect = "insure_1";  
        $scope.insurance.options = SelectValueService.getinsuranceJson();
    	productService.addcategory("doctors");
        $scope.currentContent = productService.getcategory();
        $scope.selectedIndex = 0;
    	$scope.setItem = function (item,$index) {
            $scope.selectedIndex = $index;
            $scope.currentContent = item;
            $scope.specialty.doctor = [];
            productService.addcategory($scope.currentContent);
        
        };
        $scope.specialty.doctor = "";
    }  
);
