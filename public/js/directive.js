'use strict';

mdtreeApp.directive('accessLevel', ['Auth', function(Auth) {
    
    return {
        restrict: 'A',
        link: function($scope, element, attrs) {
            var prevDisp = element.css('display')
                , userRole
                , accessLevel;

            $scope.user = Auth.user;
            $scope.$watch('user', function(user) {
                if(user.role)
                    userRole = user.role;
                updateCSS();
            }, true);

            attrs.$observe('accessLevel', function(al) {
                if(al) accessLevel = $scope.$eval(al);
                updateCSS();
            });

            function updateCSS() {
                if(userRole && accessLevel) {
                    if(!Auth.authorize(accessLevel, userRole))
                        element.css('display', 'none');
                    else
                        element.css('display', prevDisp);
                }
            }
        }
    };
}]);

mdtreeApp.filter('capitalize', function() {
    return function(input, scope) {
        return input.substring(0,1).toUpperCase()+input.substring(1);
    }
});
mdtreeApp.directive('activeNav', ['$location', function($location) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var anchor = element[0];
            if(element[0].tagName.toUpperCase() != 'A')
                anchor = element.find('a')[0];
            var path = anchor.href;

            scope.location = $location;
            scope.$watch('location.absUrl()', function(newPath) {
                path = normalizeUrl(path);
                newPath = normalizeUrl(newPath);

                if(path === newPath ||
                    (attrs.activeNav === 'nestedTop' && newPath.indexOf(path) === 0)) {
                    element.addClass('active');
                } else {
                    element.removeClass('active');
                }
            });
        }

    };

    function normalizeUrl(url) {
        if(url[url.length - 1] !== '/')
            url = url + '/';
        return url;
    }

}]);
// see gist: https://gist.github.com/aberke/042eef0f37dba1138f9e



mdtreeApp.directive('phonenumberDirective', ['$filter', function($filter) {
    function link(scope, element, attributes) {
 
      // scope.inputValue is the value of input element used in template
      scope.inputValue = scope.phonenumberModel;
 
      scope.$watch('inputValue', function(value, oldValue) {
        
        value = String(value);
        var number = value.replace(/[^0-9]+/g, '');
        scope.phonenumberModel = number;
        scope.inputValue = $filter('phonenumber')(number);
      });
    }
    
    return {
      link: link,
      restrict: 'E',
      scope: {
        phonenumberPlaceholder: '=placeholder',
        phonenumberModel: '=model',
      },
      //templateUrl: '/static/phonenumberModule/template.html',
      template: '<input ng-model="inputValue" class="inputtext" type="tel" class="phonenumber" ng-required="true" placeholder="{{phonenumberPlaceholder}}" title="Phonenumber (Format: (999) 9999-9999)"  >',
    };

    // function link(scope, element, attributes) {
 
    //   // scope.inputValue is the value of input element used in template
    //   scope.inputValue = scope.phonenumberModel;
 
    //   scope.$watch('inputValue', function(value, oldValue) {
        
    //     value = String(value);
    //     var number = value.replace(/[^0-9]+/g, '');
    //     scope.phonenumberModel = number;
    //     scope.inputValue = $filter('phonenumber')(number);
    //   });
    // }
    
    // return {
    //   link: link,
    //   restrict: 'E',
    //   scope: {
    //     phonenumberPlaceholder: '=placeholder',
    //     phonenumberModel: '=model',
    //   },
    //   //templateUrl: '/static/phonenumberModule/template.html',
    //   // template: '<input ng-model="inputValue" class="inputtext" type="tel" class="phonenumber" ng-required="true" placeholder="{{phonenumberPlaceholder}}" title="Phonenumber (Format: (999) 9999-9999)">',
    // };
  }])
 
  mdtreeApp.filter('phonenumber', function() {
      /* 
      Format phonenumber as: c (xxx) xxx-xxxx
        or as close as possible if phonenumber length is not 10
        if c is not '1' (country code not USA), does not use country code
      */
      
      return function (number) {
        /* 
        @param {Number | String} number - Number that will be formatted as telephone number
        Returns formatted number: (###) ###-####
          if number.length < 4: ###
          else if number.length < 7: (###) ###
 
        Does not handle country codes that are not '1' (USA)
        */
          if (!number) { return ''; }
 
          number = String(number);
 
          // Will return formattedNumber. 
          // If phonenumber isn't longer than an area code, just show number
          var formattedNumber = number;
 
      // if the first character is '1', strip it out and add it back
      var c = (number[0] == '1') ? '1 ' : '';
      number = number[0] == '1' ? number.slice(1) : number;
 
      // # (###) ###-#### as c (area) front-end
      var area = number.substring(0,3);
      var front = number.substring(3, 6);
      var end = number.substring(6, 10);
 
      if (front) {
        formattedNumber = (c + "(" + area + ") " + front);  
      }
      if (end) {
        formattedNumber += ("-" + end);
      }
      return formattedNumber;
      };
  });


