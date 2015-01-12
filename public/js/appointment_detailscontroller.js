
mdtreeApp.controller('appointment_detailscontroller',function appointment_detailscontroller($scope,$timeout,productService,$state,$http,Auth){
    $scope.$watch(function () { return productService.getdoctordetails()}, function (data) { 
        $scope.doctordetails = data;
        console.log($scope.doctordetails)
        
        console.log($scope.getlocationForMap);
        if($scope.doctordetails.address != undefined){
            $scope.getlocationForMap = {address : $scope.doctordetails.address + "," + $scope.doctordetails.city  + "," + $scope.doctordetails.state + "," + $scope.doctordetails.zip,zip: data.zip};
            $scope.initialize();
        }
        
    });
    $scope.$watch(function () { return productService.getdate_day_time();}, function (data) { 
        $scope.daytimedetails = data;
        console.log(data);
    });
     $scope.ErrorChecking = function () { 
        var data = productService.geterrormsgwhenAppointment();
        if(data == undefined){
            $scope.errormsgwhenAppointment = "";
        }
        else{
            $scope.errormsgwhenAppointment = data;
             productService.adderrormsgwhenAppointment();
        }
        
        console.log(data);
    }
    $scope.ErrorChecking();
    $scope.locationDetails = productService.getlocationdetails();
    
    
        
    $scope.doctorBookApponimentClicked = function(email){
        productService.adddoctorEmailTemp(email);
    }
    $scope.reason = productService.getreason();
    $scope.username = productService.getuserdisplayname();
    // $scope.$watch(function () { return productService.getdoctorEmailTemp();}, function (data) { 
    //     $scope.specificdoctor = data;
    // });
    $scope.userid = Auth.user;
    $scope.zipcode = productService.getlocation();
    $scope.specialty.doctor = productService.getspecialty();
    $scope.insurance = productService.getinsurance();
    $scope.categories = productService.getcategory();
    $scope.emailid = productService.getdoctorEmailTemp();
    $scope.getinsuranceValue = productService.getaddinsurance();
    // http://localhost:8000/v1/provider/search?zip=90002&specialty=cardiology&category=doctors&insurance=aarp&email=thanesh@gmail.com
   
    var queryParams = "v1/provider/search?";
    if ($scope.categories) {
        queryParams += "category="+$scope.categories;
    } else {
        queryParams + "category=doctors";
    }
    if ($scope.specialty.doctor) {
        queryParams += "&specialty="+encodeURIComponent($scope.specialty.doctor);
    }
    if ($scope.zipcode) {
        queryParams += "&zip="+$scope.zipcode;
    }
    if ($scope.emailid) {
        queryParams += "&email="+$scope.emailid;
    }
    
    // if ($scope.insurance) {
    //     queryParams += "&insurance="+encodeURIComponent($scope.insurance);
    // }

    console.log(queryParams);
    
    $scope.reasons = {};
    $scope.reasons.options = [{reason:"Special offer"},{reason:"Abdominal pain"},{reason:"Abnormal bleeding"},{reason:"Allergies"},{reason:"Anxiety"},{reason:"Burning w or urination"},{reason:"Chest pain"},{reason:"Constipation"},{reason:"Coughing"},{reason:"Cracked tooth"},{reason:"Crying"},{reason:"Dental pain"},{reason:"Depression"},{reason:"Diarrhea"},{reason:"Difficulty breath"},{reason:"Discoloration"},{reason:"Dizziness"},{reason:"Dryness"},{reason:"Erectile Dysfunction"},{reason:"Excessive thirst"},{reason:"Fibroids"},{reason:"Frequent bruising"},{reason:"Frequent urination"},{reason:"Genital discharge"},{reason:"Genital odor"},{reason:"Gum pain"},{reason:"Hair loss"},{reason:"Hay Fever"},{reason:"Heart burn"},{reason:"Heat or cold intolerance"},{reason:"Hives"},{reason:"I need braces"},{reason:"Incontinence"},{reason:"Infertility"},{reason:"Joint pain"},{reason:"Loss of hearing"},{reason:"Low libido"},{reason:"Lumps"},{reason:"Mole Changes"},{reason:"Muscle pain"},{reason:"Muscle weakness"},{reason:"Nausea"},{reason:"Nipple discharge"},{reason:"Numbness or tingling"},{reason:"Oily"},{reason:"Painful intercourse"},{reason:"Painful menstruation"},{reason:"Palpitations"},{reason:"Phlegm"},{reason:"Poor circulation"},{reason:"Postcoital bleeding"},{reason:"Rash"},{reason:"Regurgitation"},{reason:"STD"},{reason:"Seizures"},{reason:"Shortness of breath"},{reason:"Sinus problems"},{reason:"Skin changes"},{reason:"Sleep apnea"},{reason:"Sore throat"},{reason:"Swelling"},{reason:"Swollen glands"},{reason:"Teeth cleaning"},{reason:"Teeth whitening"},{reason:"Thoughts of suicide"},{reason:"Tinnitus or Ringing in ears"},{reason:"Urine retention"},{reason:"Vomiting"},{reason:"Wheezing"},{reason:"Wounds"}       
                         ]

    $scope.bookingdate = [];
    var dayShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var date = new Date();
    $scope.getYearandDate = new Date(date);
    console.log(date.getDay());
    var dateStr = {dayShort: dayShort[date.getDay()], date: (date.getMonth() + 1) + '/' + date.getDate()};
    
    $scope.bookingdate.push(dateStr);
    date.setDate(date.getDate() + 1);
    dateStr = {dayShort: dayShort[date.getDay()], date: (date.getMonth() + 1) + '/' + date.getDate() };
    $scope.bookingdate.push(dateStr);
    date.setDate(date.getDate() + 1);
    dateStr = {dayShort: dayShort[date.getDay()], date: (date.getMonth() + 1) + '/' + date.getDate() };
    $scope.bookingdate.push(dateStr);
    date.setDate(date.getDate() + 1);
    dateStr = {dayShort: dayShort[date.getDay()], date: (date.getMonth() + 1) + '/' + date.getDate() };
    $scope.bookingdate.push(dateStr);
    date.setDate(date.getDate() + 1);
    dateStr = {dayShort: dayShort[date.getDay()], date: (date.getMonth() + 1) + '/' + date.getDate() };
    $scope.bookingdate.push(dateStr);
    $scope.indexValue = 0;
    $scope.nextslots = function(value){
           // console.log($scope.bookingdate); 
           
           var date = new Date($scope.getYearandDate);
           $scope.bookingdate = [] ;
           if (value == 'prev'){
                
                date.setDate(date.getDate() - 5);
                $scope.indexValue = $scope.indexValue - 1; 
                $scope.getYearandDate = new Date(date);

           }
           else{
                // $scope.getYearandDate = date;
                date.setDate(date.getDate() + 5);
                $scope.indexValue = $scope.indexValue + 1; 
                $scope.getYearandDate = new Date(date);
                
           }
            
            var dateStr = {dayShort: dayShort[date.getDay()], date: (date.getMonth() + 1) + '/' + date.getDate() };
    
            $scope.bookingdate.push(dateStr);
            date.setDate(date.getDate() + 1);
            dateStr = {dayShort: dayShort[date.getDay()], date: (date.getMonth() + 1) + '/' + date.getDate() };
            $scope.bookingdate.push(dateStr);
            date.setDate(date.getDate() + 1);
            dateStr = {dayShort: dayShort[date.getDay()], date: (date.getMonth() + 1) + '/' + date.getDate() };
            $scope.bookingdate.push(dateStr);
            date.setDate(date.getDate() + 1);
            dateStr = {dayShort: dayShort[date.getDay()], date: (date.getMonth() + 1) + '/' + date.getDate() };
            $scope.bookingdate.push(dateStr);
            date.setDate(date.getDate() + 1);
            dateStr = {dayShort: dayShort[date.getDay()], date: (date.getMonth() + 1) + '/' + date.getDate() };
            $scope.bookingdate.push(dateStr);
            $scope.firstsearchoperation($scope.indexValue);
            //localhost:8000/v1/provider/search?zip=90002&specialty=cardiology&category=doctors&insurance=AArp&startindex=1
        }
    $scope.firstsearchoperation = function(indexValue) {
            
        var temp = queryParams;
        if(indexValue != undefined){
            temp = queryParams + "&startindex=" + indexValue;
            console.log(temp);
        }
        console.log(temp);
        $http.get(temp)
            .success(function(data, status, headers, config) {
                console.log(data);
                $scope.singledoctor = data.provider;
                $scope.appointmentHideOrShow="true"
                

                for(var j=0;j<data.provider.appointmentSchedules.length;j++){
                    
                    for(var k=0;k<data.provider.appointmentSchedules[j].slots.length;k++){
                            console.log("appointmentHideOrShow");
                            $scope.appointmentHideOrShow="false";
                    }
                }
                    
            })
            .error(function(data, status, headers, config) {
                console.log(data);
        });
    }
    $scope.firstsearchoperation();
//localhost:8000/v1/provider/search?zip=90002&specialty=cardiology&category=doctors&insurance=AArp&startindex=1&email=dheeraj@gmail.com
     $scope.getUserinfo = function(){
        var url = '/v1/patient?email='+$scope.userid.email;
        $http.get(url).success(function(data){  
            console.log(data);
            $scope.daytimedetails.user = data;

        })
        .error(function(data, status, headers, config) {

        });
     }   
     $scope.NumberConfrm = true;
     var url = '/v1/patient?email='+$scope.userid.email;
        $http.get(url).success(function(data){  
            console.log(data);
            $scope.daytimedetails.user = data;

        })
        .error(function(data, status, headers, config) {

        });
     $scope.phoneNumberNotConfrm = function  () {
        $scope.errorMsgForPhone = ""
         $scope.NumberConfrm = false;
         $scope.PhoneEdit = true;
     }
    $scope.phoneNumberConfrm = function  () {
        $scope.errorMsgForPhone = "";
        $scope.NumberConfrm = false;
        $scope.PhoneEdit = false;
    }
    $scope.displayErrorMsg = function  () {
            $scope.errorMsgForPhone = "Confirm Your Phone Number"
    }
    $scope.CancelupdateUserPhone = function(){
        $scope.NumberConfrm = true;
        $scope.PhoneEdit = false;
    }
    $scope.updateUserPhone = function  () {
        console.log($scope.daytimedetails.user.patient.firstName);
       var Patientjson = {"firstName":$scope.daytimedetails.user.patient.username,"lastName":$scope.daytimedetails.user.patient.lastName,"phone":$scope.daytimedetails.user.patient.phone,"zipCode":$scope.daytimedetails.user.patient.zipCode,"gender":$scope.daytimedetails.user.patient.gender,"dob":$scope.daytimedetails.user.patient.dob}
        
        $http.put('/v1/updatePatient?email='+$scope.userid.email,Patientjson)

            .success(function(data, status, headers, config) {
                console.log(data);
                $scope.PhoneEdit = false;
                $scope.NumberConfrm = true;
                 var msg = data;
                var type = "success";
                $timeout(function(){
                    $scope.alerts.splice(0, 1);
                }, 5000);
                $scope.alerts =[];
                $scope.alerts.push({msg: msg,type: type});
            })
            .error(function(data, status, headers, config) {
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
    $scope.bookAppoinmentcomplete = function(){
        // var bookAppoinmentjson = {location:$scope.doctordetails.locationId,provideremail:$scope.doctordetails.email,date:$scope.daytimedetails.date,
        //  patient:{email:$scope.userid.email,name:$scope.userid.username,purpose:$scope.reasons.select,insurance:$scope.insurance,message:$scope.Personalmessage,
        //  },slot:$scope.daytimedetails.time}
        var url = '/v1/patient?email='+$scope.userid.email+'&view=info';
        $http.get(url).success(function(data){  
            console.log(data);
            $scope.daytimedetails.user = data;

        
        

        var bookAppoinmentjson;
        
         
                if ($scope.locationDetails ){ 
                    bookAppoinmentjson = {location:$scope.locationDetails.locationId,provideremail:$scope.doctordetails.email,date:$scope.daytimedetails.date,
             email:$scope.userid.email,name:$scope.userid.username,purpose:$scope.reason.visitreason,insurance:$scope.insurance,message:$scope.reason.personalmsg,
            slot:$scope.daytimedetails.time,phoneno:data.patient.phone,gender:data.patient.gender}
        }else{
            bookAppoinmentjson = {location:$scope.doctordetails.locationId,provideremail:$scope.doctordetails.email,date:$scope.daytimedetails.date,
             email:$scope.userid.email,name:$scope.userid.username,purpose:$scope.reason.visitreason,insurance:$scope.insurance,message:$scope.reason.personalmsg,
            slot:$scope.daytimedetails.time,phoneno:$scope.daytimedetails.user.patient.phone,gender:$scope.daytimedetails.user.patient.gender}
        }
            console.log(bookAppoinmentjson);
             console.log(bookAppoinmentjson);
                $http.put('v1/appointment', bookAppoinmentjson).success(function(data){  
                        console.log(data);
                        productService.addErrorAppointment();
                    $state.transitionTo("user.appointment-complete",{
                      },{
                        reload: true,
                        notify: true
                    });

                    }).error(function(data, status, headers, config) {
                        productService.addErrorAppointment(data.message);
                        console.log(data);
                        var msg = data.message;
                        var type = "danger";
                        $timeout(function(){
                            $scope.alerts.splice(0, 1);
                        }, 5000);
                        $scope.alerts =[];
                        $scope.alerts.push({msg: msg,type: type});
                         $state.transitionTo("user.appointment-complete",{
                          },{
                            reload: true,
                            notify: true
                        });
                }); 

       })
    }


    $scope.timeclicked = function(doctor, md_date, md_time,title,desc) {
            var dayFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            $scope.user=Auth.user;
            if($scope.user.type === 'patient'){
                var tempurl = '/v1/slotStatus?location='+doctor.locationId+'&email='+doctor.email+'&date='+md_date+'&slot='+md_time;
                $http.get(tempurl)
                    .success(function(data, status, headers, config) {
                       console.log(data);
                    })
                    .error(function(data, status, headers, config) {
                        console.log(data);
                        productService.adderrormsgwhenAppointment(data.message);
                        $scope.ErrorChecking();
                });
            }else{
                if($scope.user.role.title === 'public'){
                    var tempjsonForSlotStatus = {locid:doctor.locationId,doc:doctor.email,date:md_date,slotTime:md_time};
                    productService.addSlotStatus(tempjsonForSlotStatus);
                }
                
            }
            var date = new Date(md_date);
            // while(md_time.charAt(0) === '0')
            // md_time = md_time.substr(1);
            console.log(date.getDay()+1);
            console.log(date.getDay()+1);
            var data = {date : md_date, day: dayFull[date.getDay()], time: md_time,offer:title,desc:desc};
            productService.adddoctordetails(doctor);
            productService.adddate_day_time(data);
            console.log(data);
    }

    console.log(productService.getdoctorEmailTemp());
    // $scope.singledoctor = productService.getdoctorEmailTemp(); 
    
    $scope.personaldetails = function(){
        var data = {visitreason : $scope.reasons.select , personalmsg :$scope.Personalmessage};
        productService.addreason(data);
        $scope.name = Auth.user.username;

        if($scope.name == '' ){
        $state.transitionTo("anon.appointment-signin",{
              },{
                reload: true,
                notify: true
        });
        }
        else{
        $scope.getUserinfo();
        $state.go("user.appointment-verify")
        $scope.initialize();
        
        }
    
    }
    
    $scope.initialize = function (value) {

        if(value){
            $scope.MapViewOption = true;
        }
        
        if(document.getElementById("map_canvas") == null) return;
      if (GBrowserIsCompatible()) {
        var map = new GMap2(document.getElementById("map_canvas"));
        //map.setCenter(new GLatLng(37.4419, -122.1419), 13);
        map.setUIToDefault();
      }      

      geocoder = new GClientGeocoder();
      console.log(geocoder.getLatLng);
      // var address = 'madurai';
      console.log($scope.getlocationForMap);
      address = $scope.getlocationForMap.zip;
      addMarkers(map, address, 0);
      // $scope.findmaplocation = ["pasumalai","villapuam","nilaiyur"];
      console.log($scope.findmaplocation);
      // for ( var i=0;i<$scope.findmaplocation.length;i++){
        address = $scope.getlocationForMap.address;
           // address = $scope.findmaplocation[i].address + "," + $scope.findmaplocation[i].city + ","+ $scope.findmaplocation[i].state;
          infoText = "<html><div align=\"left\">" + address + "</div></html>";
            addMarkers(map,address, 1, 1, infoText);
            console.log(address);
        // }
      
      
    }
    



    
    function addMarkers(map, address, val, iconNo, infoText) {
        
        if (geocoder) {
          geocoder.getLatLng(
            address,
            function(point) {
              if (!point) {
              //alert(address + " not found");
              } else {
                if(val == 0) {
                    map.setCenter(point, 11);
                } else {
                    var url = "images/GoogleMap/free/pin" + (iconNo) + ".png";
                    gicons = new GIcon(G_DEFAULT_ICON, url); 
                    console.log(gicons);

                    var marker = new GMarker(point, gicons);
                    /* marker.openInfoWindowHtml("Some other stuff"); */
                    map.addOverlay(marker);
                    GEvent.addDomListener(document.getElementById('pin' + iconNo), "click", function() { 
                        marker.openInfoWindowHtml(infoText); 
                    });
                    GEvent.addDomListener(marker, "click", function() { 
                        marker.openInfoWindowHtml(infoText); 
                    });
                }
              }
            }
          );
        }
    }
    if($scope.locationDetails == undefined){
        $scope.locationDetailsInfo = false;
    } else{
        $scope.locationDetailsInfo = true;
        $scope.getlocationForMap = {address : $scope.locationDetails.address + "," + $scope.locationDetails.city  + "," + $scope.locationDetails.state + "," + $scope.locationDetails.zip,zip: $scope.locationDetails.zip};
        console.log($scope.getlocationForMap);
            $scope.initialize();
    }
    // productService.addlocationdetails();
});

mdtreeApp.controller('googlemap',function googlemap($scope,$timeout,productService,$state,$http,Auth){
    $scope.locationDetails = productService.getlocationdetails();
    $scope.getlocationForMap = {address : $scope.locationDetails.address + "," + $scope.locationDetails.city  + "," + $scope.locationDetails.state + "," + $scope.locationDetails.zip,zip: $scope.locationDetails.zip};
    console.log($scope.getlocationForMap);
    $scope.initialize = function (value) {

        if(value){
            $scope.MapViewOption = true;
        }
        
        if(document.getElementById("map_canvas") == null) return;
      if (GBrowserIsCompatible()) {
        var map = new GMap2(document.getElementById("map_canvas"));
        //map.setCenter(new GLatLng(37.4419, -122.1419), 13);
        map.setUIToDefault();
      }      

      geocoder = new GClientGeocoder();
      console.log(geocoder.getLatLng);
      // var address = 'madurai';
      console.log($scope.getlocationForMap);
      address = $scope.getlocationForMap.zip;
      addMarkers(map, address, 0);
      // $scope.findmaplocation = ["pasumalai","villapuam","nilaiyur"];
      console.log($scope.findmaplocation);
      // for ( var i=0;i<$scope.findmaplocation.length;i++){
        address = $scope.getlocationForMap.address;
           // address = $scope.findmaplocation[i].address + "," + $scope.findmaplocation[i].city + ","+ $scope.findmaplocation[i].state;
          infoText = "<html><div align=\"left\">" + address + "</div></html>";
            addMarkers(map,address, 1, 1, infoText);
            console.log(address);
        // }
      
      
    }
    


    $scope.initialize();
    
    function addMarkers(map, address, val, iconNo, infoText) {
        
        if (geocoder) {
          geocoder.getLatLng(
            address,
            function(point) {
              if (!point) {
              //alert(address + " not found");
              } else {
                if(val == 0) {
                    map.setCenter(point, 11);
                } else {
                    var url = "images/GoogleMap/free/pin" + (iconNo) + ".png";
                    gicons = new GIcon(G_DEFAULT_ICON, url); 
                    console.log(gicons);

                    var marker = new GMarker(point, gicons);
                    /* marker.openInfoWindowHtml("Some other stuff"); */
                    map.addOverlay(marker);
                    GEvent.addDomListener(document.getElementById('pin' + iconNo), "click", function() { 
                        marker.openInfoWindowHtml(infoText); 
                    });
                    GEvent.addDomListener(marker, "click", function() { 
                        marker.openInfoWindowHtml(infoText); 
                    });
                }
              }
            }
          );
        }
    }

});

mdtreeApp.controller('SearchCompleteController',function SearchCompleteController($scope,$timeout,productService,$state,$http,Auth){
    $scope.ErrorAppointment = productService.getErrorAppointment()
});