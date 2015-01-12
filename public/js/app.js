'use strict';

var mdtreeApp= angular.module('mdtreeApp', ['nvd3ChartDirectives','localytics.directives','underscore','ui.bootstrap.datetimepicker','ui.router','ui.bootstrap','ngCookies','ui.rCalendar','angularFileUpload']);




mdtreeApp.config(function($stateProvider,$urlRouterProvider,$locationProvider,$httpProvider,$parseProvider,$provide) {
     // return $parseProvider.unwrapPromises(true);
    var access = routingConfig.accessLevels;

    $provide.decorator('$uiViewScroll', function ($delegate) {
        return function (uiViewElement) {
          // var top = uiViewElement.getBoundingClientRect().top;
          // window.scrollTo(0, (top - 30));
          // Or some other custom behaviour...
        }; 
      });
 $stateProvider
        .state('public', {
            abstract: true,
            template: "<ui-view/>",
            data: {
                access: access.public
            }
        })
        .state('public.home', {
            url: '/',
        // templateUrl: 'partials/templates/footerstaticpages/howitsWork.html'
            templateUrl: 'partials/templates/home.html'
        })
        .state('public.search', {
            url: '/search',
            templateUrl: 'partials/templates/appointment-pages/search.html'
        })
        .state('public.doctorDetails', {
            url: '/provider-profile',
            templateUrl: 'partials/templates/appointment-pages/provider-Detailspage.html'
        })
        .state('public.appDetails', {
            url: '/AppointmentDetails',
            templateUrl: 'partials/templates/appointment-pages/AppoinmentDetails.html'
        })
        .state('public.appDetails2', {
            url: '/AppointmentDetails-2',
            templateUrl: 'partials/templates/appointment-pages/AppoinmentDetails2.html'
        })
        .state('public.cal', {
            url: '/cal',
            templateUrl: 'partials/templates/cal.html'
        })
        .state('public.howitsWork', {
            url: '/howitsWork',
            templateUrl: 'partials/templates/menuStaticPage/howitsWork.html'
        })

        .state('public.aboutus', {
            url: '/aboutus',
            templateUrl: 'partials/templates/menuStaticPage/aboutus.html'
        })

        .state('public.Providers', {
            url: '/Providers',
            templateUrl: 'partials/templates/menuStaticPage/Providers.html'
        })
//         .state('public.howtoSave', {
//             url: '/howtoSave',
//             templateUrl: 'partials/templates/menuStaticPage/howtoSave.html'
//         })

        .state('public.termsandCondition', {
            url: '/terms',
            templateUrl: 'partials/templates/terms.html'
        })
        .state('public.footer', {
            
            templateUrl: 'partials/templates/footerstaticpages/footerbase.html'
        })
        .state('public.footer.howtoSave', {
            url: '/howtoSave',
            templateUrl: 'partials/templates/footerstaticpages/howtoSave.html'
        })
        .state('public.footer.aboutus', {
            url: '/about',
            templateUrl: 'partials/templates/footerstaticpages/about.html'
        })
        .state('public.footer.contact', {
            url: '/contact',
            templateUrl: 'partials/templates/footerstaticpages/contact.html'
        })
        .state('public.footer.mdtreetv', {
            url: '/mdtreetv',
            templateUrl: 'partials/templates/footerstaticpages/mdtreetv.html'
        })
        .state('public.footer.privacypolicy', {
            url: '/privacypolicy',
            templateUrl: 'partials/templates/footerstaticpages/privacypolicy.html'
        })
        .state('public.footer.team', {
            url: '/team',
            templateUrl: 'partials/templates/footerstaticpages/team.html'
        })
        .state('public.footer.termsofuse', {
            url: '/termsofuse',
            templateUrl: 'partials/templates/footerstaticpages/termsofuse.html'
        })
         .state('public.footer.Providers', {
            url: '/Providers1',
            templateUrl: 'partials/templates/footerstaticpages/Providers.html'
        })
        .state('public.footer.howitsWork', {
            url: '/howitsWork1',
            templateUrl: 'partials/templates/footerstaticpages/howitsWork.html'
        })
        .state('public.temppassword', {
            url: '/temppassword',
            templateUrl: 'partials/templates/temppassword.html'
        })
        .state('public.imageupload', {
            url: '/imageupload',
            templateUrl: 'partials/templates/imageupload.html'
        });
        
        
    $stateProvider
        .state('anon', {
            abstract: true,
            template: "<ui-view/>",
            data: {
                access: access.anon
            }
        })
        
        .state('anon.appointment-signin', {
            url: '/appointment-signin',
            templateUrl: 'partials/templates/appointment-pages/appointment-signin.html'
        })
        .state('anon.login', {
            url: '/login',
            templateUrl: 'partials/templates/login.html'
        })
        .state('anon.patient-registration1', {
             url: '/provider-registration',
            templateUrl: 'partials/templates/patient-registration/patient-registration1.html'
        })
        .state('anon.provider-registrationcompleted', {
            url: '/provider-registrationcompleted',
            templateUrl: 'partials/templates/provider-registration/providerRegComplete.html'
        })
        .state('anon.forgetpassword', {
            url: '/forgetPassword',
            templateUrl: 'partials/templates/forgetpassword.html'
        })
        .state('anon.provider-registrationform', {
            url: '/registrationForm',
            templateUrl: 'partials/templates/provider-registration/providerregistrationform.html'
        });

    $stateProvider
        .state('user', {
            abstract: true,
            template: "<ui-view/>",
            data: {
                access: access.user
            }
        })
        .state('user.appointment-verify', {
            url: '/appointment-verify',
            templateUrl: 'partials/templates/appointment-pages/appointment-verify.html'
        })
        .state('user.appointment-complete', {
            url: '/appointment-complete',
            templateUrl: 'partials/templates/appointment-pages/appointment-complete.html'
        })
        .state('user.patient-registration2', {
            url: '/patient-registration2',
            templateUrl: 'partials/templates/patient-registration/patient-registration2.html'
        })
        .state('user.patient-dashboard', {
            templateUrl: 'partials/templates/patient-dashboard/patient-dashboard.html'
        })

        .state('user.patient-dashboard.step1', {
            url: '/step1',
            templateUrl: 'partials/templates/patient-dashboard/patient-dash3.html'
        })
        .state('user.patient-dashboard.step2', {
            url: '/step2',
            templateUrl: 'partials/templates/patient-dashboard/patient-dash2.html'
        })
        .state('user.patient-dashboard.step3', {
            url: '/step3',
            templateUrl: 'partials/templates/patient-dashboard/patient-dash1.html'
        })
        .state('user.patient-dashboard.step4', {
            url: '/step4',
            templateUrl: 'partials/templates/patient-dashboard/patient-dash4.html'
        })
        .state('user.provider-dashboard', {
            templateUrl: 'partials/templates/provider-dashboard/provider-dashboard.html'
        })
        .state('user.provider-dashboard.step1', {
            url: '/provider-daily',
            templateUrl: 'partials/templates/provider-dashboard/provider-dailyView.html'
        })
        .state('user.provider-dashboard.step2', {
            url: '/provider-weekly',
            templateUrl: 'partials/templates/provider-dashboard/provider-WeeklyView.html'
        })
        .state('user.provider-dashboard.step3', {
            url: '/provider-Create',
            templateUrl: 'partials/templates/provider-dashboard/provider-CreateAppoinment.html'
        })
        .state('user.provider-dashboard.step4', {
            url: '/provider-Offers',
            templateUrl: 'partials/templates/provider-dashboard/provider-SpecialOffers.html'
        })
        .state('user.provider-dashboard.step5', {
            url: '/provider-Schedule',
            templateUrl: 'partials/templates/provider-dashboard/provider-Schedule.html'
        })
        .state('user.provider-edit', {
            templateUrl: 'partials/templates/provider-dashboard/provider-profileEdit.html'
        })
        .state('user.provider-edit.step1', {
            url: '/provider-edit1',
            templateUrl: 'partials/templates/provider-dashboard/provider-EditPersonal.html'
        })
        .state('user.provider-edit.step2', {
            url: '/provider-edit2',
            templateUrl: 'partials/templates/provider-dashboard/provider-EditLocation.html'
        })
        .state('user.provider-edit.step3', {
            url: '/provider-edit3',
            templateUrl: 'partials/templates/provider-dashboard/provider-Accreditation.html'
        })
        .state('user.reportpage', {
            url: '/report',
            templateUrl: 'partials/templates/report.html'
        })
        .state('user.offerreport', {
            url: '/offerreport',
            templateUrl: 'partials/templates/provider-dashboard/offerreport.html'
        });
        $stateProvider
        .state('salesAdmin', {
            abstract: true,
            template: "<ui-view/>",
            data: {
                access: access.salesAdmin
            }
        })

        .state('salesAdmin.dashboard', {
//             url: '/provider-registration3',
            templateUrl: 'partials/templates/adminPages/adminBase.html'
        })

//         .state('admin.dashboard.providerinfo.newprovider', {
//             url: '/newprovider',
//             templateUrl: 'partials/templates/adminPages/newprovider.html'
//         })
        .state('salesAdmin.provider-edit', {
            templateUrl: 'partials/templates/provider-dashboard/provider-profileEdit.html'
        })
        .state('salesAdmin.provider-registration', {
            templateUrl: 'partials/templates/provider-registration/provider-registration.html'
        })
        .state('salesAdmin.provider-registration.step1', {
            url: '/provider-registration1',
            templateUrl: 'partials/templates/provider-registration/provider-registration1.html'
        })
        .state('salesAdmin.provider-registration.step2', {
            url: '/provider-registration2',
            templateUrl: 'partials/templates/provider-registration/provider-registration2.html'
        })
        .state('salesAdmin.provider-registration.step3', {
            url: '/provider-registration3',
            templateUrl: 'partials/templates/provider-registration/provider-registration3.html'
        })
        
        .state('salesAdmin.dashboard.providerinfo', {
            templateUrl: 'partials/templates/adminPages/providerinfo.html'
        })

        .state('salesAdmin.dashboard.providerinfo.newprovider', {
        
            templateUrl: 'partials/templates/adminPages/newprovider.html'
        })
        .state('salesAdmin.dashboard.providerinfo.newprovider.step1', {
            url: '/providerregistration1',
            templateUrl: 'partials/templates/provider-registration/provider-registration1.html'
        })
        .state('salesAdmin.dashboard.providerinfo.newprovider.step2', {
            url: '/providerregistration2',
            templateUrl: 'partials/templates/provider-registration/provider-registration2.html'
        })
        .state('salesAdmin.dashboard.providerinfo.newprovider.step3', {
            url: '/providerregistration3',
            templateUrl: 'partials/templates/provider-registration/provider-registration3.html'
        })
        .state('salesAdmin.dashboard.providerinfo.newprovider.step4', {
            url: '/providerregistration4',
            templateUrl: 'partials/templates/provider-registration/provider-registration4.html'
        })
        .state('salesAdmin.dashboard.providerinfo.editprovider', {
            templateUrl: 'partials/templates/adminPages/editprovider.html'
        })

        .state('salesAdmin.dashboard.providerinfo.editprovider.step1', {
            url: '/admin-provider-edit1',
            templateUrl: 'partials/templates/provider-dashboard/provider-EditPersonal.html'
        })
        .state('salesAdmin.dashboard.providerinfo.editprovider.step2', {
            url: '/admin-provider-edit2',
            templateUrl: 'partials/templates/provider-dashboard/provider-EditLocation.html'
        })
        .state('salesAdmin.dashboard.providerinfo.editprovider.step3', {
            url: '/admin-provider-edit3',
            templateUrl: 'partials/templates/provider-dashboard/provider-Accreditation.html'
        })
        
        
        .state('salesAdmin.provider-edit.step1', {
            url: '/provider-edit1',
            templateUrl: 'partials/templates/provider-dashboard/provider-EditPersonal.html'
        })
        .state('salesAdmin.provider-edit.step2', {
            url: '/provider-edit2',
            templateUrl: 'partials/templates/provider-dashboard/provider-EditLocation.html'
        })
        .state('salesAdmin.provider-edit.step3', {
            url: '/provider-edit3',
            templateUrl: 'partials/templates/provider-dashboard/provider-Accreditation.html'
        })
        .state('salesAdmin.provider-registration.step4', {
            url: '/provider-registration4',
            templateUrl: 'partials/templates/provider-registration/provider-registration4.html'
        });

     $stateProvider
        .state('salesManagerAdmin', {
            abstract: true,
            template: "<ui-view/>",
            data: {
                access: access.salesManagerAdmin
            }
        })
        .state('salesManagerAdmin.dashboard', {
            templateUrl: 'partials/templates/adminPages/adminBase.html'
        })
        .state('salesManagerAdmin.dashboard.adminRoles', {
            url: '/adminRoles',
            templateUrl: 'partials/templates/adminPages/adminRoles.html'
        });




        
     $stateProvider
        .state('admin', {
            abstract: true,
            template: "<ui-view/>",
            data: {
                access: access.admin
            }
        })
        .state('admin.dashboard.converting', {
            url: '/converting',
            templateUrl: 'partials/templates/adminPages/converting.html'
        })
        .state('admin.dashboard', {
            templateUrl: 'partials/templates/adminPages/adminBase.html'
        })

        .state('admin.dashboard.hitanalysis', {
            url: '/hitanalysis',
            templateUrl: 'partials/templates/adminPages/hitAnalysis.html'
        })
        .state('admin.dashboard.reportAll', {
            url: '/reportAll',
            templateUrl: 'partials/templates/adminPages/reportAll.html'
        })
        .state('admin.dashboard.adminRoles', {
            url: '/adminRoles',
            templateUrl: 'partials/templates/adminPages/adminRoles.html'
        });
//         .state('admin.provider-registration', {
//             templateUrl: 'partials/templates/provider-registration/provider-registration.html'
//         })
//         .state('admin.provider-registration.step1', {
//             url: '/provider-registration1',
//             templateUrl: 'partials/templates/provider-registration/provider-registration1.html'
//         })
//         .state('admin.provider-registration.step2', {
//             url: '/provider-registration2',
//             templateUrl: 'partials/templates/provider-registration/provider-registration2.html'
//         })
//         .state('admin.provider-registration.step3', {
//             url: '/provider-registration3',
//             templateUrl: 'partials/templates/provider-registration/provider-registration3.html'
//         })
        
//         .state('admin.dashboard.providerinfo', {
//             templateUrl: 'partials/templates/adminPages/providerinfo.html'
//         })

//         .state('admin.dashboard.providerinfo.newprovider', {
        
//             templateUrl: 'partials/templates/adminPages/newprovider.html'
//         })
//         .state('admin.dashboard.providerinfo.newprovider.step1', {
//             url: '/providerregistration1',
//             templateUrl: 'partials/templates/provider-registration/provider-registration1.html'
//         })
//         .state('admin.dashboard.providerinfo.newprovider.step2', {
//             url: '/providerregistration2',
//             templateUrl: 'partials/templates/provider-registration/provider-registration2.html'
//         })
//         .state('admin.dashboard.providerinfo.newprovider.step3', {
//             url: '/providerregistration3',
//             templateUrl: 'partials/templates/provider-registration/provider-registration3.html'
//         })
//         .state('admin.dashboard.providerinfo.newprovider.step4', {
//             url: '/providerregistration4',
//             templateUrl: 'partials/templates/provider-registration/provider-registration4.html'
//         })
//         .state('admin.dashboard.providerinfo.editprovider', {
//             templateUrl: 'partials/templates/adminPages/editprovider.html'
//         })

//         .state('admin.dashboard.providerinfo.editprovider.step1', {
//             url: '/admin-provider-edit1',
//             templateUrl: 'partials/templates/provider-dashboard/provider-EditPersonal.html'
//         })
//         .state('admin.dashboard.providerinfo.editprovider.step2', {
//             url: '/admin-provider-edit2',
//             templateUrl: 'partials/templates/provider-dashboard/provider-EditLocation.html'
//         })
//         .state('admin.dashboard.providerinfo.editprovider.step3', {
//             url: '/admin-provider-edit3',
//             templateUrl: 'partials/templates/provider-dashboard/provider-Accreditation.html'
//         })
        
        
//         .state('admin.provider-edit.step1', {
//             url: '/provider-edit1',
//             templateUrl: 'partials/templates/provider-dashboard/provider-EditPersonal.html'
//         })
//         .state('admin.provider-edit.step2', {
//             url: '/provider-edit2',
//             templateUrl: 'partials/templates/provider-dashboard/provider-EditLocation.html'
//         })
//         .state('admin.provider-edit.step3', {
//             url: '/provider-edit3',
//             templateUrl: 'partials/templates/provider-dashboard/provider-Accreditation.html'
//         })
//         .state('admin.provider-registration.step4', {
//             url: '/provider-registration4',
//             templateUrl: 'partials/templates/provider-registration/provider-registration4.html'
//         });
        

        
    $urlRouterProvider.otherwise('/');


    

    // FIX for trailing slashes. Gracefully "borrowed" from https://github.com/angular-ui/ui-router/issues/50
    $urlRouterProvider.rule(function($injector, $location) {
        
        if($location.protocol() === 'file')
            return;

        var path = $location.path()
        // Note: misnomer. This returns a query object, not a search string
            , search = $location.search()
            , params
            ;

        // check to see if the path already ends in '/'
        if (path[path.length - 1] === '/') {

            return;
        }

        // If there was no search string / query params, return with a `/`
        if (Object.keys(search).length === 0) {

            return path + '/';
        }

        // Otherwise build the search string and return a `/?` prefix
        params = [];
        angular.forEach(search, function(v, k){

            params.push(k + '=' + v);
        });
        return path + '/?' + params.join('&');
    });

    $locationProvider.html5Mode(true);

    $httpProvider.interceptors.push(function($q, $location) {
        return {
            'responseError': function(response) {
                if(response.status === 401 || response.status === 403) {
                    // $location.path('/login');
                }
                return $q.reject(response);
            }
        };
    });

});        

 


