
mdtreeApp.controller('forget_password_controller', function forget_password_controller($scope,$state,productService,$http,$timeout,SelectValueService){

 $scope.questions ={};

$scope.questions.options = SelectValueService.getQusTypeJson();
	$scope.changepassword = function(){

		var url = '/v1/forgotPassword?email='+$scope.username;
		var json = {answer:$scope.answer,question:$scope.question}
		console.log(url);
		console.log(json);
		$http.put(url,json).success(function(data){  
                console.log(data);
                $scope.questionCorret = true;

            }).error(function(data, status, headers, config) {
              $scope.serverError = data.message;
        }); 
	} 
    
});
mdtreeApp.controller('adminController', function adminController($scope,$state,productService,$http,$timeout,SelectValueService,Auth){
	console.log($state);
	$scope.$state = $state;
	$scope.user = Auth.user;
	$scope.userRoles = Auth.userRoles;
    $scope.accessLevels = Auth.accessLevels;

    
});
mdtreeApp.controller('checkingcontroller', function checkingcontroller($scope,$state,productService,$http,$timeout,SelectValueService){
	// console.log($state);
	// $scope.$state = $state;
	$scope.searchproviderFunction = function(email){
		productService.addtemppublisheremail(email);
	                $state.transitionTo("salesAdmin.dashboard.providerinfo.editprovider.step1",{
				          },{
				            reload: true,
				            notify: true
				    });
				    $scope.ProviderAvaliable = data.exist;
				    $scope.ProviderAvaliable = true;

	}
    
});
mdtreeApp.controller('convertingController', function convertingController($scope,$upload,$state,productService,$http,$timeout,SelectValueService,fileReader){
	$scope.getFile = function (file) {
        $scope.progress = 0;
        fileReader.readAsDataUrl(file, $scope)
                      .then(function(result) {
                          $scope.imageSrc = result;
                      });
    };
	$scope.onFileSelect = function($files) {
	$scope.errorOccur= false;
      for (var i = 0; i < $files.length; i++) {
        $scope.csvFile = $files[i];
        console.log($scope.file);   
      }
      	console.log($scope.csvFile.name.substr($scope.csvFile.name.lastIndexOf('.') + 1).toLowerCase());
	    var FilenameExt = $scope.csvFile.name.substr($scope.csvFile.name.lastIndexOf('.') + 1).toLowerCase();

	    if(!(FilenameExt === 'tsv')){
	      $scope.errorMsgToUserepub = "Give tsv files only."
	      $scope.errorOccur= true;

	    }
	    if(!$scope.errorOccur){
	    		$scope.gettedserverResponce = false;
	            $upload.upload({
	          
	              url: '/v1/uploadDump', //upload.php script, node.js route, or servlet url
	              method: 'POST',
	              data: {dumpFile: $scope.csvFile}

	            }).progress(function(evt) {
	            	$scope.processValue = parseInt(100.0 * evt.loaded / evt.total);
	              console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
	            })
	            // $scope.gettedserverResponce = true;
	            // $scope.dumpfile =  {"success":[{"messsage":"Successfully inserted","provider":"1003007469"},{"messsage":"Successfully inserted","provider":"1003010299"},{"messsage":"Successfully inserted","provider":"1003010299"},{"messsage":"Successfully inserted","provider":"1003010950"}],"falied":[{"messsage":"Already inserted","provider":"1003010299"},{"messsage":"Already inserted","provider":"1003010950"},{"messsage":"Login created not able to insert details","provider":"1003013335"},{"messsage":"Login created not able to insert details","provider":"1003015736"},{"messsage":"Already inserted","provider":"1003010299"},{"messsage":"Already inserted","provider":"1003013335"},{"messsage":"Already inserted","provider":"1003010299"},{"messsage":"Login created not able to insert details","provider":"1003013335"},{"messsage":"Login created not able to insert details","provider":"1003016007"},{"messsage":"Already inserted","provider":"1003015736"},{"messsage":"Already inserted","provider":"1003010950"},{"messsage":"Already inserted","provider":"1003015736"},{"messsage":"Login created not able to insert details","provider":"1003015736"},{"messsage":"Already inserted","provider":"1003010950"},{"messsage":"Login created not able to insert details","provider":"1003016023"},{"messsage":"Login created not able to insert details","provider":"1003016007"},{"messsage":"Already inserted","provider":"1003015736"},{"messsage":"Already inserted","provider":"1003016007"},{"messsage":"Login created not able to insert details","provider":"1003016007"},{"messsage":"Login created not able to insert details","provider":"1003018177"},{"messsage":"Already inserted","provider":"1003013335"},{"messsage":"Already inserted","provider":"1003016007"},{"messsage":"Login created not able to insert details","provider":"1003016023"},{"messsage":"Already inserted","provider":"1003016007"},{"messsage":"Login created not able to insert details","provider":"1003016023"},{"messsage":"Already inserted","provider":"1003013335"},{"messsage":"Already inserted","provider":"1003016023"},{"messsage":"Already inserted","provider":"1003016023"},{"messsage":"Already inserted","provider":"1003016007"},{"messsage":"Login created not able to insert details","provider":"1003018177"},{"messsage":"Already inserted","provider":"1003016023"},{"messsage":"Already inserted","provider":"1003016023"},{"messsage":"Already inserted","provider":"1003018177"},{"messsage":"Already inserted","provider":"1003015736"},{"messsage":"Already inserted","provider":"1003016023"},{"messsage":"Login created not able to insert details","provider":"1003018177"},{"messsage":"Already inserted","provider":"1003018177"},{"messsage":"Already inserted","provider":"1003016023"},{"messsage":"Already inserted","provider":"1003018177"},{"messsage":"Already inserted","provider":"1003015736"},{"messsage":"Already inserted","provider":"1003018177"},{"messsage":"Already inserted","provider":"1003018177"},{"messsage":"Already inserted","provider":"1003016023"},{"messsage":"Already inserted","provider":"1003018177"},{"messsage":"Already inserted","provider":"1003018177"},{"messsage":"Already inserted","provider":"1003016007"},{"messsage":"Already inserted","provider":"1003018177"},{"messsage":"Already inserted","provider":"1003018177"},{"messsage":"Already inserted","provider":"1003016007"},{"messsage":"Already inserted","provider":"1003018177"},{"messsage":"Already inserted","provider":"1003016023"},{"messsage":"Already inserted","provider":"1003016023"},{"messsage":"Already inserted","provider":"1003018177"},{"messsage":"Already inserted","provider":"1003018177"}],"err":[{"messsage":{"data":null,"isBoom":true,"output":{"statusCode":403,"payload":{"statusCode":403,"error":"Forbidden","message":"Path `title` is required. Path `school` is required. "},"headers":{}}},"provider":"1003013335"},{"messsage":{"data":null,"isBoom":true,"output":{"statusCode":403,"payload":{"statusCode":403,"error":"Forbidden","message":"Path `title` is required. Path `school` is required. "},"headers":{}}},"provider":"1003015736"},{"messsage":{"data":null,"isBoom":true,"output":{"statusCode":403,"payload":{"statusCode":403,"error":"Forbidden","message":"Path `title` is required. Path `school` is required. "},"headers":{}}},"provider":"1003013335"},{"messsage":{"data":null,"isBoom":true,"output":{"statusCode":403,"payload":{"statusCode":403,"error":"Forbidden","message":"Path `title` is required. Path `school` is required. "},"headers":{}}},"provider":"1003016007"},{"messsage":{"data":null,"isBoom":true,"output":{"statusCode":403,"payload":{"statusCode":403,"error":"Forbidden","message":"Path `title` is required. Path `school` is required. "},"headers":{}}},"provider":"1003015736"},{"messsage":{"data":null,"isBoom":true,"output":{"statusCode":403,"payload":{"statusCode":403,"error":"Forbidden","message":"Path `school` is required. "},"headers":{}}},"provider":"1003016023"},{"messsage":{"data":null,"isBoom":true,"output":{"statusCode":403,"payload":{"statusCode":403,"error":"Forbidden","message":"Path `title` is required. Path `school` is required. "},"headers":{}}},"provider":"1003016007"},{"messsage":{"data":null,"isBoom":true,"output":{"statusCode":403,"payload":{"statusCode":403,"error":"Forbidden","message":"Path `title` is required. Path `school` is required. "},"headers":{}}},"provider":"1003016007"},{"messsage":{"data":null,"isBoom":true,"output":{"statusCode":403,"payload":{"statusCode":403,"error":"Forbidden","message":"Path `title` is required. "},"headers":{}}},"provider":"1003018177"},{"messsage":{"data":null,"isBoom":true,"output":{"statusCode":403,"payload":{"statusCode":403,"error":"Forbidden","message":"Path `school` is required. "},"headers":{}}},"provider":"1003016023"},{"messsage":{"data":null,"isBoom":true,"output":{"statusCode":403,"payload":{"statusCode":403,"error":"Forbidden","message":"Path `school` is required. "},"headers":{}}},"provider":"1003016023"},{"messsage":{"data":null,"isBoom":true,"output":{"statusCode":403,"payload":{"statusCode":403,"error":"Forbidden","message":"Path `title` is required. "},"headers":{}}},"provider":"1003018177"},{"messsage":{"data":null,"isBoom":true,"output":{"statusCode":403,"payload":{"statusCode":403,"error":"Forbidden","message":"Path `title` is required. "},"headers":{}}},"provider":"1003018177"}]}
	             .success(function(data, status, headers, config) {
	              console.log(data);
	              $scope.dumpfile = data.dumpProvider;
	              $scope.processValue = undefined;
	              $scope.gettedserverResponce = true;

	            }).error(function(data, status, headers, config) {
	            	// $scope.gettedserverResponce = true;
	            	$scope.processValue = undefined;
	              	console.log(data);
	              	$scope.errorMsgToUserepub = data.message;
	      				$scope.errorOccur= true;
	              	if(!data.message){
	              		$scope.errorMsgToUserepub = "Error occur in server side try again"
	      				$scope.errorOccur= true;
	              	}

	              	
	             });

      
   		 }	

    }
});

