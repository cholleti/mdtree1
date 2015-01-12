mdtreeApp
.controller('NavCtrl', ['$rootScope', '$scope', '$location', 'Auth','$state','productService','$timeout',
    function($rootScope, $scope, $location, Auth,$state,productService,$timeout) {
    
    $scope.user = Auth.user;
    productService.addusertypevalue($scope.user)
    productService.adduserdisplayname(Auth.user.username)
    $scope.$watch(function () { return productService.getuserdisplayname()}, function (data) { 
       
        $scope.userdisplayname =  data;
    });

    $scope.userRoles = Auth.userRoles;
    $scope.accessLevels = Auth.accessLevels;
    console.log($scope.accessLevels);
    $scope.preventClose = function(event) { event.stopPropagation(); };
    $scope.status = {isopen: false};
    $scope.$watch(function () { return productService.getusertypevalue()}, function (data) { 
            
            if(data.type == "patient"){
                $scope.usertype=true;
            }

            else{
                $scope.usertype = false;
            }
            //return true or false
    });
    $scope.$watch(function () { return productService.getname();}, function (data) { 
            $scope.username = data;
            //return true or false
    });

    $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.dialogopen = true;
        $scope.status.isopen = !$scope.status.isopen;
    };
     $scope.signupclick = function(){
        var signup = productService.getsignupclicked();
        
        if(signup==true){productService.addsignupclicked(false);}
            else{productService.addsignupclicked(true)}
        
    }

    $scope.logout = function() {
        $scope.username = "";
        $scope.password = "";
        Auth.logout(function() {
            $location.path('/');

        }, function() {
            
            $rootScope.error = "Failed to logout";
        });
    };
}]);

mdtreeApp
.controller('LoginCtrl',
 function LoginCtrl($rootScope, $scope, $location,$timeout, $window, Auth,productService,$state,$http) {
    $scope.alerts =[];
    $scope.rememberme = true;
    $scope.$watch(function () { return productService.getloginerror();}, function (data){
        var msg = data;
        var type = "danger";
        $scope.alerts =[];
        $scope.alerts.push({msg: msg,type: type});  
    });
    $scope.$watch(function () { return productService.getloginerror();}, function (data){
        $scope.username = productService.getusererrorname();
    });
    $scope.existingUser = false;
    $scope.newUser = false;
    $scope.changetoNewUser  = function  () {
        $scope.existingUser = false;
        $scope.newUser = true;
    }
    $scope.changetoOldUser  = function  () {
        $scope.existingUser = true;
        $scope.newUser = false;
    }
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
    $scope.SearchLogin = function  () {
        // productService.addusererrorname($scope.username);
        Auth.login({
                email: $scope.username,
                password: $scope.password,
            },
            function(res) {
                console.log(res);
                
                productService.addusertypevalue(res.user);
                $scope.user = Auth.user;
                if($scope.user.type === 'patient'){
                    var tempjsonForSlotStatus = productService.getSlotStatus();
                    console.log(tempjsonForSlotStatus);
                    var tempurl = '/v1/slotStatus?location='+tempjsonForSlotStatus.locid+'&email='+tempjsonForSlotStatus.doc+'&date='+tempjsonForSlotStatus.date+'&slot='+tempjsonForSlotStatus.slotTime;
                     $http.get(tempurl)
                        .success(function(data, status, headers, config) {
                           console.log(data);
                        })
                        .error(function(data, status, headers, config) {
                            console.log(data);
                    });
                }
                $state.go('user.appointment-verify');

                $scope.username = "";
                $scope.password = "";
            },
            function(err) {
                
                    var msg = err.message;
                    var type = "danger";
                    $timeout(function(){
                        $scope.alerts.splice(0, 1);
                    }, 5000);
                    $scope.alerts =[];
                    $scope.alerts.push({msg: msg,type: type});
                    $state.go('anon.appointment-signin');
              
                }
    )};
    $scope.login = function(passValue) {
        console.log(passValue);
        productService.addusererrorname($scope.username);
        
        Auth.login({
                email: $scope.username,
                password: $scope.password,
            },
            function(res) {
                console.log(res);
                $scope.username = "";
                $scope.password = "";
                if(res === 'temppassword'){
                   
                    $state.go('public.temppassword');
                }else{
                    productService.addusertypevalue(res.user);
                    if(passValue){
                        $state.go('user.appointment-verify');
                    }
                    
                    else if(res.user.type == 'patient'){
                        $state.go('user.patient-dashboard.step1');
                    }
                    else if(res.user.type == 'provider'){
                        $state.go('user.provider-dashboard.step1');
                    }
                    else{
                        $state.go('public.home');
                    }
                }
                
                
            },
            function(err) {
                if(passValue){
                    $scope.username = "";
                    $scope.password = "";
                    var msg = err.message;
                    var type = "danger";
                    $timeout(function(){
                        $scope.alerts.splice(0, 1);
                    }, 5000);
                    $scope.alerts =[];
                    $scope.alerts.push({msg: msg,type: type});

                }else{
                    $state.go('anon.login');
                    productService.addloginerror(err.message);
                }
                
                // var msg = err.message;
                // var type = "danger";
                // // $timeout(function(){
                // //         $scope.alerts.splice(0, 1);
                // //  }, 3000);
                // $scope.alerts =[];
                // $scope.alerts.push({msg: msg,type: type});  
            });
    };

    $scope.loginOauth = function(provider) {
        $window.location.href = '/auth/' + provider;
    };
});
mdtreeApp
.controller('Loginprocesscontroller',
 function Loginprocesscontroller($rootScope, $scope, $location,$timeout, $window, Auth,productService,$state) {
    $scope.alerts =[];
    $scope.rememberme = true;
    $scope.$watch(function () { return productService.getloginerror();}, function (data){
        var msg = data;
        var type = "danger";
        $scope.alerts =[];
        $scope.alerts.push({msg: msg,type: type});  
    });
    $scope.$watch(function () { return productService.getloginerror();}, function (data){
        $scope.username = productService.getusererrorname();
    });
    $scope.login = function() {
        productService.addusererrorname($scope.username);
        Auth.login({
                email: $scope.username,
                password: $scope.password,
            },
            function(res) {
                $state.go('user.appointment-verify');
            },
            function(err) {
                console.log(err);
                productService.addloginerror(err.message);
                // var msg = err.message;
                // var type = "danger";
                // // $timeout(function(){
                // //         $scope.alerts.splice(0, 1);
                // //  }, 3000);
                // $scope.alerts =[];
                // $scope.alerts.push({msg: msg,type: type});  
            });
    };

    $scope.loginOauth = function(provider) {
        $window.location.href = '/auth/' + provider;
    };
});

mdtreeApp
.controller('RegisterCtrl',
['$rootScope', '$scope', '$location', 'Auth', function($rootScope, $scope, $location, Auth) {
    $scope.role = Auth.userRoles.user;
    $scope.userRoles = Auth.userRoles;

    $scope.register = function() {
        Auth.register({
                username: $scope.username,
                password: $scope.password,
                role: $scope.role
            },
            function() {
                $location.path('/');
            },
            function(err) {
                $rootScope.error = err;
            });
    };
}]);

mdtreeApp
.controller('AdminCtrl',
['$rootScope', '$scope', 'Users', 'Auth', function($rootScope, $scope, Users, Auth) {
    $scope.loading = true;
    $scope.userRoles = Auth.userRoles;

    Users.getAll(function(res) {
        $scope.users = res;
        $scope.loading = false;
    }, function(err) {
        $rootScope.error = "Failed to fetch users.";
        $scope.loading = false;
    });

}]);