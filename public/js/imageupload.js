mdtreeApp.controller('imageupload', function ($scope, $http,$location,$upload,fileReader) {
    $scope.getFile = function () {
      
        $scope.progress = 0;
        fileReader.readAsDataUrl($scope.file, $scope)
                      .then(function(result) {
                          $scope.imageSrc = result;
                      });
    };
 
    $scope.$on("fileProgress", function(e, progress) {
        $scope.progress = progress.loaded / progress.total;
    });
 


 $scope.onFileSelect = function($files) {
    for (var i = 0; i < $files.length; i++) {
      $scope.file = $files[i];
      console.log($scope.file);
   
      //.error(...)
      //.then(success, error, progress); 
      // access or attach event listeners to the underlying XMLHttpRequest.
      //.xhr(function(xhr){xhr.upload.addEventListener(...)})
    }
    /* alternative way of uploading, send the file binary with the file's content-type.
       Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed. 
       It could also be used to monitor the progress of a normal http post/put request with large data*/
    // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
  };
     $scope.upload = function(){ 
      var email="user@user.com";
      $upload.upload({

        url: '/v1/imageupload', //upload.php script, node.js route, or servlet url
        method: 'PUT',
        //headers: {'header-key': 'header-value'},
        //withCredentials: true,
        
        data: {imageFile: $scope.file,email:email}
        // imageFile: $scope.file, // or list of files ($files) for html5 only
        //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
        // customize file formData name ('Content-Disposition'), server side file variable name. 
        //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file' 
        // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
        //formDataAppender: function(formData, key, val){}
      }).progress(function(evt) {
        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      })
      .success(function(data, status, headers, config) {
        // file is uploaded successfully
        console.log(data);
      }).error(function(data, status, headers, config) {
        console.log(data);
                // var msg = data.message;
               //  var type = "danger";
               //  // $timeout(function(){
               //  //         $scope.alerts.splice(0, 1);
               //  //  }, 3000);
               //  $scope.alerts =[];
               //  $scope.alerts.push({msg: msg,type: type});
        }); 
    }
});


mdtreeApp.directive("ngFileSelect",function(){

  return {
    link: function($scope,el){
      
      el.bind("change", function(e){
        
        $scope.file = (e.srcElement || e.target).files[0];
        console.log($scope.file);
        $scope.getFile($scope.file);
      })
      
    }
    
  }
});

