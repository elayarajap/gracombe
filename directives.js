app.directive('widgetSearch',function($timeout,$http,ROOT_URL){
	return {
		restrict: 'EA',
		link: function(scope,element,attr){			 
			$timeout(function(){



				renderSearchWidgetNew = function(element, widget) {
				    var widgetHtml = '<div class="title"><div class="capstone" style="color:' + widget.foreColor + ';">' + widget.title + '</div></div>';
					widgetHtml += '<div class="content"><input id="widget-search" class="form-control widget-autocomplete" type="text" name="widget-search" placeholder="Search" />';
		            widgetHtml += '<div class="text"><p>' + widget.description + '</p></div></div>';
				    $(element).html(widgetHtml);
				    var staffHtml = '<div class="content"><div class="text"><p class="staff-search">Or view grants by staff person.</p></div><select id="widget-staff-search" class="form-control" name="widget-staff-search"><option value="">Select a Staff Person</option></select></div>';
        			$(element).append(staffHtml);

        			$http.get(ROOT_URL + 'api/staff/').then(function(result){
					 staffData = result.data;
						 angular.forEach(staffData, function(value, key) {	
						  if (value.sourceTypeId != 1) {
			                var fullName = value.firstName;
			                if (value.lastName != null) fullName += ' ' + value.lastName;
			                $('#widget-staff-search').append($('<option>').val(value.id).text(fullName));
				           }
						});
        			}); 

				} 

				renderMetricWidgetNew = function(metricResponse, index){
      			
      			 var dataEndpoint = metricResponse.dataEndpoint + '&parameters=';
     			for (var c = 0; c < metricResponse.configs.length; c++) {
         			if (c > 0) dataEndpoint += ';';
         			dataEndpoint += metricResponse.configs[c].key + '|' + metricResponse.configs[c].value;
     			}
                //var paymentDate = scope.mydate = $filter('date')(new Date(),"yyyy/mm/dd hh:mm:ss a", 'UTC')
      			$http.get(ROOT_URL+"/api/"+dataEndpoint).then(function(response){					

      				var widgetData = response.data;
					var widgetHtml = '<div class="content"><h1>' + metricResponse.title + '</h1>' + metricResponse.description + "</div>";
					 for (var m = 0; m < widgetData.metrics.length; m++) {
			            for (var t = 0; t < widgetData.metrics[m].textReplacements.length; t++) {
			                widgetHtml = widgetHtml.replace(widgetData.metrics[m].textReplacements[t].key, widgetData.metrics[m].textReplacements[t].value);
			            }
			            widgetHtml = widgetHtml.replace('[' + widgetData.metrics[m].name + '.Amount]', currencyFormat('', widgetData.metrics[m].amount, 0, true));
			            widgetHtml = widgetHtml.replace('[' + widgetData.metrics[m].name + '.Count]', currencyFormat('', widgetData.metrics[m].count, 0, true));
			        }

					$('.widgetLayout'+index+'> div').html(widgetHtml);
				  },
				  function(errorResponse){
				    console.log('error'+errorResponse);
				  });
      		};

        		
				angular.forEach(scope.widgets, function(value, key) {
        			//console.log('key ==> '+key+' - '+value.type);
        			$('.widgetLayout'+key).css({'width':'400px', 'height':'350px', 'background-color': value.bgColor, 'color': value.foreColor, 'border-color': value.borderColor, 'border-style':'solid', 'border-size':'10px'});

					//$('.widgetLayout'+key+'> div').html(value.description);
					var widget = value;
            		var widgetElement = '#widget' + widget.id;
					   switch (widget.type) {
			                case 1:
			                    renderSearchWidgetNew(widgetElement, widget);
			                    break;
			                case 2:
			                    //renderDashboardStages(widgetElement, widget);
			                    break;
			                case 3:
			                    renderMetricWidgetNew(value, key);
			                    break;
			                case 4:
			                    //renderGrantListWidget(widgetElement, widget);
			                    break;
			                case 5:
			                    //renderOrgListWidget(widgetElement, widget);
			                    break;
			            }
		
    			});


				$('#widget-staff-search').change(function () {
		            var staffId = $(this).val();
		            if (staffId != null && staffId != '') {
		                var searchUrl = '/search/default.aspx?Staff=' + staffId; // + '&DispositionType=1,2';
		                window.location.href = searchUrl;
		            }
		        }); 

		        enableSearch("#widget-search");

    			 

      		}, 1000);
		}

		


	};
});