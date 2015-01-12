mdtreeApp.controller('admin_role_controller',function admin_role_controller($scope,$timeout,productService,$state,$http,Auth,$timeout){
	// $scope.nameHitAnalysis = true;
	$scope.deleteDetails = function(index){

		$http.delete('/v1/deleteAdmin?email=' + $scope.adminroles[index].email).success(function(data){
			console.log(data);
            var msg = "Deleted successfully.";
            var type = "success";
            $timeout(function(){
                    $scope.alerts.splice(0, 1);
             }, 5000);
            $scope.alerts =[];
            $scope.alerts.push({msg: msg,type: type});
			$scope.resetOldData();
		}).error (function(data){
				var msg = data.message;
                var type = "danger";
                $timeout(function(){
                        $scope.alerts.splice(0, 1);
                 }, 5000);
                $scope.alerts =[];
                $scope.alerts.push({msg: msg,type: type});
		});
	};

	$scope.statusChange =  function(index, adminstatus){
			$scope.seletedadmin = $scope.adminroles[index].email;
			$http.put('/v1/statusUpdate?email=' + $scope.seletedadmin + '&status=' + adminstatus).
			success(function(data){
				console.log(data);
				$scope.resetOldData();
				var msg = "Updated successfully.";
	            var type = "success";
	            $timeout(function(){
	                    $scope.alerts.splice(0, 1);
	             }, 5000);
	            $scope.alerts =[];
	            $scope.alerts.push({msg: msg,type: type});
			}).
			error(function(data){
				var msg = data.message;
                var type = "danger";
                $timeout(function(){
                        $scope.alerts.splice(0, 1);
                 }, 5000);
                $scope.alerts =[];
                $scope.alerts.push({msg: msg,type: type});

			});
		
	};

	$scope.resetOldData = function(){
		$http.get('/v1/listAdmin').success(function(data){
			console.log(data);
			$scope.adminroles = data.admins;

		})
			.error(function(data){
			console.log(data);

		});

	};


	$scope.saveNewData = function(roles, PasswordChanging){
		console.log(roles,$scope.PasswordChanging);
		var updateDetails;
		if(PasswordChanging == undefined){
			updateDetails = {"username":roles.username,"role":roles.role};
		}else{
			updateDetails = {"username":roles.username,"password":PasswordChanging,"role":roles.role};
		}	
		
		console.log(updateDetails, $scope.storeEmail);		
		$http.put('/v1/updateAdmin?email='+$scope.storeEmail,updateDetails)
		.success(function(data){
			console.log($scope.storeEmail);
			$scope.resetOldData();
				var msg = "Updated successfully.";
	            var type = "success";
	            $timeout(function(){
	                    $scope.alerts.splice(0, 1);
	             }, 5000);
	            $scope.alerts =[];
	            $scope.alerts.push({msg: msg,type: type});
		}).error(function(data){
				var msg = data.message;
                var type = "danger";
                $timeout(function(){
                        $scope.alerts.splice(0, 1);
                 }, 5000);
                $scope.alerts =[];
                $scope.alerts.push({msg: msg,type: type});
		});
	};

	$scope.editRoleDetails = function(index){
		$scope.adminroles[index].selecting = true;
		$scope.storeEmail = $scope.adminroles[index].email;
		console.log($scope.storeEmail);
		for (var i = 0; i < $scope.adminroles.length; i++) {
			if (i != index){
				$scope.adminroles[i].selecting = false;
			}
		}
	};

	$scope.addToList = function(){
		var details ={"email":$scope.usernameHitAnalysis,"role":$scope.role.role,"password":$scope.passHitAnalysis,"name":$scope.name};
		console.log(details);
		$http.post('/v1/createRole',details).success(function(data){
			console.log(data);
			$scope.resetOldData();
			var msg = "Created successfully.";
            var type = "success";
            $timeout(function(){
                    $scope.alerts.splice(0, 1);
             }, 5000);
            $scope.alerts =[];
            $scope.alerts.push({msg: msg,type: type});
		})
			.error(function(data){
			console.log(data);
				var msg = data.message;
                var type = "danger";
 				$timeout(function(){
                    $scope.alerts.splice(0, 1);
             	}, 5000);
                $scope.alerts =[];
                $scope.alerts.push({msg: msg,type: type});

		});
	};

	$scope.role = {};


	
	$scope.resetOldData();
	
	$scope.role = {};
	$scope.role.options =  [{role:"salesAdmin"},{role:"salesManagerAdmin"}];
});



// * Method: GET
// * Path: /v1/listAdmin
// * Sample Input: http://localhost:8000/v1/listAdmin
// * Sample Output for admin: {
//     "admins": [        
//         {
//             "email": "sales3@mdtree.com",
//             "username": "salesAdmin",
//             "role": "salesAdmin",
//             "status": "deactivate"
//         },
//         {
//             "email": "manager5@mdtree.com",
//             "username": "Yashis",
//             "role": "salesManagerAdmin",
//             "status": "activate"
//         },
//         {
//             "email": "sales4@mdtree.com",
//             "username": "salesAdmin",
//             "role": "salesAdmin",
//             "status": "deactivate"
//         },
//         {
//             "email": "manager2@mdtree.com",
//             "username": "salesManagerAdmin",
//             "role": "salesManagerAdmin",
//             "status": "activate"
//         },
//         {
//             "email": "manager3@mdtree.com",
//             "username": "salesManagerAdmin",
//             "role": "salesManagerAdmin",
//             "status": "deactivate"
//         },
//         {
//             "email": "manager4@mdtree.com",
//             "username": "salesManagerAdmin",
//             "role": "salesManagerAdmin",
//             "status": "deactivate"
//         },
//         {
//             "email": "sales2@mdtree.com",
//             "username": "salesAdmin",
//             "role": "salesAdmin",
//             "status": "activate"
//         }
//     ]
// }
