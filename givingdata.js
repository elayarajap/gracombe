app.factory("givingData",['$http','ROOT_URL','$filter','$rootScope',
	function($http,ROOT_URL,$filter,$rootScope) {


	var givingData = {};

	givingData.loadData = function(api_url) {
		$http.get(ROOT_URL + api_url).then(saveToStorage,handleNetworkError); 
	};
	 
	saveToStorage = function(response) {
	    $rootScope.$broadcast('serverResponse', {response:response.data});
	};
	
	givingData.loadStaffData = function() {
		$http.get(ROOT_URL + 'api/staff/').then(saveToStaffStorage,handleNetworkError); 
	};
	 
	saveToStaffStorage = function(response) {
		var data = response.data;
		console.log(JSON.stringify(data))
	    //localStorage.setItem("staffData",JSON.stringify(data));
	};

	// givingData.loadMetricsData = function() {
	// 	$http.get(ROOT_URL + 'api/widgets/?metrics=OrgsRecievedGrants,DeclinationRate&parameters=FiscalYearRange|5').then(saveToMetricStorage,handleNetworkError); 
	// };

	// saveToMetricStorage = function(response) {
	// 	var data = response.data;
	//     localStorage.setItem("metricData",JSON.stringify(data));

	// };

	handleNetworkError = function(response) {
		//handler for network related errors here
		document.addEventListener("deviceready", function() {
			nativeNotificationFactory.showToast('No Internet Connection !', nativeNotificationFactory.longToast);
		}, false);
	};

	return givingData;  
}]); 

//http://redesign.givingdata.com/api/widgets/
//http://redesign.givingdata.com/api/staff/
//http://redesign.givingdata.com/api//widgets/?metrics=OrgsRecievedGrants,DeclinationRate&parameters=FiscalYearRange|5
//http://redesign.givingdata.com/api/requests/?dispositionType=Approved&requestTypes=&organizations=&pageIndex=0&pageSize=5&orderBy=DispositionDate&orderDesc=true
//http://redesign.givingdata.com/api//widgets/?metrics=GrantsApprovedYTD&parameters=
//http://redesign.givingdata.com/api/fiscalYears/?containsDate=12/10/2014%2011:12:01%20AM
//http://redesign.givingdata.com/api/widgets/orgsummary/?dispositionType=Approved&requestTypes=&organizations=&pageIndex=0&pageSize=5&orderBy=Request.GrantAmount&orderDesc=true
//http://redesign.givingdata.com/api/dashboards/1/stageallocations?fiscalYearId=18&cashflow=true&l1Id=&l2AttribId=&requestTypes=&organizations=

