
var widgetErrorElement = '';

function widgetErrorHandler(jqXHR, textStatus, errorThrown, errorElement) {
    var errorMsg = 'Widget error';
    if (textStatus != null) {
        errorMsg += ': ' + textStatus;
    }
    if (errorThrown != null) {
        if (errorMsg == 'Widget error')
            errorMsg += ': ';
        else
            errorMsg += ' ';
        errorMsg += errorThrown;
    }
    if (errorElement == null) errorElement = widgetErrorElement;
    $(errorElement).html(errorMsg);
}

function loadWidgets(widgetContainer, numCols) {

    /* setup page-level service error handler */
    widgetErrorElement = widgetContainer;

    /* setup data services */
    widgetService.setErrorHandler(widgetErrorHandler);
    fiscalYearService.setErrorHandler(widgetErrorHandler);
    dashboardService.setErrorHandler(widgetErrorHandler);
    staffService.setErrorHandler(widgetErrorHandler);

    widgetService.getAll(function(widgetData) {

        $("#widgets-ajax-progress").hide();

        if (widgetData == null || widgetData.length == 0) return;

        //loadup empty divs
        var columnCounter = 1;
        for (var w = 0; w < widgetData.length; w++) {
            var widgetColumn = "#widget-col" + columnCounter;
            $(widgetColumn).append(renderWidgetContainer(widgetData[w]));
            columnCounter++;
            if (columnCounter > numCols) columnCounter = 1;
        }

        //now get actual content
        for (w in widgetData) {

            var widget = widgetData[w];
            var widgetElement = '#widget' + widget.id;
            switch (widget.type) {
                case 1:
                    renderSearchWidget(widgetElement, widget);
                    break;
                case 2:
                    renderDashboardStages(widgetElement, widget);
                    break;
                case 3:
                    renderMetricWidget(widgetElement, widget);
                    break;
                case 4:
                    renderGrantListWidget(widgetElement, widget);
                    break;
                case 5:
                    renderOrgListWidget(widgetElement, widget);
                    break;
            }
        }

    });
}

function renderWidgetContainer(widget) {
    return '<div id="widget' + widget.id + '" class="widget shadow border-radius widget-border" style="border-color:' + widget.borderColor + ' !important; background-color:' + widget.bgColor + '; color:' + widget.foreColor + ';"><div class="ajax-progress"></div></div>';
}

