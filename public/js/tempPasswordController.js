
mdtreeApp.controller('tempPasswordController', function tempPasswordController($scope,$state,productService,$http,$timeout,SelectValueService,Auth){

 $scope.questions ={};

$scope.questions.options = SelectValueService.getQusTypeJson();
	$scope.changepassword = function(){
		var tempemail = productService.getdoctorEmailTemp();
		console.log(tempemail)
		var url = '/v1/changePassword?email='+tempemail;
		var json = {password:$scope.temppass,newpassword:$scope.password}
		console.log(url);
		console.log(json);
		$http.put(url,json).success(function(data){  
                console.log(data);

                Auth.login({
                email: tempemail,
                password: $scope.password,
            },
            function(res){
            	$state.go('public.home');
            	$scope.username = "";
                $scope.password = "";
            },
            function(err){
            	$scope.username = "";
                $scope.password = "";
            });
                // $scope.questionCorret = true;

            }).error(function(data, status, headers, config) {
            	console.log(data);
              $scope.serverError = data.message;
        }); 
	} 
    
});
// Auth.login({
//                 email: $scope.username,
//                 password: $scope.password,
//             },
//             function(res) {
//                 console.log(res);
//                 $scope.username = "";
//                 $scope.password = "";
//                 if(res === 'temppassword'){
                   
//                     $state.go('public.temppassword');
//                 }else{
//                     productService.addusertypevalue(res.user);
//                     if(passValue){
//                         $state.go('user.appointment-verify');
//                     }
                    
//                     else if(res.user.type == 'patient'){
//                         $state.go('user.patient-dashboard.step1');
//                     }
//                     else if(res.user.type == 'provider'){
//                         $state.go('user.provider-dashboard.step1');
//                     }
//                     else{
//                         $state.go('public.home');
//                     }
//                 }
                
                
//             },
//             function(err) {
//                 if(passValue){
//                     $scope.username = "";
//                     $scope.password = "";
//                     var msg = err.message;
//                     var type = "danger";
//                     // $timeout(function(){
//                     //         $scope.alerts.splice(0, 1);
//                     //  }, 3000);
//                     $scope.alerts =[];
//                     $scope.alerts.push({msg: msg,type: type});

//                 }else{
//                     $state.go('anon.login');
//                     productService.addloginerror(err.message);
//                 }
                
//                 // var msg = err.message;
//                 // var type = "danger";
//                 // // $timeout(function(){
//                 // //         $scope.alerts.splice(0, 1);
//                 // //  }, 3000);
//                 // $scope.alerts =[];
//                 // $scope.alerts.push({msg: msg,type: type});  
//             });
//     };
// * Method: PUT
// * Path: /v1/changePassword
// * Query Param: email - String(email)
// * Body: password - string, newpassword - String
// * Sample Input: curl -H "accept:application/json" -H "content-type:application/json" -X PUT -d '{"password":"shama","newpassword"sharma123"}' http://localhost:8000/v1/changePassword?email=sharma@gmail.com
// * Sample Output: Updated Successfully
// * Description: It will update the loggedIn user details with new password