mdtreeApp.directive('myDatepicker', function ($parse) {
    return function (scope, element, attrs, controller) {
        var ngModel = $parse(attrs.ngModel);
        $(function(){
            element.datepicker({
                showOn: "button",
                  buttonImage: "images/calender2.png",
                  buttonImageOnly: true,
                changeYear:true,
                changeMonth:true,
                dateFormat:'mm-dd-yy',
                maxDate: new Date(),
                yearRange: '1940',
                beforeShow: function(input, inst) {
                       $('#ui-datepicker-div').removeClass('monthyear');
                       $('#ui-datepicker-div').removeClass('year');
                       $('#ui-datepicker-div').removeClass('month');
                    },
                onSelect:function (dateText, inst) {
                    scope.$apply(function(scope){
                        // Change binded variable
                        ngModel.assign(scope, dateText);
                    });
                }
            });
        });
    }
});
mdtreeApp.directive('enablefuturedate', function ($parse) {
    return function (scope, element, attrs, controller) {
        var ngModel = $parse(attrs.ngModel);
        $(function(){
            element.datepicker({
                showOn:"both",
                dateFormat:'mm-dd-yy',
                minDate: new Date(),
                yearRange: '1940',
                beforeShow: function(input, inst) {
                       $('#ui-datepicker-div').removeClass('monthyear');
                       $('#ui-datepicker-div').removeClass('year');
                       $('#ui-datepicker-div').removeClass('month');
                    },
                onSelect:function (dateText, inst) {
                    scope.$apply(function(scope){
                        // Change binded variable
                        ngModel.assign(scope, dateText);
                    });
                }
            });
        });
    }
});
mdtreeApp.directive('createslotstartdate', function ($parse,$http,Auth) {
    return function (scope, element, attrs, controller) {

        var ngModel = $parse(attrs.ngModel);
          $http.get('/v1/slottedDate?email='+Auth.user.email)
            .success(function(data, status, headers, config) {
                
                // console.log("slottedDate",data.slotCreatedDates);
                var valueodData = data.slotCreatedDates;
                var array = valueodData;
               // $scope.dateArrayCreated = data.slot.slots;
            
            $(function(){
                element.datepicker({
                    showOn: "button",
                      buttonImage: "images/calender2.png",
                      buttonImageOnly: true,
                    // showOn:"both",
                    dateFormat:'mm-dd-yy',
                    minDate: new Date(),
                    yearRange: '1940',
                    beforeShowDay:function(date){
                        var string = jQuery.datepicker.formatDate('mm-dd-yy', date);
                        return [  array.indexOf(string) == -1 ] 
                    },
                    beforeShow: function(input, inst) {
                       $('#ui-datepicker-div').removeClass('monthyear');
                       $('#ui-datepicker-div').removeClass('year');
                       $('#ui-datepicker-div').removeClass('month');
                    },
                    onSelect:function (dateText, inst) {
                        scope.$apply(function(scope){

                            var startDate = scope.formData.dt;
                            var minDate = scope.formData.dt;
                            // createslotdateenddate('option', 'minDate', minDate);
                            // Change binded variable
                            ngModel.assign(scope, dateText);
                        });
                    }
                }).attr('readonly', 'readonly');
            });
        });
    }
});
mdtreeApp.directive('createslotdateenddate', function ($parse,$http,Auth) {
    return function (scope, element, attrs, controller) {
        var ngModel = $parse(attrs.ngModel);
                element.datepicker({
                  // showButtonPanel: true,
                      showOn: "button",
                      buttonImage: "images/calender2.png",
                      buttonImageOnly: true,
                    dateFormat:'mm-dd-yy',
                    // maxDate: new Date(),
                    yearRange: '1940',
                    beforeShow: function(input, inst) {
                       $('#ui-datepicker-div').removeClass('monthyear');
                       $('#ui-datepicker-div').removeClass('year');
                       $('#ui-datepicker-div').removeClass('month');
                    },
                    onSelect:function (dateText, inst) {
                        console.log(scope);
                       

                        scope.$apply(function(scope){
                            // Change binded variable
                            ngModel.assign(scope, dateText);
                        });
                         scope.dateChange(scope.formData);
                    }
                }).attr('readonly', 'readonly');
          
    }
});
mdtreeApp.directive('createslotdatemonth', function ($parse,$http,Auth) {
    return function (scope, element, attrs, controller) {
        var ngModel = $parse(attrs.ngModel);
                element.datepicker({
                  showButtonPanel: true,
                      showOn: "button",
                      buttonImage: "images/calender2.png",
                      buttonImageOnly: true,
                    dateFormat:'mm',
                    yearRange: '1940',
                    changeMonth: true,
                    onClose: function(dateText, inst) { 
                        var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
                        
                        scope.monthChange(month);
                        // var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
                        $(this).datepicker('setDate', new Date(1,month, 1));
                        
                    },
                    beforeShow: function(input, inst) {
                       $('#ui-datepicker-div').removeClass('year');
                            $('#ui-datepicker-div').removeClass('monthyear').addClass('month');
                    },
                    onSelect:function (dateText, inst) {
                        
                        scope.$apply(function(scope){
                            // Change binded variable
                            ngModel.assign(scope, dateText);
                        });

                        
                    }
                }).attr('readonly', 'readonly');
    }
});
mdtreeApp.directive('createslotdateyear', function ($parse,$http,Auth) {
    return function (scope, element, attrs, controller) {
        var ngModel = $parse(attrs.ngModel);
                element.datepicker({
                    showButtonPanel: true,
                      showOn: "button",
                      buttonImage: "images/calender2.png",
                      buttonImageOnly: true,
                    dateFormat:'yy',
                    maxDate: new Date(),
                    yearRange: '1940',
                    changeYear: true,
                    onClose: function(dateText, inst) { 
                        // var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
                        var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
                        $(this).datepicker('setDate', new Date(year,1, 1));
                        scope.yearChange(year);
                    },
                    beforeShow: function(input, inst) {
                       $('#ui-datepicker-div').removeClass('month');
                            $('#ui-datepicker-div').removeClass('monthyear').addClass('year');
                    },
                    onSelect:function (dateText, inst) {
                       
                        scope.$apply(function(scope){
                            // Change binded variable
                            ngModel.assign(scope, dateText);
                        });
                         
                    }
              }).attr('readonly', 'readonly');
    }
});
mdtreeApp.directive('createslotdatemonthyear', function ($parse,$http,Auth) {
    return function (scope, element, attrs, controller) {
        var ngModel = $parse(attrs.ngModel);
                element.datepicker({
                  showButtonPanel: true,
                      showOn: "button",
                      buttonImage: "images/calender2.png",
                      buttonImageOnly: true,
                    dateFormat:'mm-yy',
                    maxDate: new Date(),
                    yearRange: '1940',
                    changeMonth: true,
                    changeYear: true,
                    changeDate:false,
                    onClose: function(dateText, inst) { 
                        var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
                        var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
                        $(this).datepicker('setDate', new Date(year,month, 1));
                        scope.monthyearChange(year,month);
                    },
                    beforeShow: function(input, inst) {
                            $('#ui-datepicker-div').removeClass('month');
                            $('#ui-datepicker-div').removeClass('year').addClass('monthyear');
                    },
                    onSelect:function (dateText, inst) {
                       
                        scope.$apply(function(scope){
                            // Change binded variable
                            ngModel.assign(scope, dateText);
                        });
                         
                    }
                }).attr('readonly', 'readonly');
    }
});
mdtreeApp.directive('modifyslotdate', function ($parse,$http,Auth) {
        
    return function (scope, element, attrs, controller) {
        var ngModel = $parse(attrs.ngModel);
          $http.get('/v1/slottedDate?email='+Auth.user.email)
            .success(function(data, status, headers, config) {
                
                // console.log("slottedDate",data.slotCreatedDates);
                var valueodData = data.slotCreatedDates;

                var array = valueodData ;
                console.log(data.slotCreatedDates.length);
               // $scope.dateArrayCreated = data.slot.slots;
            
            $(function(){
                element.datepicker({
                    showOn: "button",
                  buttonImage: "images/calender2.png",
                  buttonImageOnly: true,
                    // showOn:"both",
                    dateFormat:'mm-dd-yy',
                    minDate: new Date(),
                    yearRange: '1940',
                    beforeShowDay:function(date){
                        var string = jQuery.datepicker.formatDate('mm-dd-yy', date);
                        console.log(!(array.indexOf(string) == -1));
                        return [  !(array.indexOf(string) == -1) ] 
                    },
                    beforeShow: function(input, inst) {
                       $('#ui-datepicker-div').removeClass('monthyear');
                       $('#ui-datepicker-div').removeClass('year');
                       $('#ui-datepicker-div').removeClass('month');
                    },
                    onSelect:function (dateText, inst) {
                        scope.$apply(function(scope){

                            var startDate = scope.formData.dt;
                            var minDate = scope.formData.dt;
                            // createslotdateenddate('option', 'minDate', minDate);
                            // Change binded variable
                            ngModel.assign(scope, dateText);
                        });
                    }
                }).attr('readonly', 'readonly');
            });
        });
       

      }
    
});

