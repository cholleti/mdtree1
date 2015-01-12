
mdtreeApp.controller('providerDashboardController',
 	function providerDashboardController($scope,productService,$state,$http,Auth,SelectValueService,$timeout,$stateParams) {
        var successMessage = productService.gettemppublisheremail();
        if(successMessage){
                var msg = successMessage;
                  var type = "success";
                  $timeout(function(){
                    $scope.alerts.splice(0, 1);
                    }, 5000);
                  $scope.alerts =[];
                  $scope.alerts.push({msg:msg,type: type});

        }
    $scope.formMethod ={};
    $scope.clear = function () {
        $scope.dob = null;
      };
      $scope.dateTimeNow = function() {
        $scope.startingDateValue = new Date();
        
      };
      $scope.dateTimeNow();

    $scope.formData ={};
    $scope.datepickers = {
        dt: false,
        dtSecond: false,
        
    }


    $scope.calculateValue = [];
    $scope.clickeventOccurinWeeklyView = function(three,two){
        if($scope.weeklyArray[two].slots[three].calculateValue == true){
            $scope.weeklyArray[two].slots[three].calculateValue = false;
        }else{
            for(i =0 ; i < $scope.weeklyArray.length;i++){
                for(j=0;j < $scope.weeklyArray[i].slots.length;j++ ){
                    $scope.weeklyArray[i].slots[j].calculateValue = false;
                }
            }
            $scope.weeklyArray[two].slots[three].calculateValue = true;
        }
        
    }
    $scope.alreadyCreatedSlots = function(){
        $http.get('/v1/slottedDate?email='+Auth.user.email)
            .success(function(data, status, headers, config) {
                
                // console.log("slottedDate",data.slotCreatedDates);
                var valueodData = data.slotCreatedDates;
                $scope.dateArrayCreated = valueodData;
               // $scope.dateArrayCreated = data.slot.slots;
               
            })
            .error(function(data, status, headers, config) {
                console.log(data);
        });
    }
    $scope.alreadyCreatedSlots();
    $scope.showWeeks = true;
    $scope.toggleWeeks = function () {
        $scope.showWeeks = ! $scope.showWeeks;
    };

    $scope.clear = function () {
        $scope.dt = null;
    };

      // Disable weekend selection
      $scope.disabled = function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
      };

      

      $scope.open = function($event, which) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.datepickers[which]= true;

      };

      $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1
      };

     
      $scope.format = 'MM-dd-yyyy';

    $scope.desicionValue = false;
    $scope.changeClassCreate = function(){
        $scope.desicionValue = false;
        $scope.inputArray =[];
        $scope.locationarrayIndexValue = [];
        
    }
    $scope.changeClassModify = function(locid){
        $scope.desicionValue = true;
        $scope.today();
        $scope.changeLocation(locid);

    }

    $scope.firstminDate = new Date();

    $scope.changeLocation = function(locid,date){
        console.log(date);
        if($scope.desicionValue == false){
            if( date == undefined){
                $scope.minDate =  new Date();
                $scope.firstminDate = new Date();
            }else{
                $scope.minDate =  new Date(date);
                $scope.formData.dtSecond = new Date(date);
                $scope.firstminDate = new Date();
            }
            
        }else{
            $scope.selectedDates = [];
            $scope.selectedDate = true;
            $scope.inputArray =[];
            $scope.locationarrayIndexValue = [];
            if($scope.desicionValue){
                // $scope.valueselece = $scope.calenderDateFormat($scope.startdate);
                if(date == undefined){
                    var url = "/v1/getslot?email=" + $scope.user.email +"&view=daily&locId="+locid;
                    
                }else{
                    
                    var url = "/v1/getslot?email=" + $scope.user.email +"&view=daily&locId="+locid+"&date="+date;
                }
                
                $scope.valuelength  = [];
                for( i = 0 ; i < $scope.locationArrayValue.length;i++){
                    console.log($scope.locationArrayValue);
                    $scope.valuelength.push($scope.locationArrayValue[i].locId);
                }
                console.log(locid);
                $scope.locationCalculate = ((($scope.valuelength).indexOf(locid))+1);
                 console.log($scope.locationCalculate);
                $http.get(url)
                    .success(function(data, status, headers, config) {
                        console.log(data);
                        // console.log(data,"changeLocation")
                        // $scope.loctaions = data.providerLocations;
                       $scope.inputArray = data.slot.slots;
                       $scope.locationarrayIndexValue = [];
                        // console.log($scope.dailyViewdata);
                        for(i=0;i < data.slot.slots.length ; i++ ){
                            $scope.locationarrayIndexValue.push($scope.locationCalculate);
                        }
                    })
                    .error(function(data, status, headers, config) {
                        console.log(data);
                });
            }
        }
    }
    $scope.indexValue = 0;
    $scope.nextslots = function(value){
           // console.log($scope.bookingdate); 
           
           
           
           if (value == 'prev'){
               
                $scope.indexValue = $scope.indexValue - 1; 
           }
           else{
               
                $scope.indexValue = $scope.indexValue + 1; 
           }
            console.log("$scope.currentDate",$scope.currentDate)
            $scope.weeklyView($scope.indexValue,$scope.currentDate);
        }
     $scope.nextslotsschedule = function(value){
       // console.log($scope.bookingdate); 
       
       
       
       if (value == 'prev'){
           
            $scope.indexValue = $scope.indexValue - 1; 
       }
       else{
           
            $scope.indexValue = $scope.indexValue + 1; 
       }
        
        $scope.scheduleExisting($scope.indexValue);
    }
    $scope.weeklyView = function(indexValue,date) {
        // console.log(($state.includes('user.provider-dashboard.step3')));
        //     console.log(($state.includes('user.provider-dashboard.step1')));
        //         console.log(($state.includes('user.provider-dashboard.step2')));
        //             console.log(($state.includes('user.provider-dashboard.step3')));
        // console.log($state.includes('user.provider-dashboard.step2'));
    // console.log("weeklyView");
        //localhost:8000/v1/getslot?email=dheeraj@gmail.com&view=weekly&locId=dheeraj@gmail.com1&date=09-17-2014&startindex=1
        console.log(date);
        if (indexValue ==  undefined){
            $scope.indexValue = 0;
            var url = "/v1/getslot?email=" + $scope.user.email +"&view=weekly&locId="+$scope.loctaions.locId;

        }else{
            if(date == undefined){
               var url = "/v1/getslot?email=" + $scope.user.email +"&view=weekly&locId="+$scope.loctaions.locId+"&startindex="+indexValue+"&date="+$scope.currentDate; 
           }else{
                var url = "/v1/getslot?email=" + $scope.user.email +"&view=weekly&locId="+$scope.loctaions.locId+"&startindex="+indexValue+"&date="+date; 
           }
             
            
            

        }
        console.log(url);
        $http.get(url)
            .success(function(data, status, headers, config) {
               $scope.weeklyArray = data.slots;
                console.log(data);
                for(var i=0;i < data.slots.length ; i++ ){
                    console.log(data.slots[i].slots.length);
                    for(var j=0;j < data.slots[i].slots.length ; j++ ){
                        if(data.slots[i].slots[j].status === 'booked'){
                            if(data.slots[i].slots[j].patient.insurance){
                                var Selectedinsurance =  _.findWhere($scope.insurance.options, {key:data.slots[i].slots[j].patient.insurance}) ;
                                console.log(Selectedinsurance);
                                $scope.weeklyArray[i].slots[j].patient.insurance = Selectedinsurance.value;
                            }
                             
                            // $scope.weeklyArray[i].slots[j].patient.insurance = Selectedinsurance.value;
                        }
                    }
                    // if(data.slot.slots[i].status == 'booked'){
                    //     var Selectedinsurance =  _.findWhere($scope.insurance.options, {key:data.slot.slots[i].patient.insurance}) ;
                    //     $scope.dailyViewdata.slot.slots[i].patient.insurance = Selectedinsurance.value;
                    // }
                }
                
            })
            .error(function(data, status, headers, config) {
                console.log(data);
        });
        
    }
    $scope.scheduleExisting = function(indexValue) {
        // console.log(($state.includes('user.provider-dashboard.step3')));
        //     console.log(($state.includes('user.provider-dashboard.step1')));
        //         console.log(($state.includes('user.provider-dashboard.step2')));
        //             console.log(($state.includes('user.provider-dashboard.step3')));
        // console.log($state.includes('user.provider-dashboard.step2'));
    // console.log("weeklyView");
        //localhost:8000/v1/getslot?email=dheeraj@gmail.com&view=weekly&locId=dheeraj@gmail.com1&date=09-17-2014&startindex=1

        if (indexValue ==  undefined){
            $scope.indexValue = 0;
            var url = "/v1/getslot?email=" + $scope.user.email +"&view=schedule&locId="+$scope.loctaions.locId;

        }else{
            
            
            var url = "/v1/getslot?email=" + $scope.user.email +"&view=schedule&locId="+$scope.loctaions.locId+"&startindex="+indexValue;
            
            

        }
        console.log(url);
        $http.get(url)
            .success(function(data, status, headers, config) {
               $scope.weeklyArray = data.slots;
                console.log(data);
                
            })
            .error(function(data, status, headers, config) {
                console.log(data);
        });
        
    }
    $scope.updateTimeSlot =  function(){
        if($scope.verify()){
            // var dateFormat = $scope.calenderDateFormat($scope.currentDate);
            var value = {date:$scope.currentDate,slots:$scope.inputArray,email:Auth.user.email,locId:$scope.loctaions.locId}
            console.log(value);
            $http.put('/v1/modifyslots' ,value)
                .success(function(data, status, headers, config) {
                    // $scope.loctaions = data.providerLocations;

                    var msg = data;
                      var type = "success";
                      $timeout(function(){
                              $scope.alerts.splice(0, 1);
                       }, 5000);
                      $scope.alerts =[];
                      $scope.alerts.push({msg:"Updated  Slots",type: type});
                      $scope.inputArray =[];
                      $scope.locationarrayIndexValue = [];
                      $scope.desicionValue = false;
                      $scope.dailyViewLocation($scope.loctaions.locId,$scope.currentDate);
                    console.log(data);
                })
                .error(function(data, status, headers, config) {
                    var msg = data.message;
                      var type = "danger";
                      $timeout(function(){
                              $scope.alerts.splice(0, 1);
                       }, 5000);
                      $scope.alerts =[];
                      $scope.alerts.push({msg: msg,type: type});
                    console.log(data);
            });
        }
    }
 	$scope.user = Auth.user;
    // console.log($scope.user);
    $scope.locationArrayValue = [];
    $scope.multiloctaions = [];
 	$scope.variablevalue = "ndaily";
    $http.get('v1/provider?email=' +$scope.user.email+'&type=alllocation')
        .success(function(data, status, headers, config) {
            $scope.loctaions = data.providerLocations;
            $scope.loctaions.locId = $scope.loctaions[0].locId;
            console.log($scope.loctaions);
            $scope.locationArrayValue = data.providerLocations;
            // console.log("["+$scope.loctaions.locId+"]");

            $scope.multiloctaions.push($scope.loctaions.locId); 
            // console.log($scope.multiloctaions);
            
        })
        .error(function(data, status, headers, config) {
            console.log(data);
    });
    
    

 	$scope.dailyView = function(){
 		$scope.variablevalue = "ndaily";
        $scope.inputArray =[];
        $scope.alerts =[];
        $scope.locationarrayIndexValue = [];
        $scope.desicionValue = false;
 	}
 	$scope.nweekly = function(){
 		$scope.variablevalue = "nweekly";
        $scope.inputArray =[];
        $scope.alerts =[];
        $scope.locationarrayIndexValue = [];
        $scope.desicionValue = false;
 	}
 	$scope.ncreate = function(){
 		$scope.variablevalue = "ncreate";
        $scope.inputArray =[];
        $scope.alerts =[];
        $scope.locationarrayIndexValue = [];
        $scope.formData.dt = "";
        $scope.formData.dtSecond = "";
        $scope.fromtiming.value = null;
        $scope.totiming.value = null;
        $scope.interval.value = null;
        $scope.changeClassCreate();
        $scope.changeLocation($scope.loctaions.locId);
        $scope.desicionValue = false;
        $scope.inputArray =[];
        $scope.selectedDates = [];
        // console.log($scope.inputArray);

 	}
 	$scope.noffers = function(){
 		$scope.variablevalue = "noffers";
        $scope.inputArray =[];
        $scope.alerts =[];
        $scope.locationarrayIndexValue = [];
        $scope.desicionValue = false;
 	}
 	$scope.nexisting = function(){
 		$scope.variablevalue = "nexisting";
        $scope.inputArray =[];
        $scope.alerts =[];
        $scope.locationarrayIndexValue = [];
        $scope.desicionValue = false;
 	}

    $scope.holidays = [{day:"New Year's Day",date:"01-01"},{day:"Martin Luther King Day",date:"01-20"},{day:"Presidents' Day (Washington's Birthday)",date:"02-17"},
                {day:"Memorial Day",date:"05-26"},{day:"Independence Day",date:"07-04"},{day:"Labor Day",date:"09-01"},{day:"Columbus Day",date:"10-13"},{day:"Veterans Day",date:"11-11"},
                {day:"Thanksgiving Day",date:"11-27"},{day:"Christmas Day",date:"12-25"}];
    $scope.userdays={};
    $scope.users={"userdays":"0111110"};;

    for (var i=0;i<$scope.users.userdays.length;i++)
    { 
        $scope.userdays[i] = !!parseInt($scope.users.userdays[i]);

    }
          
    $scope.days=[{id:0, day:'Sun'},{id:1, day: 'Mon'},{id:2, day: 'Tues'},{id:3, day: 'Wed'},{id:4, day: 'Thu'}, {id:5, day: 'Fri'}, {id:6, day:'Sat'}];
    console.log($scope.userdays);
    $scope.fromtiming = {};
    $scope.fromtiming.options = ["00:00AM","00:30AM","01:00AM","01:30AM","02:00AM","02:30AM","03:00AM","03:30AM","04:00AM","04:30AM",
                                "05:00AM","05:30AM","06:00AM","06:30AM","07:00AM","07:30AM","08:00AM","08:30AM","09:00AM","09:30AM",
                                "10:00AM","10:30AM",
                                "11:00AM","11:30AM","12:00PM","12:30PM","01:00PM","01:30PM","02:00PM","02:30PM",
                                "03:00PM","03:30PM","04:00PM","04:30PM",
                                "05:00PM","05:30PM","06:00PM","06:30PM","07:00PM","07:30PM","08:00PM","08:30PM",
                                "09:00PM","09:30PM","10:00PM","10:30PM",
                                "11:00PM","11:30PM"];
    $scope.createofslots = {};
    $scope.createofslots.options = [{id:"Create Slots",isbn:"create"},{id:"Modify Slots",isbn:"modify"}]
    $scope.weeklyViewdayheader = [{day:"Wednesday",date:"7/14"},{day:"Thursday",date:"7/15"},{day:"Friday",date:"7/16"},
                                  {day:"Saturday",date:"7/17"},{day:"Sunday",date:"7/18"},{day:"Monday",date:"7/19"},
                                  {day:"Tuesday",date:"7/20"}]
    $scope.interval = {};
    $scope.interval.options = [{min:10},{min:15},{min:20},{min:30},{min:60},{min:90}]
    $scope.reason = {};
    $scope.reason.options = [{reason:"We could not verify your insurance"},{reason:"The provider is unavailable"},
    {reason:"The chosen time is now unavailable"},{reason:"Other reason"}]
 	//calender
    $scope.totiming = [];
    $scope.report = function(fromtime){
        $scope.totiming = [];
        $scope.timingcalculate = ($scope.fromtiming.options).indexOf(fromtime);
        if(($scope.timingcalculate+1)  == $scope.fromtiming.options.length){
            $scope.totiming.push($scope.fromtiming.options[0])
        }
        if(($scope.timingcalculate +1 )!= $scope.fromtiming.options.length){
            for(i = $scope.timingcalculate+1; i<$scope.fromtiming.options.length; i++ ){
                $scope.totiming.push($scope.fromtiming.options[i])
            }
            // console.log($scope.totiming);
        }
    }

    $scope.selectedDates = [];
    $scope.fromarray =[];
    $scope.toarray =[];
    $scope.locationArray =[];
    $scope.inputArray =[];
    $scope.locationArrayValues = [];
    $scope.locationarrayIndexValue =[];
    $scope.inputedit =[];
    $scope.fromtiming.value =$scope.locationArrayValue[0];
    // console.log($state.includes('user.provider-dashboard.step2'));

    // $scope.$watch(function () {$scope.selectedDate}, function (selectedDate) { 
    //     $scope.formatDate = "";
    //     if (selectedDate.getMonth()<9) {
    //         $scope.formatDate += "0" + (selectedDate.getMonth()+1);
    //       } else {
    //         $scope.formatDate += (selectedDate.getMonth()+1);
    //       } 
    //       if (selectedDate.getDate() < 10) {
    //         $scope.formatDate += "-" + "0" + selectedDate.getDate();
    //       } else {
    //         $scope.formatDate += ("-" + selectedDate.getDate());
    //       }
          
    //       $scope.formatDate += "-" + selectedDate.getFullYear();

    //       console.log($scope.formatDate);
    // });
    $scope.calenderDateFormat = function(currentDate){
        var formatDate = "";
        if (currentDate.getMonth()<9) {
            formatDate += "0" + (currentDate.getMonth()+1);
          } else {
            formatDate += (currentDate.getMonth()+1);
          } 
          if (currentDate.getDate() < 10) {
            formatDate += "-" + "0" + currentDate.getDate();
          } else {
            formatDate += ("-" + currentDate.getDate());
          }
          
          formatDate += "-" + currentDate.getFullYear();

          // console.log(formatDate);
          return formatDate;
    }   
    $scope.selectedDatesInCalender = function(currentDate){
        $scope.selectedDatesInCalenderFormat = new Date(currentDate);
        // console.log(selectedDatesInCalenderFormat);
        var formatDate = "";
        if (currentDate.getMonth()<9) {
            formatDate += "0" + (currentDate.getMonth()+1);
          } else {
            formatDate += (currentDate.getMonth()+1);
          } 
          if (currentDate.getDate() < 10) {
            formatDate += "-" + "0" + currentDate.getDate();
          } else {
            formatDate += ("-" + currentDate.getDate());
          }
          
          formatDate += "-" + currentDate.getFullYear();

          // console.log(formatDate);

        if($state.includes('user.provider-dashboard.step1')){
            // console.log(formatDate)
            $scope.dailyViewLocation($scope.loctaions.locId,formatDate);
             
        }
        if($state.includes('user.provider-dashboard.step3')){
            $scope.showbutton = true;
           
            $scope.selectedDates.push(formatDate);

            // console.log($scope.selectedDates);
        }
    }

    //this one is dynamically generated link using ng-repeat
    $scope.removeDate = function (item){
        $scope.selectedDates.splice(item,1);
    }
    $scope.remove = function (item) {
        $scope.inputArray.splice(item, 1);
        // $scope.retrieveddata.splice(item, 1);
        $scope.locationarrayIndexValue.splice(item,1);
    }
    $scope.edittime = function($index){
        for(var i =0; i< $scope.inputedit.length; i++){
            $scope.inputedit[i]=false;
        }
        $scope.inputedit[$index] = true;
        $scope.inputedit[$index] = true;
    }
    
    // $scope.formData.dt = $scope.selectedDatesInCalender(new Date());
    $scope.$watch('formData.dt',function(){
        $scope.formData.dtSecond = $scope.formData.dt;
       

    });
    // $scope.$watch('form.startDate',function(){
    //     alert("hi")
    //     $scope.form.endDate = $scope.form.startDate;
    // });
   
    $scope.$watch('formData.dtSecond',function  (dtSecond) {
        $scope.DateArrayCreate();
    });
    
    $scope.changeDateFunction = function(){
        $scope.DateArrayCreate();
    }
        
    
    $scope.$watch('holidays.us',function  (dtSecond) {
        $scope.DateArrayCreate();
    });
        // alert("formData.dtSecond",$scope.formData.dtSecond);
        // console.log($scope.formData.dtSecond);
        // console.log($scope.formData.dt);
        // console.log( $scope.dateArrayCreated );
    $scope.DateArrayCreate = function(){
        var firstdate = $scope.formData.dt;
        var seconddate = $scope.formData.dtSecond;
        console.log(firstdate);

        console.log(seconddate);
        // $scope.formtiming24hour = $scope.convertTo24Hour($scope.fromtiming.value);
        // $scope.totiming24hour = $scope.convertTo24Hour($scope.totiming.value);
        // $scope.formtiming24hour = $scope.parseTime($scope.fromtiming.value);
        // console.log($scope.formtiming24hour);
        // $scope.minutes = $scope.formatTime($scope.formtiming24hour.hour,$scope.formtiming24hour.minute);
        // console.log($scope.minutes);
        // var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
        var minutes = 1000*60;
        var hours = minutes*60;
        var days = hours*24;

        var foo_date1 = getDateFromFormat(firstdate, "M-d-y");
        var foo_date2 = getDateFromFormat(seconddate, "M-d-y");
        console.log(foo_date1,foo_date2)
        var diffDays = Math.round((foo_date2 - foo_date1)/days);
        

        var firstDate = new Date(firstdate);
        var secondDate = new Date(seconddate);

        // console.log(firstDate);
        // console.log(secondDate);
        // var diffDays = Math.abs(parseInt((firstDate.getDate() - secondDate.getDate())/(oneDay)));


        console.log(diffDays);

        var datesarray = [];
        // console.log("firstdate",firstdate);
        var dateStr=firstdate; 
        // var a=dateStr.split(" ");
        console.log(dateStr);
        var d=dateStr.split("-");
        // var t=a[1].split(":");
        console.log(d[2],d[0],(d[1]-1));
        var calcdate = new Date(d[2],(d[0]-1),(d[1]));

        // var calcdate = new Date(firstdate);
        var tempDate = firstdate;
        if(tempDate){
            console.log("calcdate",calcdate.getMonth,calcdate.getDate,calcdate.getFullYear);
        
            for (var i=0; i<=(diffDays); i++) {
                // console.log(i);
                var formattDate = "";
                // while(tempDate.charAt(0) === '0')
                // md_time = md_time.substr(1);
                if (calcdate.getMonth()<9) {
                    formattDate += "0" + (calcdate.getMonth()+1);
                } else {
                    formattDate += (calcdate.getMonth()+1);
                }
                if (calcdate.getDate()<10) {
                    formattDate += "-" +"0" + calcdate.getDate();
                } else {
                    formattDate += "-" +calcdate.getDate();
                }
                formattDate += "-" + calcdate.getFullYear();

                var dayInlist = calcdate.getDay();
                if($scope.userdays[dayInlist]){
                    datesarray.push(formattDate);
                }
                
                // datesarray.push(formattDate);

                calcdate.setDate(calcdate.getDate() + 1);
                
                console.log(datesarray);
                
                // console.log(datesarray);
            }
            $scope.selectedDates = datesarray;
        }
        
        
        
        var arrayLength = $scope.selectedDates.length;
        // console.log(arrayLength);
        // console.log( $scope.dateArrayCreated );
        for(i=0;i<$scope.dateArrayCreated.length;i++){
            for(j=0;j<arrayLength;j++){
                // console.log($scope.dateArrayCreated[i]);
                // console.log($scope.selectedDates[j]);
                if($scope.dateArrayCreated[i] === $scope.selectedDates[j]){
                    $scope.selectedDates.splice(j,1);
                }
            }
        }
        var arraylengthValue= $scope.selectedDates.length;
        for(i=0;i<$scope.holidays.us.length;i++){
            for(j=0;j<$scope.selectedDates.length;j++){
                console.log($scope.selectedDates[j]);
                var d=$scope.selectedDates[j].split("-");
                var compardate = d[0]+"-"+(d[1]);
                if($scope.holidays.us[i] === compardate){
                    $scope.selectedDates.splice(j,1);
                }
            }
        }

        
    }
    $scope.holidays.us = [];
    
    // $scope.$watch('userdays',function  (data) {
    //     alert("hi");
    //     for(i=0;i<$scope.selectedDates.length;i++){
    //         alert($scope.selectedDates[i].getDay());
    //         // for(j=0;j<arrayLength;j++){
    //         //     // console.log($scope.dateArrayCreated[i]);
    //         //     // console.log($scope.selectedDates[j]);
    //         //     if($scope.dateArrayCreated[i] === $scope.selectedDates[j]){
    //         //         $scope.selectedDates.splice(j,1);
    //         //     }
    //         // }
    //     }

    // });

    // $scope.DateArrayCreate = function(firstdate,seconddate){

    //     console.log(firstdate);

    //     console.log(seconddate);
    //     // $scope.formtiming24hour = $scope.convertTo24Hour($scope.fromtiming.value);
    //     // $scope.totiming24hour = $scope.convertTo24Hour($scope.totiming.value);
    //     // $scope.formtiming24hour = $scope.parseTime($scope.fromtiming.value);
    //     // console.log($scope.formtiming24hour);
    //     // $scope.minutes = $scope.formatTime($scope.formtiming24hour.hour,$scope.formtiming24hour.minute);
    //     // console.log($scope.minutes);
    //     var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    //     // var minutes = 1000*60;
    //     // var hours = minutes*60;
    //     // var days = hours*24;

    //     // var foo_date1 = getDateFromFormat("05/01/2009", "M/d/y");
    //     // var foo_date2 = getDateFromFormat("06/15/2009", "M/d/y");

    //     // var diff_date = Math.round((foo_date2 - foo_date1)/days);
    //     // alert("Diff date is: " + diff_date );

    //     var firstDate = new Date(firstdate);
    //     var secondDate = new Date(seconddate);

    //     // console.log(firstDate);
    //     // console.log(secondDate);
    //     var diffDays = Math.abs(parseInt((firstDate.getDate() - secondDate.getDate())/(oneDay)));


    //     console.log(diffDays);

    //     var datesarray = [];
    //     // console.log("firstdate",firstdate);
    //     var calcdate = new Date(firstdate);
    //     // console.log("calcdate",calcdate);
    //     for (var i=0; i<=(diffDays); i++) {
    //             // console.log(i);
    //             var formattDate = "";
                
    //             if (calcdate.getMonth()<9) {
    //                 formattDate += "0" + (calcdate.getMonth()+1);
    //             } else {
    //                 formattDate += (calcdate.getMonth()+1);
    //             }
    //             if (calcdate.getDate()<10) {
    //                 formattDate += "-" +"0" + calcdate.getDate();
    //             } else {
    //                 formattDate += "-" +calcdate.getDate();
    //             }
    //             formattDate += "-" + calcdate.getFullYear();
    //             console.log(calcdate.getDay());
    //             datesarray.push(formattDate);
                

    //             calcdate.setDate(calcdate.getDate() + 1);
                
    //             $scope.selectedDates = datesarray;
                
    //             // console.log(datesarray);
    //     }
    // }
    $scope.createslots = function(from,to,loc){
        if($scope.desicionValue){
            loc = [];
            loc.push($scope.loctaions.locId);
            console.log(loc,"loc");
        }
        $scope.valuelength  = [];
        for(var i=0 ; i < $scope.locationArrayValue.length;i++){
            $scope.valuelength.push($scope.locationArrayValue[i].locId);
        }


            
        
        console.log($scope.valuelength);

        // console.log("loc.length",loc.length);
        // console.log("loc",loc)
        for(var i=0; i < loc.length;i++){
            // console.log(i,"i");
            // console.log($scope.userdays);
            console.log($scope.fromtiming.value);
            var st1 = $scope.toMinutes($scope.fromtiming.value);
            var et1 = $scope.toMinutes($scope.totiming.value);
            var dur = parseInt($scope.interval.value);
            console.log(st1,"from");
           
            console.log(et1,"to")
            // console.log($scope.currentDate);
            // var formatDate = "";
            //   if ($scope.currentDate.getDate() < 10) {
            //     formatDate += "0" + $scope.currentDate.getDate();
            //   } else {
            //     formatDate += $scope.currentDate.getDate();
            //   }
            //   if ($scope.currentDate.getMonth()<9) {
            //     formatDate += "-" + "0" + ($scope.currentDate.getMonth()+1);
            //   } else {
            //     formatDate += "-" + ($scope.currentDate.getMonth()+1);
            //   }
            //   formatDate += "-" + $scope.currentDate.getFullYear();

            
            // $scope.selectedDates.push(formatDate);


            while(st1+dur<=et1){
                // $scope.addRow($scope.toTime(st1),$scope.toTime(st1+dur));($scope.fromtiming.options).indexOf(fromtime);

                // $scope.valuelength = $scope.output[0].nm.charAt(($scope.output[0].nm.length)-1);
                // console.log(loc);
                // console.log(loc.length);
                // for(var j=0;j<loc.length;j++){
                //     console.log(loc[j],"location");
                //     var locationCalculate = (($scope.valuelength).indexOf(loc[j])+1);
                //     $scope.locationarrayIndexValue.push(locationCalculate);
                // }
                var locationCalculate = (($scope.valuelength).indexOf(loc[i])+1);
                $scope.locationarrayIndexValue.push(locationCalculate);
                // var locationCalculate = (($scope.valuelength).indexOf($scope.loctaions.locId)+1);
                // $scope.locationarrayIndexValue.push(locationCalculate);
                // console.log("$scope.locationarrayIndexValue",$scope.locationarrayIndexValue);
                $scope.inputedit.push("false");
                var input = {
                    from: $scope.toTime(st1),
                    to: $scope.toTime(st1+dur),
                    locId : loc[i]            
                }
                $scope.inputArray.push(input);
                // console.log($scope.inputArray.input.locId.charAt(($scope.output[0].nm.length)-1));

                st1=st1+dur;
                // console.log(st1);
            }
        }
        // console.log("inputarray",$scope.inputArray);
        // console.log($scope.inputArray[0].locId.charAt(($scope.inputArray[0].locId.length)-1));
        // console.log($scope.inputArray);
        // console.log($scope.inputArray.length);
        // console.log($scope.fromarray.splice(3,1));
        // console.log($scope.fromarray);
        // console.log($scope.toarray);
    }
    $scope.addRow = function (from,to) {
        var slotstable = document.getElementById('slotstable');
        if (slotstable) {
            var allSlotRows = getElementsByClassName(slotstable, 'tr', 'slotRow');
            var newRow = slotstable.insertRow(allSlotRows.length-0);
            newRow.className = "slotRow";
            
            var clinincCode = document.getElementsByName('clinicCde')[0].value;
            var clinicCell = newRow.insertCell(0);
            clinicCell.appendChild(newClinicInput('clinic'+allSlotRows.length,clinincCode));
            
            var startTimeCell = newRow.insertCell(1);
            startTimeCell.appendChild(newInput('starttime'+allSlotRows.length,from));
            
            
            
            var endTimeCell = newRow.insertCell(2);
            endTimeCell.appendChild(newInput('endtime'+allSlotRows.length,to));
            
            var patIdCell = newRow.insertCell(3);
            patIdCell.appendChild(newHiddenInput('patid'+allSlotRows.length,0));
            
            var buttons = newRow.insertCell(4);
            buttons.className = "buttons";
        
            setIds();
            updateButtons();
        }
    }   

    $scope.verify = function() {
        var slotstable = $scope.inputArray;
        var loctaionValue=$scope.locationarrayIndexValue;
        for(var i = 0 ; i< $scope.locationarrayIndexValue.length ; i++){
                // console.log($scope.loctaions[i]);
                $scope.locationarrayIndexValue[i] 
                var loctaionindes =  _.findWhere($scope.loctaions, {locId:$scope.inputArray[i].locId} );
                var locationdata = $scope.loctaions.indexOf(loctaionindes);
                console.log(loctaionindes);
                console.log(locationdata);
                if((locationdata + 1 )!=  $scope.locationarrayIndexValue[i] && $scope.loctaions[$scope.locationarrayIndexValue[i]-1]){
                    $scope.inputArray[i].locId = $scope.loctaions[$scope.locationarrayIndexValue[i]-1].locId;
                }
            }
        if (slotstable) {
            var allSlotRows = $scope.inputArray;
            for (var i = 0; i < allSlotRows.length; i++)
            {   
                var loc = $scope.locationarrayIndexValue[i];

                var allInputs = allSlotRows[i];
                
                // allInputs.from.className='input_100';
                // allInputs.to.className='input_100';
                if(!$scope.validateClinic(loc)){
                    // loc.className='input_100 inputerror';
                    // loc.removeAttribute('readOnly');
                    return false;
                }
                if(!$scope.validateTime(allInputs.from))
                    return false;
                if(!$scope.validateTime(allInputs.to))
                    return false;
                var low0=parseInt($scope.toMinutes(allInputs.from));
                var low1=parseInt($scope.toMinutes(allInputs.to));
                if(low0 >= low1)
                {
                    // allInputs.from.className='input_100 inputerror';
                    // allInputs.to.className='input_100 inputerror';
                    // allInputs.from.removeAttribute('readOnly');
                    // allInputs.to.removeAttribute('readOnly');
                    alert("From value must be less than To :" + allInputs.from +"-"+ allInputs.to);
                    return false;
                }
             }
            for (var i = 0; i < allSlotRows.length; i++)
            {
                var allInputsi = allSlotRows[i];
                
                console.log(allInputsi,"allInputsi")
                for (var j = 0; j < allSlotRows.length && i!=j ; j++)
                {
                    var allInputsj = allSlotRows[j];
                    
                    if(allSlotRows[i].locId == allSlotRows[j].locId){
                        var lowj0=parseInt($scope.toMinutes(allInputsj.from));
                        var lowj1=parseInt($scope.toMinutes(allInputsj.to));
                        var lowi0=parseInt($scope.toMinutes(allInputsi.from));
                        var lowi1=parseInt($scope.toMinutes(allInputsi.to));

                        if(((lowj0 == lowi0 && lowj1 == lowi1) || (lowj0 > lowi0 && lowj0 < lowi1) ||(lowj1 > lowi0 && lowj1 < lowi1))||((lowi0 > lowj0 && lowi0 < lowj1) ||(lowi1 > lowj0 && lowi1 < lowj1)))
                        {
                            // allInputsi[1].className='input_100  inputerror';
                            // allInputsi[2].className='input_100  inputerror';
                            // allInputsj[1].className='input_100  inputerror';
                            // allInputsj[2].className='input_100  inputerror';
                            // allInputsi[1].removeAttribute('readOnly');
                            // allInputsi[2].removeAttribute('readOnly');
                            // allInputsj[1].removeAttribute('readOnly');
                            // allInputsj[2].removeAttribute('readOnly');
                            alert("Overlap Times " + allInputsj.from +"-"+ allInputsj.to + " and " +  allInputsi.from +"-"+ allInputsi.to);
                            return false;
                        }
                    }
                        
                }
            }
        }
        
        return true;
    }   
    $scope.validateClinic = function (thisInput){
        // console.log("passing value", thisInput);
        var sel = $scope.locationArrayValue;
        // console.log("locationArrayValue",sel);
        for (var i = 1; i <= sel.length; i++) {
            // console.log(i);
            // console.log("passing value",thisInput);
            // var child = sel[i];
            if (thisInput == i) 
                return true;
        }
        alert("Invalid Clinic Id") ;
        return false;
    }


    $scope.validateTime =  function (thisInput){
        var thisTime = thisInput;
        var validPattern = /(\d{2}):(\d{2})(AM|PM)$/;
        var matchArray = thisTime.match(validPattern); 
        if ( matchArray == null){
            // thisInput.className = 'input_100 inputerror';
            // thisInput.removeAttribute('readOnly');
            alert("Enter time using a HH:MM AM/PM format.") ;
            return false;
        }return true;
    }


    $scope.conformTimeSlot =  function(){
        if($scope.verify()){
            var value = {date:$scope.selectedDates,slots:$scope.inputArray,email:Auth.user.email}
            // console.log(value);
            $http.post('/v1/timeschedule' ,value)
                .success(function(data, status, headers, config) {
                    // $scope.loctaions = data.providerLocations;
                    $scope.alreadyCreatedSlots();
                    $scope.formData.dt = "";
                    $scope.formData.dtSecond = "";
                    $scope.fromtiming.value = null;
                    $scope.totiming.value = null;
                    $scope.interval.value = null;
                    var msg = data;
                      var type = "success";
                      $timeout(function(){
                        $scope.alerts.splice(0, 1);
                    }, 5000);
                      $scope.alerts =[];
                      $scope.inputArray =[];
                      $scope.selectedDates = [];
                        $scope.locationarrayIndexValue = [];
                      $scope.alerts.push({msg: "Successfully Created Appointments",type: type});
                        console.log(data);
                        $timeout(function(){
                        productService.addtemppublisheremail("Successfully Created Appointments");
                        $state.transitionTo("user.provider-dashboard.step3",{
                          },{
                            reload: true,
                            notify: true
                        });
                    }, 30);
                })
                .error(function(data, status, headers, config) {
                    var msg = data.message;
                      var type = "danger";
                      $timeout(function(){
                            $scope.alerts.splice(0, 1);
                        }, 5000);
                      $scope.alerts =[];
                      $scope.alerts.push({msg: msg,type: type});
                    console.log(data);
            });
        }
    }
    $scope.cancelbuttonClick = function(){
        $scope.desicionValue = false;
        $scope.formData.dt = "";
        $scope.inputArray =[];
        $scope.locationarrayIndexValue =[];
        $scope.showbutton = false;
        $scope.fromtiming.value = "";
        $scope.totiming.value = "";
        $scope.interval.value = "";
        $scope.selectedDates = [];
    }
    $scope.toMinutes = function (time){
        var hr = time.substring(0,time.indexOf(":"));
        var min = time.substring(time.indexOf(":")+1,time.length-2);
        var ampm = time.search("AM");
        var totalmin=0;
        if(ampm>0){ 
            if(hr==12)hr=0;
            return (hr*60)+parseInt(min);
        }
        else{
            if(hr==12)hr=0;
            return (hr*60)+parseInt(min)+720;
        }
    }
    $scope.toTime = function (totalmin){
        var hr = ((totalmin/60)+"").split(".")[0];
        var min = ""+totalmin%60;
        var ampm = "AM";
        if(totalmin>=720){
            ampm = "PM";
            hr = hr - 12;
        }
        hr=hr+"";
        if(totalmin<60 || parseInt(hr)==0)
            hr =""+12;
        if(hr.length==1) 
            hr = "0"+hr;
        if(min.length==1) 
            min = "0"+min;
        return hr+":"+min+ampm; 
    }
    $scope.$watch('currentDate',function(){
        console.log($scope.currentDate);
        if($state.includes('user.provider-dashboard.step3') && $scope.desicionValue){
            $scope.changeLocation($scope.loctaions.locId,$scope.currentDate);
        }
        else{
            $scope.dailyViewLocation($scope.loctaions.locId,$scope.currentDate);
        }
        
    });
    $scope.formatAMPM = function (date) {
          var hours = date.getHours();
          var minutes = date.getMinutes();
          var ampm = hours >= 12 ? 'PM' : 'AM';
          hours = hours % 12;
          hours = hours ? hours : 12; // the hour '0' should be '12'
          minutes = minutes < 10 ? '0'+minutes : minutes;
          var strTime = hours + ':' + minutes + ampm;
          return strTime;
        }
    $scope.dailyViewLocation = function(locid,date){

        if(date){
            $scope.selectedDatesInCalenderFormat = date;
        }else{
            $scope.selectedDatesInCalenderFormat = $scope.calenderDateFormat(new Date());

        }
        $scope.currentDateEqualtoSelectDate = false;
       $scope.currrentdateCompare = true;
       $scope.prevdateCompare = false;
       $scope.nowDate = $scope.calenderDateFormat(new Date());
       if($state.includes('user.provider-dashboard.step2')){
            console.log($scope.currentDate,"$scope.currentDate");
            $scope.weeklyView(0,$scope.currentDate);
       }
       var minutes = 1000*60;
        var hours = minutes*60;
        var days = hours*24;
       var foo_date1 = getDateFromFormat($scope.selectedDatesInCalenderFormat, "M-d-y");
        var foo_date2 = getDateFromFormat($scope.nowDate, "M-d-y");
        console.log(foo_date1,foo_date2)
        var diffDays = Math.round((foo_date2 - foo_date1)/days);
       console.log(diffDays,"$scope.nowDate")

       if(diffDays < 0 ){
        $scope.currrentdateCompare = false;
        $scope.prevdateCompare = true;
        $scope.dateEqual = false;

       }
       else if($scope.selectedDatesInCalenderFormat === $scope.nowDate ){
            $scope.currentDateEqualtoSelectDate = true;
            // $scope.timeformat =  $scope.formatAMPM($scope.nowDate);
            $scope.dateEqual = true;
       }
       else{
        $scope.currrentdateCompare = true;
        $scope.prevdateCompare = false;
        $scope.dateEqual = false;
       }
        $scope.valuelength  = [];
        
        if(date==undefined){
            var url = "/v1/getslot?email=" + $scope.user.email +"&view=daily&locId="+locid;
        }else{
            // var valueselece = $scope.calenderDateFormat(date);
            var url = "/v1/getslot?email=" + $scope.user.email +"&view=daily&locId="+locid+"&date="+date;
        }
        for( i = 0 ; i < $scope.locationArrayValue.length;i++){
            console.log($scope.locationArrayValue);
            $scope.valuelength.push($scope.locationArrayValue[i].locId);
        }
        console.log($scope.valuelength);
        var locationCalculate = ((($scope.valuelength).indexOf(locid))+1);
        console.log(locationCalculate);
        console.log(url);
        $http.get(url)
            .success(function(data, status, headers, config) {
                console.log(data);
                // $scope.loctaions = data.providerLocations;
                $scope.inputArray  =[];
                $scope.locationarrayIndexValue = [];
                $scope.dailyViewdata = data;
                var time = $scope.formatAMPM(new Date());
                var dateMonth = $scope.toMinutes(time);

                for(i=0;i < data.slot.slots.length ; i++ ){
                    if(data.slot.slots[i].status == 'booked'){
                        if(data.slot.slots[i].patient.insurance){
                            var Selectedinsurance =  _.findWhere($scope.insurance.options, {key:data.slot.slots[i].patient.insurance}) ;
                            $scope.dailyViewdata.slot.slots[i].patient.insurance = Selectedinsurance.value;
                            $scope.dailyViewdata.slot.slots[i].timebase = false;
                        }
                        
                    }
                    if($scope.dateEqual){
                        if($scope.toMinutes(data.slot.slots[i].from) > dateMonth ){
                            $scope.dailyViewdata.slot.slots[i].timebase = true;
                        }else{
                            $scope.dailyViewdata.slot.slots[i].timebase = false;
                        }
                    }
                    
                }
                if($scope.desicionValue === 'true'){
                    $scope.inputArray = data.slot.slots;
                    // console.log($scope.dailyViewdata);
                    
                    for(i=0;i < data.slot.slots.length ; i++ ){
                        $scope.locationarrayIndexValue.push(locationCalculate);
                    }
                }
                
                
            })
            .error(function(data, status, headers, config) {
                console.log(data);
        });

    }
    $scope.insurance = {};
    $scope.insurance.options = SelectValueService.getinsuranceJson();
    $scope.buttonenable = true;
    // console.log($scope.user.email);
    $scope.dailyViewLocation(($scope.user.email+"0"));        

    
    $scope.add = function (newValue) {
        var obj = {};
        obj.reason = newValue;
        $scope.reason.options.push(obj);
        // $scope.group.name = obj;
        $scope.reason.select = obj.reason;
    }
    $scope.user = Auth.user;

    $scope.CreateSlotSubmit = function(reasonforvisit,patientmail,name){
        // console.log(name);
        // console.log(patientmail);
        var bookAppoinmentjson;
       

        var tempurl = '/v1/slotStatus?location='+$scope.loctaions.locId+'&email='+$scope.user.email+'&date='+$scope.selectDateTable+'&slot='+$scope.selectDateTableTime;
           $http.get(tempurl)
                .success(function(data, status, headers, config) {
                   console.log(data);
                
                var url = '/v1/patient?email='+patientmail+'&view=info';
                 $http.get(url).success(function(data){  
                        console.log(data);
                        $scope.bookAppointment(data);
                 })        
                .error(function(data, status, headers, config) {
                    console.log(data);
                    if(data.statusCode == 404 && data.error == 'Not Found'){
                        $scope.bookAppointment();
                    }else{
                        var msg = data.message;
                        var type = "danger";

                        $timeout(function(){
                            $scope.alerts.splice(0, 1);
                        }, 5000);
                        $scope.alerts =[];
                        $scope.alerts.push({msg: msg,type: type});
                    }
                    
            });

        $scope.bookAppointment = function(extraDetails){
            if(extraDetails){
                 bookAppoinmentjson = {location:$scope.loctaions.locId,provideremail:$scope.user.email,date:$scope.selectDateTable,
                 email:patientmail,name:name,purpose:reasonforvisit,
                slot:$scope.selectDateTableTime,phoneno:extraDetails.patient.phone,gender:extraDetails.patient.gender,insurance:"insure_1"}
            }else{
                bookAppoinmentjson = {location:$scope.loctaions.locId,provideremail:$scope.user.email,date:$scope.selectDateTable,
                 email:patientmail,name:name,purpose:reasonforvisit,
                slot:$scope.selectDateTableTime,insurance:"insure_1"}
            }
             console.log(bookAppoinmentjson);
                $http.put('v1/appointment', bookAppoinmentjson).success(function(data){  
                    console.log(data);
                    $scope.formMethod ={};
                    var msg = "Appointment booked successfully";
                    var type = "success";
                    $timeout(function(){
                            $scope.alerts.splice(0, 1);
                        }, 5000);
                    var FirstArrayIndex =  _.findWhere($scope.weeklyArray, {date:$scope.selectDateTable});
                    var secondArrayIndex =  _.findWhere(FirstArrayIndex.slots, {from:$scope.selectDateTableTime});
                    console.log($scope.weeklyArray[$scope.weeklyArray.indexOf(FirstArrayIndex)].slots[FirstArrayIndex.slots.indexOf(secondArrayIndex)].status);
                    $scope.weeklyArray[$scope.weeklyArray.indexOf(FirstArrayIndex)].slots[FirstArrayIndex.slots.indexOf(secondArrayIndex)].status = 'booked';
                    $scope.dailyViewLocation($scope.loctaions.locId,$scope.currentDate);

                    $scope.alerts =[];
                    $scope.alerts.push({msg: msg,type: type});
                    $scope.selectDateTable = "";
                    $scope.selectDateTableTime = "";

                    
                  

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
    }
    
    $scope.timetableTimeSelected = function(time, date){
        $scope.selectDateTable = date;
        $scope.selectDateTableTime = time;
        
    }
    $scope.updateStatus = function(date,time,index,statusFromProvider,reason){
       if(reason == undefined) {
            var cancelAppointmentjson = {provideremail:$scope.user.email,date:date, 
            location:$scope.loctaions.locId,slot:time,status:statusFromProvider}
            // console.log(cancelAppointmentjson);
       }
       else{
            var cancelAppointmentjson = {provideremail:$scope.user.email,date:date, 
            location:$scope.loctaions.locId,slot:time,status:statusFromProvider,reason:reason}
            
       }
        
        // console.log(cancelAppointmentjson);

        $http.put('/v1/updateStatus',cancelAppointmentjson)
            .success(function(data, status, headers, config) {
                // $scope.loctaions = data.providerLocations;
                 var msg = data;
                  var type = "success";
                  $timeout(function(){
                          $scope.alerts.splice(0, 1);
                   }, 5000);
                  $scope.alerts =[];
                  $scope.alerts.push({msg:msg,type: type});
                  console.log(statusFromProvider,"status");
                  if(statusFromProvider === 'Cancel'){
                        $scope.dailyViewdata.slot.slots[index].status = "available";
                
                        $scope.dailyViewdata.slot.slots[index].patient = {};
                  }else if(statusFromProvider === 'Done'){
                    $scope.dailyViewdata.slot.slots[index].status = "done";
                    console.log($scope.dailyViewdata);
                  }else if(statusFromProvider === 'NoShow'){
                    $scope.dailyViewdata.slot.slots[index].status = "noshow";
                    console.log($scope.dailyViewdata);
                  }
               
                
                
                
                console.log(data);
                $scope.buttonenable = true;
            })
            .error(function(data, status, headers, config) {
                console.log(data);
        });
    }
    $scope.SpecialOffers = function  (form,multiloctaions) {
        console.log(form);
        console.log(multiloctaions);
        var localform = {"location":multiloctaions,"startDate":form.startDate,"endDate":form.endDate,"title":form.title,"description":form.description};
        console.log(localform);
        $http.put('/v1/offer?email='+$scope.user.email,localform)
            .success(function(data, status, headers, config) {
                // $scope.loctaions = data.providerLocations;
                console.log(data);
                 var msg = data;
                  var type = "success";
                  $timeout(function(){
                          $scope.alerts.splice(0, 1);
                   }, 5000);
                  $scope.alerts =[];
                  $scope.alerts.push({msg:msg,type: type});


            })
            .error(function(data, status, headers, config) {
                console.log(data);
        });

    }


    
    // $scope.today = function() {
    //     $scope.dob = new Date();
    //     // console.log($scope.dob.format(' hh:mm tt'));
    //     // $scope.currentTime =  ($scope.dob.toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/,"$1$3"))
    //   };
    //   $scope.today();
    //   // var picker = new Pikaday(
    //   //   {
    //   //       field: document.getElementById('datepicker2'),
    //   //       firstDay: 1,
    //   //       minDate: new Date('2000-01-01'),
    //   //       maxDate: new Date('2020-12-31'),
    //   //       yearRange: [2000,2020]
    //   //   });
      $scope.clear = function () {
        $scope.dob = null;
      };
      $scope.dateTimeNow = function() {
        $scope.startingDateValue = new Date();
        
      };
      $scope.dateTimeNow();

        $scope.formData ={};
    $scope.datepickers = {
        dt: false,
        dtSecond: false,
        
    }
    $scope.today = function() {
        // $scope.formData.dt = new Date();

        // ***** Q1  *****
        // $scope.formData.dtSecond = new Date();
    };
    $scope.today();

    $scope.showWeeks = true;
    $scope.toggleWeeks = function () {
        $scope.showWeeks = ! $scope.showWeeks;
    };

    $scope.clear = function () {
        $scope.dt = null;
    };

      // Disable weekend selection
      
      // $http.get('/v1/slottedDate?email='+$scope.user.email)
      //       .success(function(data, status, headers, config) {
                
      //           // console.log("slottedDate",data.slotCreatedDates);
      //           var valueodData = data.slotCreatedDates;
      //           $scope.dateArrayCreated = valueodData;
      //          // $scope.dateArrayCreated = data.slot.slots;
               
      //       })
      //       .error(function(data, status, headers, config) {
      //           console.log(data);
      //   });
      // $scope.dateArrayCreated = ["09-30-2014","10-12-2014","10-14-2014","10-16-2014","10-18-2014"];
      $scope.disabled = function(date, mode) {
        for(var i = 0 ; i < $scope.dateArrayCreated.length ; i++ ){
            var datemodel = new Date($scope.dateArrayCreated[i]);
            if(date.getMonth() == datemodel.getMonth() ){
                if(date.getDate() == datemodel.getDate()){
                    
                    return true;
                }
                
            }

        }
        return false;

        
      };

      

      $scope.open = function($event, which) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.datepickers[which]= true;

      };

      $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1
      };

      $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
      $scope.format = 'MM-dd-yyyy';

    $scope.today = function() {
        // $scope.formData.dt = new Date();
        $scope.currentDate = new Date();
        $scope.currentDate = $scope.calenderDateFormat($scope.currentDate);
        // $scope.formData.dt = $scope.currentDate;

        // ***** Q1  *****
        // Second = new Date();
    };
    $scope.today();

 	});

   