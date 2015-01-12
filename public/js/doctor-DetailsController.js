mdtreeApp.controller('doctorDetailsController',
    function doctorDetailsController($scope, productService,SelectValueService, $http,Auth) { 
    // $scope.$watch(function () { return productService.getdoctorEmailTemp();}, function (data) { 
    //     $scope.specificdoctor = data;

    // });

    productService.addlocationdetails();
    $scope.bookingdate = [];
    var dayShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var date = new Date();
    $scope.getYearandDate = new Date(date);
    console.log(date.getDay());
    var dateStr = {dayShort: dayShort[date.getDay()], date: (date.getMonth() + 1) + '/' + date.getDate()};
    console.log(dateStr);
    $scope.bookingdate.push(dateStr);
    date.setDate(date.getDate() + 1);
    dateStr = {dayShort: dayShort[date.getDay()], date: (date.getMonth() + 1) + '/' + date.getDate()};
    $scope.bookingdate.push(dateStr);
    date.setDate(date.getDate() + 1);
    dateStr = {dayShort: dayShort[date.getDay()], date: (date.getMonth() + 1) + '/' + date.getDate()};
    $scope.bookingdate.push(dateStr);
    date.setDate(date.getDate() + 1);
    dateStr = {dayShort: dayShort[date.getDay()], date: (date.getMonth() + 1) + '/' + date.getDate()};
    $scope.bookingdate.push(dateStr);
    date.setDate(date.getDate() + 1);
    dateStr = {dayShort: dayShort[date.getDay()], date: (date.getMonth() + 1) + '/' + date.getDate()};
    $scope.bookingdate.push(dateStr);
    date.setDate(date.getDate() + 1);
    dateStr = {dayShort: dayShort[date.getDay()], date: (date.getMonth() + 1) + '/' + date.getDate()};
    $scope.bookingdate.push(dateStr);
    date.setDate(date.getDate() + 1);
    dateStr = {dayShort: dayShort[date.getDay()], date: (date.getMonth() + 1) + '/' + date.getDate()};
    $scope.bookingdate.push(dateStr);

    $scope.openNewTab = function(uri){
           
        var link = angular.element('<a href="http://' + uri + '" target="_blank"></a>');

        angular.element(document.body).append(link);

        link[0].click();
        link.remove();
    }
    $scope.timeclicked = function(doctor, md_date, md_time,offer,desc,location) {
        console.log("location",location)
        var dayFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        $scope.user=Auth.user;
        if($scope.user.type === 'patient'){
            var tempurl = '/v1/slotStatus?location='+location.locationId+'&email='+doctor.email+'&date='+md_date+'&slot='+md_time;
                $http.get(tempurl)
                    .success(function(data, status, headers, config) {
                       console.log(data);
                    })
                    .error(function(data, status, headers, config) {
                        console.log(data);
                         productService.adderrormsgwhenAppointment(data.message);
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
        var data = {date : md_date, day: dayFull[date.getDay()], time: md_time,offer:offer,desc:desc};
        console.log(doctor);
        console.log(data);
        productService.adddoctordetails(doctor);
        productService.adddate_day_time(data);
      
        productService.addlocationdetails(location);

    }
    $scope.heightMin = true;
    $scope.indexValue = 0;
    $scope.nextslots = function(value){
           // console.log($scope.bookingdate); 
           var date = new Date($scope.getYearandDate);
           $scope.bookingdate = [] ;
           if (value == 'prev'){
                
                date.setDate(date.getDate() - 7);
                $scope.indexValue = $scope.indexValue - 1; 
                $scope.getYearandDate = new Date(date);
           }
           else{
                
                date.setDate(date.getDate() + 7);
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
            date.setDate(date.getDate() + 1);
            dateStr = {dayShort: dayShort[date.getDay()], date: (date.getMonth() + 1) + '/' + date.getDate() };
            $scope.bookingdate.push(dateStr);
            date.setDate(date.getDate() + 1);
            dateStr = {dayShort: dayShort[date.getDay()], date: (date.getMonth() + 1) + '/' + date.getDate() };
            $scope.bookingdate.push(dateStr);
            $scope.firstsearchoperation($scope.indexValue);
            
        }
    $scope.specialty.options = SelectValueService.getDoctorsJson();
    $scope.dentistslists= {};
    $scope.dentistslists.options = SelectValueService.getdentistslists();
    $scope.chiropractors= {};
    $scope.chiropractors.options = SelectValueService.getchiropractors();
    $scope.otherSpeciality = {};
    $scope.otherSpeciality.options = SelectValueService.getotherSpeciality();
    $scope.vision = {}
    $scope.vision.options = SelectValueService.getvision();
    $scope.offerInsystem = "";
    $scope.firstsearchoperation = function(indexValue) {
            
        var temp = "&startindex=0";
        if(indexValue != undefined){
            temp = "&startindex=" + indexValue;
            console.log(temp);
        }
        console.log(temp);
        $scope.Selectedinsurance = [];
        $scope.SelectedLangJson = [];
        $http.get('v1/provider?email=' + productService.getdoctorEmailTemp() +temp)
            .success(function(data, status, headers, config) {
                $scope.doctordetails = data.provider;
                console.log(data.provider);
                $scope.specialty.doctor = data.provider.specialty;
                $scope.initialize(data.provider);
                console.log((SelectValueService.getinsuranceJson()));
                for(i = 0 ; i < data.provider.insurance.length ; i++ ){
                    $scope.Selectedinsurance[i] =  (_.findWhere(SelectValueService.getinsuranceJson(), {key:data.provider.insurance[i]})).value ;
                    console.log($scope.Selectedinsurance[i]);
                }
                for(i = 0 ; i < data.provider.languages.length ; i++ ){
                    $scope.SelectedLangJson[i] =  (_.findWhere(SelectValueService.getLangJson(), {key:data.provider.languages[i]})).id ;

                    console.log($scope.SelectedLangJson[i]);
                }
               
                    $scope.offerInsystem =  (_.findWhere(SelectValueService.getOfferJson(), {key:$scope.doctordetails.offer})).id ;
                     $scope.doctordetails.offerStmt = $scope.offerInsystem;
                    console.log($scope.offerInsystem,"offerInsystem");
                
                console.log($scope.specialty.options,"$scope.specialty.options");
                console.log($scope.specialty.doctor,"$scope.specialty.doctor");
                $scope.SelectedSpeciality = (( _.findWhere($scope.specialty.options, {key:$scope.specialty.doctor} )
                 || _.findWhere($scope.dentistslists.options, {key:$scope.specialty.doctor})
                 || _.findWhere($scope.chiropractors.options, {key:$scope.specialty.doctor}) 
                 || _.findWhere($scope.vision.options, {key:$scope.specialty.doctor})
                 || _.findWhere($scope.otherSpeciality.options, {key:$scope.specialty.doctor})  
                 )).value; 


                var tempValue =  _.findWhere(SelectValueService.getcashPriceJson(), {key:data.provider.cash}) ;
                $scope.doctordetails.cash = tempValue.id;
                
                // for(var i=0;i<= data.provider.length;i++){
                    $scope.appointmentHideOrShow="true";
                    for(var j=0;j<data.provider.locations.length;j++){
                        console.log(data.provider.locations.length,"data.provider.locations.length");
                        console.log(data.provider.locations[j].appointmentSchedules.length,"data.provider.locations[j].appointmentSchedules.length");
                        for(var k=0;k<data.provider.locations[j].appointmentSchedules.length;k++){
                            for(var l=0;l<data.provider.locations[j].appointmentSchedules[k].slots.length;l++){
                                $scope.appointmentHideOrShow="false";
                            }        
                                
                        }
                    }
                // }
            })
            .error(function(data, status, headers, config) {
                console.log(data);
        });
    $scope.initialize = function (passmaplocation,index) {

        console.log(passmaplocation);
        if(document.getElementById("map_canvas") == null) return;
          if (GBrowserIsCompatible()) {
            var map = new GMap2(document.getElementById("map_canvas"));
            //map.setCenter(new GLatLng(37.4419, -122.1419), 13);
            map.setUIToDefault();
          }      

          geocoder = new GClientGeocoder();
          console.log(geocoder.getLatLng);
          // var address = 'madurai';
          if(index !== undefined){
            var address =  passmaplocation;
            }else{
                var address =  $scope.doctordetails.zipCode;
            }
          
         
           
          addMarkers(map, address, 0);
          // passmaplocation.locations = ["pasumalai","villapuam","nilaiyur"];

          if(index !== undefined){
             address = $scope.doctordetails.locations[index].address + "," + $scope.doctordetails.locations[index].city + ","+ $scope.doctordetails.locations[index].state;
              infoText = "<html><div align=\"left\">" + address + "</div></html>";
                addMarkers(map,address, 1, (index+1), infoText);
                console.log(address);
            }
            else{
                 for ( var i=0;i<passmaplocation.locations.length;i++){
                // address ="pasumalai" 
                 address = passmaplocation.locations[i].address + "," + passmaplocation.locations[i].city + ","+ passmaplocation.locations[i].state;
                infoText = "<html><div align=\"left\">" + address + "</div></html>";
                addMarkers(map,address, 1, (i+1), infoText);
                console.log(address);
                }
            }
         
      
      
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
    }
    $scope.firstsearchoperation();

});