function renderSearchWidget(element, widget) {
    var widgetHtml = '<div class="title"><div class="capstone" style="color:' + widget.foreColor + ';">' + widget.title + '</div></div>';
    widgetHtml += '<div class="content"><input id="widget-search" class="form-control widget-autocomplete" type="text" name="widget-search" placeholder="Search" />';
    widgetHtml += '<div class="text"><p>' + widget.description + '</p></div></div>';
    $(element).html(widgetHtml);
    staffService.getAll(function(staffData) {
        var staffHtml = '<div class="content"><div class="text"><p class="staff-search">Or view grants by staff person.</p></div><select id="widget-staff-search" class="form-control" name="widget-staff-search"><option value="">Select a Staff Person</option></select></div>';
        $(element).append(staffHtml);
       
        for (s in staffData) {
            if (staffData[s].sourceTypeId != 1) {
                var fullName = staffData[s].firstName;
                if (staffData[s].lastName != null) fullName += ' ' + staffData[s].lastName;
                $('#widget-staff-search').append($('<option>').val(staffData[s].id).text(fullName));
            }
        }
        $('#widget-staff-search').change(function () {
            var staffId = $(this).val();
            if (staffId != null && staffId != '') {
                var searchUrl = '/search/default.aspx?Staff=' + staffId; // + '&DispositionType=1,2';
                window.location.href = searchUrl;
            }
        });

    }, function (jqXHR, textStatus, errorThrown) {
        widgetErrorHandler(jqXHR, textStatus, errorThrown, element);
    });//getAll
    
    enableSearch("#widget-search");

}

 function renderMetricWidget(element, widget) {

     var dataEndpoint = widget.dataEndpoint + '&parameters=';
     for (var c = 0; c < widget.configs.length; c++) {
         if (c > 0) dataEndpoint += ';';
         dataEndpoint += widget.configs[c].key + '|' + widget.configs[c].value;
     }
     
     widgetService.getMetrics(dataEndpoint, function(widgetData) {
         var widgetHtml = '<div class="content"><h1>' + widget.title + '</h1>' + widget.description + "</div>";
        
        for (var m = 0; m < widgetData.metrics.length; m++) {
            for (var t = 0; t < widgetData.metrics[m].textReplacements.length; t++) {
                widgetHtml = widgetHtml.replace(widgetData.metrics[m].textReplacements[t].key, widgetData.metrics[m].textReplacements[t].value);
            }
            widgetHtml = widgetHtml.replace('[' + widgetData.metrics[m].name + '.Amount]', currencyFormat('', widgetData.metrics[m].amount, 0, true));
            widgetHtml = widgetHtml.replace('[' + widgetData.metrics[m].name + '.Count]', currencyFormat('', widgetData.metrics[m].count, 0, true));
        }
         
        $(element).addClass("widget-single-metric");
        $(element).html(widgetHtml);
     }, function (jqXHR, textStatus, errorThrown) {
        widgetErrorHandler(jqXHR, textStatus, errorThrown, element);
    });//getSingleMetric
}

 function renderDashboardStages(element, widget) {
     
    //get current fiscal year
    fiscalYearService.getFiscalYearContainingDate(gdConfig.serverDate, function (fiscalYearData) {
        var fiscalYearId = fiscalYearData.id;
        //get stage allocations
        var dashboardId = 0;
        var cashflow = "false";
        var l1Id = 0;
        var l2AttribId = 0;
        var requestTypes = '';
        var organizations = '';
        for (var c = 0; c < widget.configs.length; c++) {
            switch (widget.configs[c].key.toLowerCase()) {
                case "cashflow":
                    cashflow = widget.configs[c].value;
                    break;
                case "dashboardid":
                    dashboardId = widget.configs[c].value;
                    break;
                case "l1id":
                    l1Id = widget.configs[c].value;
                    break;
                case "l2attribid":
                    l2AttribId = widget.configs[c].value;
                    break;
                case "requesttypes":
                    requestTypes = widget.configs[c].value;
                    break;
                case "organizations":
                    organizations = widget.configs[c].value;
            }
        }
        dashboardService.getStageAllocations(dashboardId, fiscalYearId, cashflow, l1Id, l2AttribId, requestTypes, organizations, function (stages) {
            var widgetHtml = '';
            widgetHtml += '<div class="title"><div class="capstone" style="color:' + widget.foreColor + ';">' + widget.title + ' (' + fiscalYearData.year + ')</div></div>';
            widgetHtml += '<div class="content"><table class="table-base table-bordered table-small dashboard table-no-stripe"><tbody>';
            

            $(stages).each(function () {
                var headClass = 'stageheader stage stagetype' + dashboardId + '_' + this.typeId + ' stagetype' + this.typeId + ' stage' + this.id;
                var cellClass = 'stagetype' + dashboardId + '_' + this.typeId + ' stagetype' + this.typeId + ' stage' + this.id;
                if (this.id == -1) {
                    headClass = headClass + ' subtotal';
                    cellClass = cellClass + ' subtotal';
                }
                widgetHtml = widgetHtml + '<tr><td class="' + headClass + '" align="right">' + this.name + '</td>';
                widgetHtml = widgetHtml + '<td class="' + cellClass + '" align="right" style="width: 193px;">' + currencyFormat('', this.amount, 0, true) + '</td></tr>';
            });

            widgetHtml = widgetHtml + '</tbody></table>';
            widgetHtml += '<i>' + widget.description + '</i></div>';

            $(element).html(widgetHtml);
        }, function (jqXHR, textStatus, errorThrown) {
            widgetErrorHandler(jqXHR, textStatus, errorThrown, element);
        }); //getStageAllocations

    }, function (jqXHR, textStatus, errorThrown) {
        widgetErrorHandler(jqXHR, textStatus, errorThrown, element);
    }); //getFiscalYearContainingDate
    
 }

 function renderGrantListWidget(element, widget) {
     var dispositionType = 'Approved';
     var pageIndex = 0;
     var pageSize = 5;
     var orderBy = 'DispositionDate';
     var orderDesc = 'true';
     var requestTypes = '';
     var organizations = '';
     
     for (var c = 0; c < widget.configs.length; c++) {
         if (widget.configs[c].key.toLowerCase() == 'dispositiontype') dispositionType = widget.configs[c].value;
         if (widget.configs[c].key.toLowerCase() == 'pagecount') pageSize = widget.configs[c].value;
         if (widget.configs[c].key.toLowerCase() == 'pageindex') pageIndex = widget.configs[c].value;
         if (widget.configs[c].key.toLowerCase() == 'orderby') orderBy = widget.configs[c].value;
         if (widget.configs[c].key.toLowerCase() == 'orderdesc') orderDesc = widget.configs[c].value;
         if (widget.configs[c].key.toLowerCase() == 'requesttypes') requestTypes = widget.configs[c].value;
         if (widget.configs[c].key.toLowerCase() == 'organizations') organizations = widget.configs[c].value;
     }

     requestService.getList(dispositionType, requestTypes, organizations, pageIndex, pageSize, orderBy, orderDesc, function (widgetData) {
         var widgetHtml = '<div class="title"><div class="capstone" style="color:' + widget.foreColor + ';">' + widget.title + '</div></div>';
         widgetHtml += '<div class="content">';
         if (widget.description != null && widget.description != '') {
             widgetHtml += '<div class="text"><p>' + widget.description + '</p></div>';
         }
         if (widgetData.length > 0) {
             widgetHtml += '<ul>';
             for (var r = 0; r < widgetData.length; r++) {
                 var amt = dispositionType == 'Pending' ? widgetData[r].pendingAmount : widgetData[r].grantAmount;
                 var dt = dispositionType == 'Pending' ? widgetData[r].pendingData : widgetData[r].dispositionDate;
                 widgetHtml += '<li><strong>' + widgetData[r].organization.name + '</strong> </br> ' + currencyFormat('$', amt, 0, true) + ' on ' + moment(dt).format("MMM Do YYYY") + '</li>';
                 
             }
             widgetHtml += '</ul>';
         } else {
             widgetHtml += '<span class="widget-no-data">No matching records found.</span>';
         }
         widgetHtml += '</div>';
         $(element).addClass("widget-grant-list");
         $(element).html(widgetHtml);
     }, function (jqXHR, textStatus, errorThrown) {
         widgetErrorHandler(jqXHR, textStatus, errorThrown, element);
     });//getSingleMetric
 }

 function renderOrgListWidget(element, widget) {
     var dispositionType = 'Approved';
     var pageIndex = 0;
     var pageSize = 5;
     var orderBy = 'Request.GrantAmount';
     var orderDesc = 'true';
     var requestTypes = '';
     var organizations = '';

     for (var c = 0; c < widget.configs.length; c++) {
         if (widget.configs[c].key.toLowerCase() == 'dispositiontype') dispositionType = widget.configs[c].value;
         if (widget.configs[c].key.toLowerCase() == 'pagecount') pageSize = widget.configs[c].value;
         if (widget.configs[c].key.toLowerCase() == 'pageindex') pageIndex = widget.configs[c].value;
         if (widget.configs[c].key.toLowerCase() == 'orderby') orderBy = widget.configs[c].value;
         if (widget.configs[c].key.toLowerCase() == 'orderdesc') orderDesc = widget.configs[c].value;
         if (widget.configs[c].key.toLowerCase() == 'requesttypes') requestTypes = widget.configs[c].value;
         if (widget.configs[c].key.toLowerCase() == 'organizations') organizations = widget.configs[c].value;
     }

     widgetService.getOrgSummaryList(dispositionType, requestTypes, organizations, pageIndex, pageSize, orderBy, orderDesc, function (widgetData) {
         var widgetHtml = '<div class="title"><div class="capstone" style="color:' + widget.foreColor + ';">' + widget.title + '</div></div>';
         widgetHtml += '<div class="content">';
         if (widget.description != null && widget.description != '') {
             widgetHtml += '<div class="text"><p>' + widget.description + '</p></div>';
         }
         if (widgetData.length > 0) {
             widgetHtml += '<ul>';
             for (var r = 0; r < widgetData.length; r++) {
                 widgetHtml += '<li><strong>' + widgetData[r].organization.name + '</strong> </br>' + currencyFormat('$', widgetData[r].total, 0, true) + '</li>';
             }
             widgetHtml += '</ul>';
         } else {
             widgetHtml += '<span class="widget-no-data">No matching records found.</span>';
         }
         widgetHtml += '</div>';
         $(element).addClass("widget-org-list");
         $(element).html(widgetHtml);
     }, function (jqXHR, textStatus, errorThrown) {
         widgetErrorHandler(jqXHR, textStatus, errorThrown, element);
     });//getSingleMetric
 }

 function enableStaffSearch(inputElement, position) {
     //staff autocomplete
     $(inputElement).autocomplete({
         position: position,
         source: function (request, response) {
             $.ajax({
                 url: autoCompleteUrl,
                 dataType: "json",
                 contentType: "application/json; charset=utf-8",
                 data: {
                     searchArea: 'S',
                     maxRows: 10,
                     searchTerm: request.term
                 },
                 success: function (data) {
                     response($.map(data.suggestions, function (item) {
                         return { data: item.value, value: item.name };
                     }));
                 }, error: function (XMLHttpRequest, textStatus, errorThrown) { alert(textStatus); }
             });
         },
         dataType: 'json', minLength: 2, cache: false,
         select: function (event, ui) {
             if (ui.item) {
                 var staffId = ui.item.data;
                 this.value = ui.item.value;
                 var searchUrl = '/search/default.aspx?Staff=' + staffId; // + '&DispositionType=1,2';
                 window.location.href = searchUrl;
             }
             return false;
         }
     });

 }