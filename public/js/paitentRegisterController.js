
mdtreeApp.controller('patientreg', function patientreg($scope,$state,productService,SelectValueService,$http,$timeout,Auth){
    $scope.questions= {};

    $scope.boolChangeClass = false;
    $scope.questions ={};
    $scope.questions.options = SelectValueService.getQusTypeJson();
    $scope.questions.select = "What was the name of your high school?";
    $scope.gender = 'male';
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
    $scope.CheckEmailAddrress = function(mailId){
      var geturl = '/v1/checkEmail?email='+mailId;
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
    $scope.submitform = function(processWay){
        console.log($scope.boolChangeClass);
        if($scope.boolChangeClass ==undefined){
            $scope.gender  = "male";
        }
        console.log($scope.gender);
        var userdetails ={firstName:$scope.firstName,lastName:$scope.lastName,zipCode:$scope.zipCode,gender:$scope.gender ,dob:$scope.dob,email:$scope.email,phone:$scope.phone,password:$scope.password,question:$scope.questions.select,answer:$scope.answer};
        console.log(userdetails);
        Auth.register(userdetails,
            function(res) {
              productService.addusertypevalue(res.user);
              if(processWay){
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
                $state.transitionTo("user.appointment-verify",{
                  },{
                    reload: true,
                    notify: true
                });
               
              }
              else{
                $state.transitionTo("user.patient-registration2",{
                  },{
                    reload: true,
                    notify: true
                });
              }
             
                
            },
            function(err) {
              console.log(err);
                var msg = err.message;
                var type = "danger";
                $timeout(function(){
                    $scope.alerts.splice(0, 1);
                }, 5000);
                $scope.alerts =[];
                $scope.alerts.push({msg: msg,type: type});
            });
        };
        
    $scope.displayTermMessage = function(){
      $scope.DisplayTermMessageError ="You must read and accept the Terms & Conditions before submitting the details. "
    }
    $scope.selected = true;
    
      // // $scope.today = function() {
      // //   $scope.dob = new Date();
      // // };
      // $scope.today();

      $scope.clear = function () {
        $scope.dob = null;
      };

      // Disable weekend selection
      $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
      };

      $scope.toggleMin = function() {
        $scope.minDate = $scope.minDate ? null : new Date();
      };
      $scope.toggleMin();

      $scope.open = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
      };


      $scope.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
      };

      $scope.initDate = new Date('2016-15-20');
      $scope.formats = ['MM-dd-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      $scope.format = $scope.formats[0];


});

