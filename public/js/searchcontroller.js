mdtreeApp.controller('searchcontroller',
    function searchcontroller($scope, productService,SelectValueService, $http,Auth) {
        $scope.categories = {};
        $scope.insurance = {};
        $scope.specialty= {};
        $scope.categories.type = productService.getcategory();
        $scope.specialty.doctor = productService.getspecialty();
        $scope.user = Auth.user;
        console.log($scope.user);
        productService.addlocationdetails();
        $scope.zipcode = productService.getlocation();
        console.log($scope.zipcode);
        $scope.insurance.type = productService.getinsurance();
        console.log($scope.insurance.type);
        $scope.advanceSearchoptions = false;
        $scope.categories.options = SelectValueService.getCategoryJson();
        
        // $scope.doctorlists = [{"desc":"Choose a specialty","code":"-1"},{"desc":"Allergy & Immunology","code":"1"},{"desc":"Bariatric Surgery","code":"2"},{"desc":"Cardiology","code":"3"},{"desc":"Chiropractic Medicine","code":"4"},{"desc":"Dermatology","code":"5"},{"desc":"Developmental-Behavioral","code":"6"},{"desc":"Endocrinology & Metabolism","code":"7"},{"desc":"Family Practice","code":"8"},{"desc":"Gastroenterology","code":"9"},{"desc":"Gerontology","code":"10"},{"desc":"Gynecologic Oncology","code":"12"},{"desc":"Hematology/Oncology","code":"13"},{"desc":"Hospice & Palliative Medicine","code":"14"},{"desc":"Infectious Disease","code":"15"},{"desc":"Internal Medicine","code":"16"},{"desc":"Neonatology ","code":"17"},{"desc":"Nephrology","code":"18"},{"desc":"Neurology","code":"19"},{"desc":"Obstetrics/Gynecology","code":"20"},{"desc":"Occupational Medicine","code":"21"},{"desc":"Opthalmology","code":"22"},{"desc":"Optometry","code":"23"},{"desc":"Orthopedic Surgery","code":"24"},{"desc":"Otorhinolaryngology","code":"25"},{"desc":"Pain Management","code":"26"},{"desc":"Pediatric Otolaryngology","code":"28"},{"desc":"Pediatrics","code":"27"},{"desc":"Perinatology","code":"29"},{"desc":"Physical Medicine & Rehab","code":"30"},{"desc":"Physical Therapy","code":"31"},{"desc":"Plastic Surgery","code":"32"},{"desc":"Podiatry","code":"33"},{"desc":"Preventive Medicine ","code":"34"},{"desc":"Psychiatry","code":"35"},{"desc":"Psychology","code":"36"},{"desc":"Pulmonology ","code":"37"},{"desc":"Radiology","code":"38"},{"desc":"Reproductive Endocrinology/Infertility","code":"39"},{"desc":"Rheumatology","code":"40"},{"desc":"Sleep Medicine","code":"41"},{"desc":"Sports Medicine","code":"42"},{"desc":"Surgery, Colon & Rectal","code":"47"},{"desc":"Surgery, General","code":"43"},{"desc":"Surgery, Hand","code":"44"},{"desc":"Surgery, Thoracic","code":"45"},{"desc":"Surgery, Urology","code":"48"},{"desc":"Surgery, Vascular","code":"46"}]
        // $scope.variablefun = function(){
        //     for ( var i=0;i<$scope.findmaplocation.length;i++){
        //         var addressValue =  $scope.findmaplocation[i];
        //         // var addressValue = $scope.findmaplocation[i].address + "," + $scope.findmaplocation[i].city + ","+ $scope.findmaplocation[i].state+ "," + $scope.findmaplocation[i].zip;
        //         console.log(addressValue);
        //         $scope.codeAddress(addressValue);
        //     }
        // }
        $scope.specialty.options = SelectValueService.getDoctorsJson();
        $scope.dentistslists= {};
        $scope.dentistslists.options = SelectValueService.getdentistslists();
        $scope.chiropractors= {};
        $scope.chiropractors.options = SelectValueService.getchiropractors();
        $scope.otherSpeciality = {};
        $scope.otherSpeciality.options = SelectValueService.getotherSpeciality();
        $scope.gender= {};
        $scope.gender.options = [{gender:"male"},{gender:"female"}];
        $scope.language= {};
        $scope.vision = {};
        $scope.vision.options = SelectValueService.getvision();

        $scope.language.options = SelectValueService.getLangJson();
        $scope.insurance.options = SelectValueService.getinsuranceJson();
        $scope.openTab = function(address) {
            $scope.url = 'https://www.google.co.in/maps/preview?q='+address;
        };
        // $scope.specialtyValue = $scope.specialty.options[$scope.specialty.doctor];
        $scope.statuschecked = function(value) {
            return ((value=="booked") ? true : false);
        };
        var Selectedinsurance =  _.findWhere($scope.insurance.options, {key:$scope.insurance.type}) ;
        
        productService.addaddinsurance(Selectedinsurance.value)

        var SelectedSpeciality = ( _.findWhere($scope.specialty.options, {key:$scope.specialty.doctor} )
         || _.findWhere($scope.dentistslists.options, {key:$scope.specialty.doctor})
         || _.findWhere($scope.chiropractors.options, {key:$scope.specialty.doctor})
         || _.findWhere($scope.otherSpeciality.options, {key:$scope.specialty.doctor})  
         || _.findWhere($scope.vision.options, {key:$scope.specialty.doctor})
         ); 
        console.log(SelectedSpeciality);
        $scope.specialtyValue = SelectedSpeciality.value;
        console.log($scope.specialtyValue);
        $scope.bookingdate = [];
        var dayShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var date ;
        $scope.getdateCalender = function  () {
            $scope.bookingdate = [];
            date = new Date();
            $scope.getYearandDate = new Date(date);
            var dateStr = {dayShort: dayShort[date.getDay()], date: (date.getMonth() + 1)  + '/' +  date.getDate()};
            $scope.bookingdate.push(dateStr);
            
            console.log($scope.getYearandDate);
            date.setDate(date.getDate() + 1);
            dateStr = {dayShort: dayShort[date.getDay()], date: (date.getMonth() + 1)  + '/' + date.getDate()};
            $scope.bookingdate.push(dateStr);
            date.setDate(date.getDate() + 1);

            dateStr = {dayShort: dayShort[date.getDay()], date: (date.getMonth() + 1)  + '/' + date.getDate()};

            $scope.bookingdate.push(dateStr);

            $scope.indexValue =0;
        }
        $scope.getdateCalender();
        
        $scope.openNewTab = function(uri){
           
            var link = angular.element('<a href="http://' + uri + '" target="_blank"></a>');

            angular.element(document.body).append(link);

            link[0].click();
            link.remove();
        }

        $scope.nextslots = function(value){
           // console.log($scope.bookingdate); 
           console.log($scope.getYearandDate,"getYearandDate");


           var date = new Date($scope.getYearandDate);
           // console.log(date);
           // date.setDate(date.getDate() + 3);
           // console.log(new Date(date));

           console.log(date,"datevalue")
           $scope.bookingdate = [] ;
           if (value == 'prev'){
                date.setDate(date.getDate() - 3);
                date = new Date(date);
                console.log(date,"date");
                console.log(date.getDate(),"datevale");
                $scope.indexValue = $scope.indexValue - 1; 
                $scope.getYearandDate = new Date(date);
           }
           else{
               
                date.setDate(date.getDate() + 3);
                date = new Date(date);
                $scope.indexValue = $scope.indexValue + 1; 
                $scope.getYearandDate = new Date(date);
           }
            console.log(date,"dateloop");
            var dateStr = {dayShort: dayShort[date.getDay()], date: (date.getMonth() + 1)  + '/' +  date.getDate()};
            $scope.bookingdate.push(dateStr);
            
            console.log($scope.getYearandDate,"date")
            date.setDate(date.getDate() + 1);
            dateStr = {dayShort: dayShort[date.getDay()], date: (date.getMonth() + 1)  + '/' + date.getDate()};
            $scope.bookingdate.push(dateStr);
            date.setDate(date.getDate() + 1);
            dateStr = {dayShort: dayShort[date.getDay()], date: (date.getMonth() + 1)  + '/' + date.getDate()};
            $scope.bookingdate.push(dateStr);
            console.log($scope.bookingdate); 
            $scope.firstsearchoperation($scope.indexValue);
            console.log($scope.bookingdate,"bookingdate");
            //localhost:8000/v1/provider/search?zip=90002&specialty=cardiology&category=doctors&insurance=AArp&startindex=1
        }

        
        $scope.timeclicked = function(doctor, md_date, md_time,offer,desc) {
            var dayFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            console.log(md_date);

            if($scope.user.type === 'patient'){
                 var tempurl = '/v1/slotStatus?location='+doctor.locationId+'&email='+doctor.email+'&date='+md_date+'&slot='+md_time;
                console.log(tempurl);
                $http.get(tempurl)
                    .success(function(data, status, headers, config) {
                       console.log(data);
                    })
                    .error(function(data, status, headers, config) {
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
            productService.adddoctorEmailTemp(doctor.email);
            productService.adddoctordetails(doctor);
            productService.adddate_day_time(data);
            
        }
        $scope.bookappoinmentClicked = function (doctor) {
            productService.adddoctorEmailTemp(doctor);
        }

        
        $scope.findmaplocation = [];
        $scope.firstsearchoperation = function(indexValue) {
            productService.addcategory($scope.categories.type);
            productService.addspecialty($scope.specialty.doctor);
            productService.addinsurance($scope.insurance.type);
            productService.addlocation($scope.zipcode);
            var Selectedinsurance =  _.findWhere($scope.insurance.options, {key:$scope.insurance.type}) ;
        
            productService.addaddinsurance(Selectedinsurance.value)
            queryParams = "";
            if ($scope.categories.type) {
                queryParams += "category=" + $scope.categories.type;
            } else {
                queryParams + "category=doctors";
            }
            
            if ($scope.specialty.doctor) {
                queryParams += "&specialty=" + encodeURIComponent($scope.specialty.doctor);
            }
            if ($scope.insurance.type) {
                    queryParams += "&insurance=" + $scope.insurance.type
            }
            if ($scope.zipcode) {
                queryParams += "&zip=" + $scope.zipcode;
            }
            var temp = queryParams;
            if(indexValue != undefined){
                temp = queryParams + "&startindex=" + indexValue;
                console.log(temp);
            }
            console.log(temp);
            $http.get('v1/provider/search?' + temp)
                .success(function(data, status, headers, config) {
                    $scope.doctordetails = data;


                    $scope.dataAssign(data);
                    
                    console.log(data);
                    $scope.appointmentHideOrShow = [];
                    for(var i=0;i< data.providers.length;i++){
                        
                        $scope.appointmentHideOrShow[i]="true";
                        
                        for(var j=0;j<data.providers[i].appointmentSchedules.length;j++){
                            
                            for(var k=0;k<data.providers[i].appointmentSchedules[j].slots.length;k++){
                                    
                                    $scope.appointmentHideOrShow[i]="false";

                            }
                        }
                    }
                    for(var i=0;i< data.providers.length;i++){
                        var tempValue =  _.findWhere(SelectValueService.getcashPriceJson(), {key:data.providers[i].cash}) ;
                        if(tempValue){
                            $scope.doctordetails.providers[i].cash = tempValue.id;
                        }
                       
                        var tempValue =  _.findWhere(SelectValueService.getOfferJson(), {key:data.providers[i].offerStmt}) ;
                        // console.log(tempValue);
                        if(tempValue){
                            $scope.doctordetails.providers[i].offerStmt = tempValue.id;
                        } 
                        
                        // console.log($scope.doctordetails.providers[i].offerStmt);
                    }
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                    $scope.showMessage = true;
            });
        }
        $scope.firstsearchoperation();

        
        $scope.doctorBookApponimentClicked = function(email){
            productService.adddoctorEmailTemp(email);
        }

        $scope.searchoperation = function(){
            productService.addcategory($scope.categories.type);
            productService.addspecialty($scope.specialty.doctor);
            productService.addinsurance($scope.insurance.type);
            productService.addlocation($scope.zipcode);
            var Selectedinsurance =  _.findWhere($scope.insurance.options, {key:$scope.insurance.type}) ;
        
            productService.addaddinsurance(Selectedinsurance.value);

            var queryParams = "";  
            if ($scope.categories.type) {
                queryParams += "category=" + $scope.categories.type;
            } else {
                queryParams + "category=doctors";
            }
            if ($scope.specialty.doctor) {
                queryParams += "&specialty=" + encodeURIComponent($scope.specialty.doctor);
            }
            if ($scope.zipcode) {
                queryParams += "&zip=" + $scope.zipcode;
            }
            if ($scope.gender.doctor) {
                queryParams += "&gender=" + $scope.gender.doctor
            }
            if ($scope.insurance.type) {
                queryParams += "&insurance=" + $scope.insurance.type
            }
            if ($scope.language.doctor) {
                
                 var str = [];
                 var language = "";
                for (var key in $scope.language.doctor) {

                    
                    if(key == ($scope.language.doctor.length-1)){
                        language += '"' + $scope.language.doctor[key] + '"';
                    }
                    else if ($scope.language.doctor[key]) {
                        language += '"' + $scope.language.doctor[key] + '",';
                    }
                    console.log(language);
                }
                console.log();
                // console.log($scope.language.doctor);
                // console.log($scope.language.doctor.toString(),"To stirng");
                queryParams += "&languages=" + encodeURIComponent("["+language+"]") ;
                console.log(queryParams);
            }

            if ($scope.providername) {
                queryParams += "&name=" + $scope.providername;
            }

            $scope.showMessage = false;
            console.log("queryParams:" + queryParams);
            $http.get('v1/provider/search?' + queryParams)
                .success(function(data, status, headers, config) {
                    $scope.doctordetails = data;
                    console.log(data);
                    $scope.dataAssign(data);
                    $scope.getdateCalender();
                    console.log(data);
                    $scope.appointmentHideOrShow = [];
                    for(var i=0;i< data.providers.length;i++){
                        
                        $scope.appointmentHideOrShow[i]="true";
                        
                        for(var j=0;j<data.providers[i].appointmentSchedules.length;j++){
                            
                            for(var k=0;k<data.providers[i].appointmentSchedules[j].slots.length;k++){
                                    
                                    $scope.appointmentHideOrShow[i]="false";

                            }
                        }
                    }
                    $scope.showMessage = false;
                    for(var i=0;i< data.providers.length;i++){
                        var tempValue =  _.findWhere(SelectValueService.getcashPriceJson(), {key:data.providers[i].cash}) ;
                        if(tempValue){
                            $scope.doctordetails.providers[i].cash = tempValue.id;
                        }
                        
                        var tempValue =  _.findWhere(SelectValueService.getOfferJson(), {key:data.providers[i].offerStmt}) ;
                        // console.log(tempValue);
                        if(tempValue){
                            $scope.doctordetails.providers[i].offerStmt = tempValue.id;
                        }
                        
                        // console.log($scope.doctordetails.providers[i].offerStmt);
                        
                    }
                })
                .error(function(data, status, headers, config) {
                   if(data.message == "No exact matching"){
                    
                    $scope.doctordetails = [];
                    
                    console.log($scope.doctordetails);
                   }
                   $scope.showMessage = true;
                   console.log(data);
            });
        }
        // var geocoder;
        // var map;
        // var bounds = new google.maps.LatLngBounds();
        // $scope.initialize = function() {
        //   geocoder = new google.maps.Geocoder();
        // }
        

        // $scope.codeAddress = function (addressValue) {
        //     console.log(addressValue);
        //  var address = addressValue;
        //     geocoder.geocode({
        //         'address': address
        //     }, function(results, status) {
        //         if (status == google.maps.GeocoderStatus.OK) {
        //             var myOptions = {
        //                 zoom: 16,
        //                 center: results[0].geometry.location,
        //                 mapTypeId: google.maps.MapTypeId.ROADMAP
        //             }
        //             if(!map)    {
        //             map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);}

        //             var marker = new google.maps.Marker({
        //                 map: map,
        //                 position: results[0].geometry.location
        //             });
        //             console.log(marker.position);
        //             bounds.extend(marker.position);
        //             console.log(bounds);
        //             map.fitBounds(bounds);
        //              google.maps.event.addListener(marker,'mouseover',   ( function(marker) {
        //             return function() {
        //                var infowindow = new google.maps.InfoWindow();
        //               //  alert("hi");
        //                 var content = '<div class="map-content"><h6>' + address + '</h6> </div>';
        //               infowindow.setContent(content);
        //               infowindow.open(map, marker);
        //             }
        //           })(marker));
        //         } else {
        //           alert('Geocode was not successful for the following reason: ' + status);
        //         }
        //     });
        // }

        $scope.dataAssign = function(data){
            $scope.findmaplocation = data.providers;
            // $scope.findmaplocation = ["madurai","erode","dindukal"];
            
        }
        
        // $scope.initialize();



   

    $scope.initialize = function (value,arrayvalue) {
        console.log(arrayvalue);
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
      if(arrayvalue !== undefined){
        address = address = $scope.findmaplocation[arrayvalue].address + "," + $scope.findmaplocation[arrayvalue].city + ","+ $scope.findmaplocation[arrayvalue].state;
            
      }
      else{
        address = $scope.zipcode;
      }
        
        

      addMarkers(map, address, 0);
      // $scope.findmaplocation = ["pasumalai","villapuam","nilaiyur"];
      console.log($scope.findmaplocation);
      if(arrayvalue !== undefined){
            address = $scope.findmaplocation[arrayvalue].address + "," + $scope.findmaplocation[arrayvalue].city + ","+ $scope.findmaplocation[arrayvalue].state;
            infoText = "<html><div align=\"left\">" + address + "</div></html>";
            addMarkers(map,address, 1, (arrayvalue+1), infoText);
            console.log(address);
      }
      else{
        for ( var i=0;i<$scope.findmaplocation.length;i++){
            console.log($scope.findmaplocation[i].plan);
           address = $scope.findmaplocation[i].address + "," + $scope.findmaplocation[i].city + ","+ $scope.findmaplocation[i].state;
            infoText = "<html><div align=\"left\">" + address + "</div></html>";
            addMarkers(map,address, 1, (i+1), infoText,$scope.findmaplocation[i].plan);
            // console.log(address);
        }
      }
      
    }
    // $scope.initialize();



    
    function addMarkers(map, address, val, iconNo, infoText,plan) {
        
        if (geocoder) {
          geocoder.getLatLng(
            address,
            function(point) {
              if (!point) {
              //alert(address + " not found");
              } else {
                if(val == 0) {
                    map.setCenter(point, 8);
                } else {
                    var url = "images/GoogleMap/"+plan+"/pin" + (iconNo) + ".png";
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
