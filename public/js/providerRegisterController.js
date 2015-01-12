
mdtreeApp.controller('providerController', function providerController( $q, $scope,$state,productService,SelectValueService,$http,$timeout,$upload,fileReader,$location){
    
    $scope.locations    =[];
    $scope.selected = false;
    $scope.categories= {};
     $scope.$watch(function () { return $scope.form.plan}, function (data) { 
            if($scope.form.plan == "Free"){
                $scope.planhide=true;
            }else{$scope.planhide=false; }
            //return true or false
    });
     
    $scope.boolChangeClass == true;
     $scope.categories.options = SelectValueService.getCategoryJson();
        
    $scope.specialty= {};
    $scope.displayTermMessage = function(){
      $scope.DisplayTermMessageError ="You must read and accept the Terms & Conditions before submitting the details. "
    }
    $scope.functionCallForMultiSelect = function  () {
      $scope.languageField = "language Field is Required";
      $scope.insuranceField = "insurance Field is Required";
    }
    $scope.setGender = function  (value) {
        if(value=== 'male'){
          $scope.form.gender = 'male';
          $scope.boolChangeClass = false;
        }
        else{
          $scope.form.gender = 'female';
          $scope.boolChangeClass = true;
        }
    }
    $scope.specialty= {};
    $scope.specialty.options = SelectValueService.getDoctorsJson();
    $scope.dentistslists= {};
    $scope.dentistslists.options = SelectValueService.getdentistslists();
    $scope.chiropractors= {};
    $scope.chiropractors.options = SelectValueService.getchiropractors();
    $scope.Vision= {};
    $scope.Vision.options = SelectValueService.getvision();
    
    $scope.otherSpeciality = {};
    $scope.otherSpeciality.options = SelectValueService.getotherSpeciality();
    $scope.title= {};

    $scope.title.options = SelectValueService.gettitleJson();
    $scope.questions ={};

    $scope.questions.options = SelectValueService.getQusTypeJson(); 
    $scope.cashprice ={};

    $scope.cashprice.options = SelectValueService.getcashPriceJson(); 
    $scope.form = {};
    $scope.form.cash = "NoAble";
    $scope.offer ={};
    $scope.CheckEmailAddrress = function(mailId){
      var geturl = '/v1/checkEmail?email='+$scope.form.email;
      console.log(geturl);
      $http.get(geturl).success(function(data){  
                console.log(data);
                if(data.exist){
                  console.log(data);
                  $scope.errorMailAlready = "This email id already registerd with us"
                }else{
                  $scope.errorMailAlready = "";
                }

            }).error(function(data, status, headers, config) {
              console.log(data);
              $scope.errorMailAlready = "";
                // var msg = data.message;
                // var type = "danger";
                // $timeout(function(){
                //         $scope.alerts.splice(0, 1);
                //  }, 3000);
                // $scope.alerts =[];
                // $scope.alerts.push({msg: msg,type: type});
        }); 
    }
    $scope.offer.options = SelectValueService.getOfferJson();
     $scope.add = function (newValue) {
        var obj = {};
        obj.id = newValue;
        obj.key = newValue;
        console.log(obj)
        $scope.offer.options.push(obj);
        // $scope.group.name = obj;
        $scope.form.offer = obj.key;
    }

    

    $scope.state ={};

    $scope.state.options = SelectValueService.getStateJson();
    $scope.languages ={};

    $scope.languages.options = SelectValueService.getLangJson();
    $scope.plan ={};

    $scope.plan.options = SelectValueService.getplanType();
    $scope.insurance ={};

    $scope.BillingInterval ={};

    $scope.BillingInterval.options = [{id:"Monthly"},{id:"Quarterly"},{id:"Semi-Annually"},{id:"Annually"}];
    $scope.payment ={};
    $scope.payment.options = [{id:"ACH"},{id:"BCH"},{id:"HDFC"},{id:"ICICI"},{id:"Credit Card"}];
    $scope.ExistingAddress ={};
    $scope.ExistingAddress.options = [{id:"Location 1"},{id:"Location 2"},{id:"Location 3"},{id:"Location 4"}];
    $scope.Month ={};
    $scope.Month.options = [{id:"01"},{id:"02"},{id:"03"},{id:"04"},{id:"05"},{id:"06"},{id:"07"},{id:"08"},{id:"09"},{id:"10"},{id:"11"},{id:"12"}];
    $scope.Year ={};
    $scope.Year.options = [{id:"2014"},{id:"2015"},{id:"2016"},{id:"2017"},{id:"2018"},{id:"2019"},{id:"2020"},{id:"2021"},{id:"2022"},{id:"2023"},{id:"2024"},{id:"2025"}];
    $scope.insurance.options = SelectValueService.getinsuranceJson();
    $scope.form={};
    $scope.form.location =$scope.locations=[];

    $scope.locations.push({practiceName:"",address:"",state:"",city:"",zip:"",phone1:"",phone2:"",fax:""}); 
//calender
    
    $scope.today = function() {
        $scope.dob = new Date();
      };
      $scope.today();

      $scope.clear = function () {
        $scope.dob = null;
      };

      // Disable weekend selection
      // $scope.disabled = function(date, mode) {
      //   return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
      // };

      // $scope.toggleMin = function() {
      //   $scope.minDate = $scope.minDate ? null : new Date();
      // };
      // $scope.toggleMin();

      // $scope.open = function($event) {
      //   $event.preventDefault();
      //   $event.stopPropagation();
      //   $scope.opened = true;
      // };


      // $scope.dateOptions = {
      //   formatYear: 'yy',
      //   startingDay: 1
      // };
      // $scope.selected = false;
      // $scope.initDate = new Date('2016-15-20');
      // $scope.format = 'MM-dd-yyyy';
// end of calender

    $scope.deleteclinic = function(item){
        // $scope.locations.pop($index); 
        $scope.locations.splice(item,1);
        $scope.addclinicShow = $scope.locations.length -1;
        console.log($scope.addclinicShow );
    }
    $scope.addclinicShow = 0;
    $scope.addclinic = function(){
        $scope.locations.push({practiceName:"",address:"",state:"",City:"",zip:"",phone1:"",phone2:"",fax:""}); 
        $scope.addclinicShow = $scope.locations.length -1;
        console.log($scope.addclinicShow );
    }
    $scope.getFile = function (file) {
        $scope.progress = 0;
        fileReader.readAsDataUrl(file, $scope)
                      .then(function(result) {
                          $scope.imageSrc = result;
                      });
    };
 
    $scope.$on("fileProgress", function(e, progress) {
        $scope.progress = progress.loaded / progress.total;
    });
 

    $scope.file = "";
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

        // $upload.upload({

        //   url: '/v1/imageupload', //upload.php script, node.js route, or servlet url
        //   method: 'PUT',
        //   //headers: {'header-key': 'header-value'},
        //   //withCredentials: true,
        //   data: {imageFile: $scope.file},
        //   imageFile: $scope.file, // or list of files ($files) for html5 only
        //   //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
        //   // customize file formData name ('Content-Disposition'), server side file variable name. 
        //   //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file' 
        //   // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
        //   //formDataAppender: function(formData, key, val){}
        // }).progress(function(evt) {
        //   console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
        // })
        // .success(function(data, status, headers, config) {
        //   // file is uploaded successfully
        //   console.log(data);
        // }).error(function(data, status, headers, config) {
        //   console.log(data);
        //           // var msg = data.message;
        //          //  var type = "danger";
        //          //  // $timeout(function(){
        //          //  //         $scope.alerts.splice(0, 1);
        //          //  //  }, 3000);
        //          //  $scope.alerts =[];
        //          //  $scope.alerts.push({msg: msg,type: type});
        //   }); 
      // $scope.date = $scope.form.dob.getDate();
      // $scope.getmonth = $scope.form.dob.getMonth();
      // $scope.year = $scope.form.dob.getFullYear();

      $scope.submitform = function(){
          // $scope.form.image = "images/doctor.jpeg";
          console.log($scope.boolChangeClass);

          if($scope.boolChangeClass == undefined ){
              $scope.form.gender = "male";
          }
          if($scope.webSite){
            $scope.form.webSite = $scope.webSite;
          }
          console.log($scope.form);
          console.log($scope.form.dob);
          // $scope.form.imageFile = $scope.file;
          // console.log($scope.form.imageFile);

          // var formatDate = "";
          // if ($scope.form.dob.getMonth()<9) {
          //   formatDate +=  "0" + ($scope.form.dob.getMonth()+1);
          // } else {
          //   formatDate +=  ($scope.form.dob.getMonth()+1);
          // }
          // if ($scope.form.dob.getDate() < 10) {
          //   formatDate += "-" + "0" + $scope.form.dob.getDate();
          // } else {
          //   formatDate += "-" + $scope.form.dob.getDate();
          // }
          
          // formatDate += "-" + $scope.form.dob.getFullYear();

          // $scope.form.dob = formatDate
          console.log($scope.form);
          $upload.upload({
          
          url: '/v1/provider/register', //upload.php script, node.js route, or servlet url
          method: 'POST',
          data: $scope.form
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
          console.log($scope.form.email)
          if($scope.file != undefined){
            $upload.upload({
          
              url: '/v1/imageupload', //upload.php script, node.js route, or servlet url
              method: 'PUT',
              data: {imageFile: $scope.file,email:$scope.form.email}
              // imageFile: $scope.file,
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
              console.log(data);

              $state.transitionTo("salesAdmin.dashboard.providerinfo.newprovider.step4",{
                },{
                  reload: true,
                  notify: true
              });
        
              console.log(data);
            }).error(function(data, status, headers, config) {
              console.log(data);
             });


          }
          
          $state.transitionTo("salesAdmin.dashboard.providerinfo.newprovider.step4",{
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

        // $http.post('/v1/provider/register', $scope.form).success(function(data){  
        //         console.log(data);
        //     $state.transitionTo("anon.provider-registration.step4",{
        //       },{
        //         reload: true,
        //         notify: true
        //     });

        //     }).error(function(data, status, headers, config) {
        //       console.log(data);
        //         var msg = data.message;
        //         var type = "danger";
        //         $timeout(function(){
        //                 $scope.alerts.splice(0, 1);
        //          }, 3000);
        //         $scope.alerts =[];
        //         $scope.alerts.push({msg: msg,type: type});
        // }); 

    }

 $scope.defaultItems = [
        "1", "4"
    ];
    $scope.listOfItems = {
        1: 'Apples',
        2: 'Oranges',
        3: 'Peaches',
        4: 'Bananas',
        5: 'Lemons'
    }

      var simulateAjax;

      simulateAjax = function(result) {
        var deferred, fn;

        deferred = $q.defer();
        fn = function() {
          return deferred.resolve(result);
        };
        $timeout(fn, 3000);
        return deferred.promise;
      };
      simulateAjax(['grooo', 'wowowowow', 'lakakalakakl', 'yadayada', 'insight', 'delve', 'synergy']).then(function(result) {
        return $scope.optionsFromQuery = result;
      });
      $scope.optionsFromQueryAsHash = (function() {
        var result;

        result = {
          win: "Brilliant Escape",
          fail: "Untimely Demise"
        };
        return simulateAjax(result);
      })();
      $scope.$watch('emptyCollection', function(empty) {
        return $scope.emptyOptions = simulateAjax(empty ? [] : ['look', 'i', 'have', 'data']);
      });
      $scope.directiveOptions = {
        no_results_text: "SO SORRY"
      };
      $scope.myPets = ['cat'];
      $scope.langua = {English:"English",Spanish:"Spanish",French:"French",Hindi:"Hindi",Chinese:"Chinese"
        ,German:"German",Italian:"Italian",Japanese:"Japanese",Korean:"Korean"};
        
      $timeout(function() {
        return $scope.$apply(function() {
          return $scope.myPets.push('hamster');
        });
      }, 1000);
      return $scope.disabled = true;




});
  


 
  