// mdtreeApp.controller('logincontroller', function  logincontroller($scope,$state,productService){
//     $scope.login=false;
//     $scope.register = false;
//     $scope.loginprocess = function(){
//         productService.addname($scope.username);
//         $state.transitionTo("public.appointment-verify",{
//               },{
//                 reload: true,
//                 notify: true
//             });
//     }
//     $scope.changeuser = function(){
//         $scope.login = false;
//         $scope.register = true;
//     }
//     $scope.changeicon = function(){
//         $scope.login = true;
//         $scope.register = false;
//     }

// });


     




// mdtreeApp.run(['$rootScope', '$state', 'Auth', function ($rootScope, $state, Auth) {

//     $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        
//         // if(!("data.access" in toState)){
//         //     console.log(("data.access" in toState));
//         //     console.log(toState);
//         //     $rootScope.error = "Access undefined for this state";
//         //     event.preventDefault();
//         // }
//         // else 
//         if (!Auth.authorize(toState.data.access)) {
//             $rootScope.error = "Seems like you tried accessing a route you don't have access to...";
//             event.preventDefault();

//             if(fromState.url === '^') {
//                 if(Auth.isLoggedIn()) {
//                     $state.go('public.home');
//                 } else {
//                     $rootScope.error = null;
//                     $state.go('anon.login');
//                 }
//             }
//         }
//     });
mdtreeApp.
run(['$rootScope', '$state', 'Auth', function ($rootScope, $state, Auth) {

    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        if (!Auth.authorize(toState.data.access)) {
            // $rootScope.error = "Seems like you tried accessing a route you don't have access to...";
            event.preventDefault();
            
            if(fromState.url === '^') {
                if(Auth.isLoggedIn()) {
                    $state.go('public.search')
                } else {
                    $rootScope.error = null;
                    $state.go('anon.login');
                }
            }
        }
    });

}]);





