app.controller('givingDataController',function($scope, $rootScope, $http, $timeout,$filter, ROOT_URL, givingData){
	$scope.quickSearchData = {};
	$scope.quickSearchData.staffList = {};
	$scope.yearAtGlance = {};
	$scope.yearAtGlance.fiscalYearId = "";
	$scope.yearAtGlance.fiscalYear = "";
	
	$http.get(ROOT_URL+'api/staff/').then(function(response){
		$scope.quickSearchData.staffList = response.data;
		
	},$scope.handleError);

	var paymentDate = $scope.mydate = $filter('date')(new Date(),"yyyy/MM/dd hh:mm:ss a", 'UTC')

	$http.get(ROOT_URL+'api/fiscalYears/?containsDate='+paymentDate).then(function(response) {
		 $scope.yearAtGlance.fiscalYearId = response.data.id;
		 $scope.yearAtGlance.fiscalYear = response.data.year;
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
			                    $scope.renderDashboardStagesNew(widgetData, index);
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
		$scope.quickSearchData.customStyle = {};
		$scope.quickSearchData.customStyle.borderColor = widgetData.borderColor;
		$scope.quickSearchData.customStyle.backgroundColor = widgetData.bgColor;
		$scope.quickSearchData.customStyle.foreColor = widgetData.foreColor;
		$scope.$apply(function() {		
			$scope.quickSearchData.staffList;
		});			
		
	};

	//Year at a Glance Bind
	$scope.renderDashboardStagesNew = function(widgetData, index){
		$scope.yearAtGlance.title = widgetData.title;
		$scope.yearAtGlance.description = widgetData.description;		
		$scope.yearAtGlance.customStyle = {};
		$scope.yearAtGlance.customStyle.borderColor = widgetData.borderColor;
		$scope.yearAtGlance.customStyle.backgroundColor = widgetData.bgColor;
		$scope.yearAtGlance.customStyle.foreColor = widgetData.foreColor;

        //get stage allocations
        var dashboardId = 0;
        var cashflow = "false";
        var l1Id = 0;
        var l2AttribId = 0;
        var requestTypes = '';
        var organizations = '';		

		angular.forEach(widgetData.configs, function(widgetConfig, index) {

			console.log(widgetConfig.key);

			switch (widgetConfig.key.toLowerCase()) {
                case "cashflow":
                    cashflow = widgetConfig.value;
                    break;
                case "dashboardid":
                    dashboardId = widgetConfig.value;
                    break;
                case "l1id":
                    l1Id = widgetConfig.value;
                    break;
                case "l2attribid":
                    l2AttribId = widgetConfig.value;
                    break;
                case "requesttypes":
                    requestTypes = widgetConfig.value;
                    break;
                case "organizations":
                    organizations = widgetConfig.value;
            }
		});

		$http.get(ROOT_URL+'api/dashboards/'+dashboardId+'/stageallocations?fiscalYearId=' + $scope.yearAtGlance.fiscalYearId + '&cashflow=' + cashflow + '&l1Id=' + (l1Id || '') + '&l2AttribId=' + (l2AttribId || '')
                + '&requestTypes=' + (requestTypes || '') + "&organizations=" + (organizations || '')).then(function(response) {
                console.log(response.data);
				$scope.yearAtGlance.dataList = response.data;
		},$scope.handleError);

		

		// $scope.$apply(function() {	

		// });


		
	};


	$scope.handleError = function(errorResponse) {
		alert('The request could not be loaded.');
	}

});

