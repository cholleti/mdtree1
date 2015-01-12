mdtreeApp.controller('AnalysisController',function AnalysisController($scope,$timeout,productService,$state,$http,Auth){

  $scope.width = 500;
    $scope.height = 500;

    $scope.xFunction = function() {

      return function(d) {
     
        // console.log(d);
        return d.key;
      };
    }
    $scope.yFunction = function() {
      return function(d) {
         // console.log(d,"y");
        return d.total;
      };
    }

        $scope.hitAnalysisData = function(check){
          if(check === 'zip'){
            var url = '/v1/hitAnalysis'
          }else{
            var url = '/v1/providerAnalysis'
          }
          
          
          $http.get(url).success(function(data){  
                console.log(data);
                  $scope.piechart =  [{
                    "key":"mdtree",
                    "values":data.hitAnalysis

                      }

                   ];
                   $scope.exampleData = data.hitAnalysis[0][2].providers;
                    console.log($scope.piechart);
                  // }]];
                

            }).error(function(data, status, headers, config) {
              $scope.serverError = data.message;
          })
        }
        $scope.hitAnalysisData('zip');
        $scope.options = 'zip';
        


             var flag ;

      $scope.$on('elementClick.directive', function(angularEvent, event){
        console.log(event);
        // $scope.otherFunction(event,$scope.exampleData)
            $scope.$apply(function(){
                $scope.exampleData = event.point[2].providers;
                console.log($scope.exampleData);
            });
      });
      var colorArray1 = ['#e11858'];
        $scope.colorFunction1 = function() {
          return function(d, i) {
            console.log(d);
              return colorArray1[i];
          };
        }
       var colorArray2 = ['#009da2']; 
       $scope.colorFunction2 = function() {
          return function(d, i) {
            console.log(d);
              return colorArray2[i];
          };
        }
        $scope.changeFunction = function(options){
          

          // $scope.piechart = JSON.parse(JSON.stringify($scope.piechartss[$scope.options]));
          // alert("hai")
          // console.log( $scope.piechart[0].values[0][2].Providers);
          // $scope.exampleData = JSON.parse(JSON.stringify($scope.piechart[0].values[0][2].Providers));
        }

});