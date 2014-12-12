
app.controller('givingDataController',function($scope, $rootScope, $http, $timeout, ROOT_URL, givingData){
	$scope.quickSearchData = {};
	$scope.quickSearchData.staffList = {};
	
	$http.get(ROOT_URL+'api/staff/').then(function(response){
		$scope.quickSearchData.staffList = response.data;
		console.log($scope.staffList);
	},$scope.handleError);

	$http.get(ROOT_URL+'api/widgets/').then(function(response){
		$scope.widgets = response.data;
		angular.forEach($scope.widgets, function(widgetData, index) {			
            var widgetElement = '#widget' + widgetData.id;
					   switch (widgetData.type) {
			                case 1:
			                    $scope.renderSearchWidgetNew(widgetData, index);
			                    break;
			                case 2:
			                    //renderDashboardStages(widgetElement, widget);
			                    break;
			                case 3:
			                    //renderMetricWidgetNew(widgetData, index);
			                    break;
			                case 4:
			                    //renderGrantListWidget(widgetElement, widget);
			                    break;
			                case 5:
			                    //renderOrgListWidget(widgetElement, widget);
			                    break;
			            }
		
    			});

	},$scope.handleError);

	//QuickSearch Data Bind
	$scope.renderSearchWidgetNew = function(widgetData, index) {		
		$scope.quickSearchData.title = widgetData.title;
		$scope.quickSearchData.description = widgetData.description;
		console.log($scope.quickSearchData.description);		
		$scope.quickSearchData.customStyle = {};
		$scope.quickSearchData.customStyle.borderColor = widgetData.borderColor;
		$scope.quickSearchData.customStyle.backgroundColor = widgetData.bgColor;
		$scope.quickSearchData.customStyle.foreColor = widgetData.foreColor;
	};
	$scope.handleError = function(errorResponse) {
		alert('The request could not be loaded.');
	}
});

