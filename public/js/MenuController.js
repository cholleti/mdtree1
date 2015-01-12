
mdtreeApp.controller('Menucontroller', ['$rootScope', '$scope', '$location', 'Auth','$state','productService',
 function($rootScope, $scope, $location, Auth,$state,productService) {
    $scope.$watch(function () { return productService.getsignupclicked();}, function (data) { 
            $scope.signupclicked = data;
            //return true or false
    });
    $scope.user = Auth.user;
    $scope.userRoles = Auth.userRoles;
    $scope.accessLevels = Auth.accessLevels;
    
    // console.log($scope.user);
    // console.log($scope.userRoles);
    // console.log($scope.accessLevels);

    $scope.preventClose = function(event) { event.stopPropagation(); };
    $scope.status = {isopen: false};


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
    $scope.usernameavaliable = function(){
            $scope.name = productService.getname();
            if($scope.name == undefined){
                return false;

            }
            else{
                
                return true;
            }
        }


}]);