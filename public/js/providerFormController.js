
mdtreeApp.controller('providerFormController', function providerFormController($scope,$state,productService,$http,$timeout,SelectValueService){
$scope.state = {};
$scope.state.options = SelectValueService.getStateJson();

$scope.submitProviderform = function(){
	console.log($scope.form);
	$http.post('/v1/providerinterest', $scope.form).success(function(data){  
               
            $state.transitionTo("anon.provider-registrationcompleted",{
              },{
                reload: true,
                notify: true
            });

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
});

