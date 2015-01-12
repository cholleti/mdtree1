mdtreeApp.controller('ReportAllctrl',function ReportAllctrl($scope,$timeout,productService,$state,$http,Auth){

    $scope.changeView = function(value){
      $scope.selectedOption = value;
      $scope.appointment = null;
      $scope.lineChartData = [];
            $scope.piechart = [];

    }

    $scope.changeView('date');
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
         // console.log(d,"y")
        return d.total;
      };
    }
    $scope.dateChange = function(formData){
      console.log(formData);
      if(formData.form && formData.to ){
        var url ='/v1/onBoard?fromDate='+formData.form+'&toDate='+formData.to;
        var urlTypeBased ='/v1/onBoardType?fromDate='+formData.form+'&toDate='+formData.to;
        $scope.getDataFromServer(url);
        $scope.getDataFromServerTypeBased(urlTypeBased);
        
      }
      
    }
    $scope.monthChange = function(month){
      month=  Number(month) +1 ;
      console.log(month);
      var url ='/v1/onBoard?year='+new Date().getFullYear()+'&month='+month;
       var urlTypeBased ='/v1/onBoardType?year='+new Date().getFullYear()+'&month='+month;
      $scope.getDataFromServer(url);
      $scope.getDataFromServerTypeBased(urlTypeBased);
    }
    $scope.yearChange = function(year){
      console.log(year);
      var url ='/v1/onBoard?year='+year;
      var urlTypeBased ='/v1/onBoardType?year='+year;
      $scope.getDataFromServer(url);
      $scope.getDataFromServerTypeBased(urlTypeBased);
    }
    $scope.monthyearChange = function(year,month){
      month= Number(month) +1;
      var url ='/v1/onBoard?year='+year+'&month='+month;
      var urlTypeBased ='/v1/onBoardType?year='+year+'&month='+month;
      
      $scope.getDataFromServer(url);
      $scope.getDataFromServerTypeBased(urlTypeBased);
    }
    $scope.getDataFromServer = function(url){
      console.log(url);
      $http.get(url).success(function(data){  
        if(data.report.total){
          $scope.lineChartData = [data.report];
          
        } else{
          $scope.lineChartData = [];
        }

        console.log(data);
      }).error(function(data, status, headers, config) {
        console.log(data);
      });
    }
    $scope.getDataFromServerTypeBased = function(url){
      console.log(url);

      $http.get(url).success(function(data){ 
      if(data.report.total){
          $scope.piechart = [data.report];
           $scope.otherFunction({index:0},$scope.piechart);
          
        } else{
          $scope.piechart = [];
        } 
        
       
        console.log(data);

        
        
      }).error(function(data, status, headers, config) {
        console.log(data);
      });
    }


      $scope.$on('elementClick.directive', function(angularEvent, event){
        
        $scope.otherFunction(event,$scope.piechart);

      });
      $scope.otherFunction = function(event,exampleData){
          
          var data ;
            
          data = exampleData;
          
          $scope.singleColor = function(){
               for(var i =0;i< data.length;i++){
                  data[i].disabled = true
                }
                
                data[event.index].disabled = false;
                data[event.index].disablevalue = false;
               
            }
            if(data[event.index].disablevalue == undefined){
              $scope.singleColor();
            }
            else{
              
                if((data[event.index].disabled) || (data[event.index].disablevalue)){
                  $scope.singleColor();
                }
                else{

                  for(var i =0;i< data.length;i++){
                    data[i].disabled = false;
                  }
                  data[event.index].disablevalue = true;
                }
            }
             $scope.exampleData = data;
            // $scope.$apply(function(){
            //     $scope.exampleData = data;
            // });

          }
        $scope.xAxisTickFormat = function(){
                return function(d){
                    return d3.time.format('%m/%d/%y')(new Date(d));  //uncomment for date format
                }
            }
      // $scope.otherFunction(event,0);
      // $scope.changeMoth = function(index){
      //     $scope.piechart = JSON.parse(JSON.stringify($scope.exampleDatass[index]));
      //     $scope.exampleData = JSON.parse(JSON.stringify($scope.exampleDatass[index]));
      // }
      // $scope.changeMoth(0);
      $scope.options = 0;
});