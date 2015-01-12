
mdtreeApp.controller('calcontroller',
 	function calcontroller($scope,productService,$state,$http,Auth,$timeout) {

 	$scope.dateTimeNow = function() {
	    $scope.date = new Date();
	  };
	  $scope.dateTimeNow();
	  
	  $scope.toggleMinDate = function() {
	    $scope.minDate = $scope.minDate ? null : new Date();
	  };
	   
	  // $scope.maxDate = new Date('2014-06-22');
	  // $scope.toggleMinDate();

	  // $scope.dateOptions = {
	  //   startingDay: 1
	  // };
	  
	  // Disable weekend selection
	  $scope.disabled = function(calendarDate, mode) {
	    return mode === 'day' && ( calendarDate.getDay() === 0 || calendarDate.getDay() === 6 );
	  };
	  
	  $scope.hourStep = 1;
	  $scope.minuteStep = 15;

	  $scope.timeOptions = {
	    hourStep: [1, 2, 3],
	    minuteStep: [1, 5, 10, 15, 25, 30]
	  };

	  $scope.showMeridian = true;
	  $scope.timeToggleMode = function() {
	    $scope.showMeridian = !$scope.showMeridian;
	  };
 		
 	

});