mdtreeApp.directive('viewslotsview', function ($parse) {
    return function (scope, element, attrs, controller) {
        var ngModel = $parse(attrs.ngModel);
        $(function(){
            element.datepicker({
                showOn:"both",
                dateFormat:'mm-dd-yy',
                yearRange: '1940',
                beforeShow: function(input, inst) {
                       $('#ui-datepicker-div').removeClass('monthyear');
                       $('#ui-datepicker-div').removeClass('year');
                       $('#ui-datepicker-div').removeClass('month');
                    },
                onSelect:function (dateText, inst) {
                    scope.$apply(function(scope){
                        // Change binded variable
                        ngModel.assign(scope, dateText);
                    });
                }
            });
        });
    }
});


mdtreeApp.directive('numbersOnly', function(){
   return {
     require: 'ngModel',
     link: function(scope, element, attrs, modelCtrl) {
       modelCtrl.$parsers.push(function (inputValue) {
           // this next if is necessary for when using ng-required on your input. 
           // In such cases, when a letter is typed first, this parser will be called
           // again, and the 2nd time, the value will be undefined
           if (inputValue == undefined) return '' 
           var transformedInput = inputValue.replace(/[^0-9]/g, ''); 
           if (transformedInput!=inputValue) {
              modelCtrl.$setViewValue(transformedInput);
              modelCtrl.$render();
           }         

           return transformedInput;         
       });
     }
   };
});

mdtreeApp.filter('tel', function () {
    return function (tel) {
        if (!tel) { return ''; }

        var value = tel.toString().trim().replace(/^\+/, '');

        if (value.match(/[^0-9]/)) {
            return tel;
        }

        var country, city, number;

        switch (value.length) {
            case 10: // +1PPP####### -> C (PPP) ###-####
                country = 1;
                city = value.slice(0, 3);
                number = value.slice(3);
                break;

            case 11: // +CPPP####### -> CCC (PP) ###-####
                country = value[0];
                city = value.slice(1, 4);
                number = value.slice(4);
                break;

            case 12: // +CCCPP####### -> CCC (PP) ###-####
                country = value.slice(0, 3);
                city = value.slice(3, 5);
                number = value.slice(5);
                break;

            default:
                return tel;
        }

        if (country == 1) {
            country = "";
        }

        number = number.slice(0, 3) + '-' + number.slice(3);

        return (country + " (" + city + ") " + number).trim();
    };
});

