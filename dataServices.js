/* Global Ajax error handler */

function ajaxServiceErrorHandler(jqXHR, textStatus, errorThrown) {
    var errorMsg = 'Service Error';
    if (textStatus != null) {
        errorMsg += ': ' + textStatus;
    }
    if (errorThrown != null) {
        if (errorMsg == 'Service Error')
            errorMsg += ': ';
        else
            errorMsg += ' ';
        errorMsg += errorThrown;
    }
    if (typeof showErrorMsg == 'function') {
        showErrorMsg(errorMsg);
    } else {
        alert(errorMsg);
    }
}

/* Fiscal Year service */

var fiscalYearService = new function () {
    var serviceBase = gdConfig.jsonApiUrl + 'fiscalYears/',
    errorHandler = null,
    setErrorHandler = function (callback) {
        errorHandler = callback;
    },
    raiseAjaxError = function (jqXHR, textStatus, errorThrown, errorCallback) {
        if (errorCallback != null) {
            errorCallback(jqXHR, textStatus, errorThrown);
        }
        else if (errorHandler != null) {
            errorHandler(jqXHR, textStatus, errorThrown);
        } else {
            ajaxServiceErrorHandler(jqXHR, textStatus, errorThrown);
        }
    },
    handleErrorCode = function(defaultMsg, errorData, errorCallback) {
        var status = defaultMsg;
        var response = '';
        if (errorData != null) {
            status = errorData.statusText;
            response = errorData.responseText;
        }
        raiseAjaxError(null, status, response, errorCallback);
    },
    getFiscalYearById = function (fiscalYearId, callback) {
        $.getJSON(serviceBase + 'GetAccount', { acctNumber: acctNumber },
          function (data) {
              callback(data);
          });
    },
	getFiscalYearContainingDate = function (paymentDate, callback, errorCallback) {
	    $.ajax({
	        type: "GET",
	        url: serviceBase + '?containsDate=' + paymentDate,
	        dataType: "json",
	        //contentType: "application/json; charset=utf-8",
	        error: function (jqXHR, textStatus, errorThrown) {
	            raiseAjaxError(jqXHR, textStatus, errorThrown, errorCallback);
	        },
	        statusCode: {
	            200: function (data) { //authenticated
	            },
	            401: function (data) { //users needs to login first
	                window.location.reload(true);
	            },
	            404: function (data) {
	                handleErrorCode('The fiscal year was not found.', data, errorCallback);
	            }
	        },
	        success: function (data) {
	            if (data == null) {
	                raiseAjaxError(null, null, 'The fiscal year was not found.', errorCallback);
	            } else {
	                callback(data);
	            }
	        }
	    });

	    /*var fiscalYear = { "FiscalYearId": 1 };
	    callback(fiscalYear);*/

	};
    return {
        setErrorHandler: setErrorHandler,
        getFiscalYearById: getFiscalYearById,
        getFiscalYearContainingDate: getFiscalYearContainingDate
    };

}();

/* Dashboard Service */

var dashboardService = new function () {
    var serviceBase = gdConfig.jsonApiUrl + 'dashboards/',
    errorHandler = null,
    setErrorHandler = function (callback) {
        errorHandler = callback;
    },
    raiseAjaxError = function (jqXHR, textStatus, errorThrown, errorCallback) {
        if (errorCallback != null) {
            errorCallback(jqXHR, textStatus, errorThrown);
        }
        else if (errorHandler != null) {
            errorHandler(jqXHR, textStatus, errorThrown);
        } else {
            ajaxServiceErrorHandler(jqXHR, textStatus, errorThrown);
        }
    },
    handleErrorCode = function(defaultMsg, errorData, errorCallback) {
        var status = defaultMsg;
        var response = '';
        if (errorData != null) {
            status = errorData.statusText;
            response = errorData.responseText;
        }
        raiseAjaxError(null, status, response, errorCallback);
    },
    getStageAllocations = function (dashboardId, fiscalYearId, cashflow, l1Id, attribId, requestTypes, organizations, callback, errorCallback) {
        //ajax call 
        if (cashflow == null) cashflow = true;
        $.ajax({
            type: "GET",
            url: serviceBase + dashboardId + '/stageallocations?fiscalYearId=' + fiscalYearId + '&cashflow=' + cashflow + '&l1Id=' + (l1Id || '') + '&l2AttribId=' + (attribId || '')
                + '&requestTypes=' + (requestTypes || '') + "&organizations=" + (organizations || ''),
            dataType: "json",
            //contentType: "application/json; charset=utf-8",
            error: function (jqXHR, textStatus, errorThrown) {
                raiseAjaxError(jqXHR, textStatus, errorThrown, errorCallback);
            },
            statusCode: {
                200: function (data) { //authenticated
                },
                401: function (data) { //users needs to login first
                    window.location.reload(true);
                },
                404: function (data) {
                    handleErrorCode('The stage allocations could not be loaded.', data, errorCallback);
                }
            },
            success: function (data) {
                callback(data);
            }
        });
    };
    return {
        setErrorHandler: setErrorHandler,
        getStageAllocations: getStageAllocations
    };

}();

/* Request Service */

var requestService = new function () {
    var serviceBase = gdConfig.jsonApiUrl + 'requests/',
    errorHandler = null,
    setErrorHandler = function (callback) {
        errorHandler = callback;
    },
    raiseAjaxError = function (jqXHR, textStatus, errorThrown, errorCallback) {
        if (errorCallback != null) {
            errorCallback(jqXHR, textStatus, errorThrown);
        }
        else if (errorHandler != null) {
            errorHandler(jqXHR, textStatus, errorThrown);
        } else {
            ajaxServiceErrorHandler(jqXHR, textStatus, errorThrown);
        }
    },
    handleErrorCode = function(defaultMsg, errorData, errorCallback) {
        var status = defaultMsg;
        var response = '';
        if (errorData != null) {
            status = errorData.statusText;
            response = errorData.responseText;
        }
        raiseAjaxError(null, status, response, errorCallback);
    },
    getById = function (requestId, callback, errorCallback) {
        //ajax call 
        $.ajax({
            type: "GET",
            url: serviceBase + requestId,
            dataType: "json",
            //contentType: "application/json; charset=utf-8",
            error: function (jqXHR, textStatus, errorThrown) {
                raiseAjaxError(jqXHR, textStatus, errorThrown, errorCallback);
            },
            statusCode: {
                200: function (data) { //authenticated
                },
                401: function (data) { //users needs to login first
                    window.location.reload(true);
                },
                404: function (data) {
                   handleErrorCode('The request could not be loaded.', data, errorCallback);
                }
            },
            success: function (data) {
                callback(data);
            }
        });
    };
    getList = function (dispositionType, requestTypes, organizations, pageIndex, pageSize, orderBy, orderDesc, callback, errorCallback) {
        //ajax call 
        if (dispositionType == null) dispositionType = 2;
        if (pageIndex == 0) pageIndex = 0;
        if (pageSize == 0) pageSize = 5;
        if (orderBy == null) orderBy = 'DispositionDate';
        if (orderDesc == null || (orderDesc != 'true' && orderDesc != 'false')) orderDesc = 'true';
        $.ajax({
            type: "GET",
            url: serviceBase + "?dispositionType=" + dispositionType + "&requestTypes=" + (requestTypes || '') + "&organizations=" + (organizations || '')
                + "&pageIndex=" + pageIndex + "&pageSize=" + pageSize + "&orderBy=" + orderBy + "&orderDesc=" + orderDesc,
            dataType: "json",
            //contentType: "application/json; charset=utf-8",
            error: function (jqXHR, textStatus, errorThrown) {
                raiseAjaxError(jqXHR, textStatus, errorThrown, errorCallback);
            },
            statusCode: {
                200: function (data) { //authenticated
                },
                401: function (data) { //users needs to login first
                    window.location.reload(true);
                },
                404: function (data) {
                    handleErrorCode('The requests could not be loaded.', data, errorCallback);
                }
            },
            success: function (data) {
                callback(data);
            }
        });
    };
    deleteById = function(requestId, callback, errorCallback) {
        //ajax call 
        $.ajax({
            type: "DELETE",
            url: serviceBase + requestId,
            dataType: "json",
            //contentType: "application/json; charset=utf-8",
            error: function (jqXHR, textStatus, errorThrown) {
                raiseAjaxError(jqXHR, textStatus, errorThrown, errorCallback);
            },
            statusCode: {
                200: function (data) { //authenticated
                },
                401: function (data) { //users needs to login first
                    window.location.reload(true);
                },
                404: function (data) {
                    handleErrorCode('The request could not be loaded.', data, errorCallback);
                }
            },
            success: function (data) {
                callback(data);
            }
        });
    };
    getActivityDescription = function (requestId, activityId, callback, errorCallback) {
        //ajax call 
        $.ajax({
            type: "GET",
            url: serviceBase + requestId + '/activities/' + activityId + '/description',
            dataType: "json",
            //contentType: "application/json; charset=utf-8",
            error: function (jqXHR, textStatus, errorThrown) {
                raiseAjaxError(jqXHR, textStatus, errorThrown, errorCallback);
            },
            statusCode: {
                200: function (data) { //authenticated
                },
                401: function (data) { //users needs to login first
                    window.location.reload(true);
                },
                404: function (data) {
                    handleErrorCode('The activity description could not be loaded.', data, errorCallback);
                }
            },
            success: function (data) {
                callback(data);
            }
        });
    };
    getRequirementDescription = function (requestId, requirementId, callback, errorCallback) {
        //ajax call 
        $.ajax({
            type: "GET",
            url: serviceBase + requestId + '/requirements/' + requirementId + '/description',
            dataType: "json",
            //contentType: "application/json; charset=utf-8",
            error: function (jqXHR, textStatus, errorThrown) {
                raiseAjaxError(jqXHR, textStatus, errorThrown, errorCallback);
            },
            statusCode: {
                200: function (data) { //authenticated
                },
                401: function (data) { //users needs to login first
                    window.location.reload(true);
                },
                404: function (data) {
                    handleErrorCode('The requirement description could not be loaded.', data, errorCallback);
                }
            },
            success: function (data) {
                callback(data);
            }
        });
    };
    getPaymentActivityDescription = function (requestId, paymentId, activityId, callback, errorCallback) {
        //ajax call 
        $.ajax({
            type: "GET",
            url: serviceBase + requestId + '/payments/' + paymentId + '/activities/' + activityId + '/description',
            dataType: "json",
            //contentType: "application/json; charset=utf-8",
            error: function (jqXHR, textStatus, errorThrown) {
                raiseAjaxError(jqXHR, textStatus, errorThrown, errorCallback);
            },
            statusCode: {
                200: function (data) { //authenticated
                },
                401: function (data) { //users needs to login first
                    window.location.reload(true);
                },
                404: function (data) {
                    handleErrorCode('The activity description could not be loaded.', data, errorCallback);
                }
            },
            success: function (data) {
                callback(data);
            }
        });
    };
    getPaymentRequirementDescription = function (requestId, paymentId, requirementId, callback, errorCallback) {
        //ajax call 
        $.ajax({
            type: "GET",
            url: serviceBase + requestId + '/payments/' + paymentId + '/requirements/' + requirementId + '/description',
            dataType: "json",
            //contentType: "application/json; charset=utf-8",
            error: function (jqXHR, textStatus, errorThrown) {
                raiseAjaxError(jqXHR, textStatus, errorThrown, errorCallback);
            },
            statusCode: {
                200: function (data) { //authenticated
                },
                401: function (data) { //users needs to login first
                    window.location.reload(true);
                },
                404: function (data) {
                    handleErrorCode('The requirement description could not be loaded.', data, errorCallback);
                }
            },
            success: function (data) {
                callback(data);
            }
        });
    };
    getPaymentAttribs = function (requestId, paymentId, callback, errorCallback) {
        //ajax call 
        $.ajax({
            type: "GET",
            url: serviceBase + requestId + '/payments/' + paymentId + '/attribs',
            dataType: "json",
            //contentType: "application/json; charset=utf-8",
            error: function (jqXHR, textStatus, errorThrown) {
                raiseAjaxError(jqXHR, textStatus, errorThrown, errorCallback);
            },
            statusCode: {
                200: function (data) { //authenticated
                },
                401: function (data) { //users needs to login first
                    window.location.reload(true);
                },
                404: function (data) {
                    handleErrorCode('The payment attribs could not be loaded.', data, errorCallback);
                }
            },
            success: function (data) {
                callback(data);
            }
        });
    };
    getPaymentAttribsByType = function (requestId, paymentId, attribTypeId, callback, errorCallback) {
        //ajax call 
        $.ajax({
            type: "GET",
            url: serviceBase + requestId + '/payments/' + paymentId + '/attribs/' + attribTypeId,
            dataType: "json",
            //contentType: "application/json; charset=utf-8",
            error: function (jqXHR, textStatus, errorThrown) {
                raiseAjaxError(jqXHR, textStatus, errorThrown, errorCallback);
            },
            statusCode: {
                200: function (data) { //authenticated
                },
                401: function (data) { //users needs to login first
                    window.location.reload(true);
                },
                404: function (data) {
                    handleErrorCode('The payment attribs could not be loaded.', data, errorCallback);
                }
            },
            success: function (data) {
                callback(data);
            }
        });
    };
    return {
        setErrorHandler: setErrorHandler,
        getById: getById,
        getList: getList,
        deleteById: deleteById,
        getActivityDescription: getActivityDescription,
        getRequirementDescription: getRequirementDescription,
        getPaymentActivityDescription: getPaymentActivityDescription,
        getPaymentRequirementDescription: getPaymentRequirementDescription,
        getPaymentAttribs: getPaymentAttribs,
        getPaymentAttribsByType: getPaymentAttribsByType
    };

}();

/* Widget service */

var widgetService = new function () {
    var serviceBase = gdConfig.jsonApiUrl + 'widgets/',
    errorHandler = null,
    setErrorHandler = function (callback) {
        errorHandler = callback;
    },
    raiseAjaxError = function (jqXHR, textStatus, errorThrown, errorCallback) {
        if (errorCallback != null) {
            errorCallback(jqXHR, textStatus, errorThrown);
        }
        else if (errorHandler != null) {
            errorHandler(jqXHR, textStatus, errorThrown);
        } else {
            ajaxServiceErrorHandler(jqXHR, textStatus, errorThrown);
        }
    },
    handleErrorCode = function(defaultMsg, errorData, errorCallback) {
        var status = defaultMsg;
        var response = '';
        if (errorData != null) {
            status = errorData.statusText;
            response = errorData.responseText;
        }
        raiseAjaxError(null, status, response, errorCallback);
    },
	getAll = function (callback, errorCallback) {
	    $.ajax({
	        type: "GET",
	        url: serviceBase,
	        dataType: "json",
	        //contentType: "application/json; charset=utf-8",
	        error: function (jqXHR, textStatus, errorThrown) {
	            raiseAjaxError(jqXHR, textStatus, errorThrown, errorCallback);
	        },
	        statusCode: {
	            200: function (data) { //authenticated
	            },
	            401: function (data) { //users needs to login first
	                window.location.reload(true);
	            },
	            404: function (data) {
	                handleErrorCode('Not found.', data, errorCallback);
	            }
	        },
	        success: function (data) {
	            if (data == null) {
	                raiseAjaxError(null, null, 'No widgets were found.', errorCallback);
	            } else {
	                callback(data);
	            }
	        }
	    });
	};
    getMetrics = function (endPoint, callback, errorCallback) {
        $.ajax({
            type: "GET",
            url: gdConfig.jsonApiUrl + endPoint,
            dataType: "json",
            //contentType: "application/json; charset=utf-8",
            error: function (jqXHR, textStatus, errorThrown) {
                raiseAjaxError(jqXHR, textStatus, errorThrown, errorCallback);
            },
            statusCode: {
                200: function (data) { //authenticated
                },
                401: function (data) { //users needs to login first
                    window.location.reload(true);
                },
                404: function (data) {
                    handleErrorCode('Not found.', data, errorCallback);
                },
                501: function (data) {
                    handleErrorCode('Not implemented.', data, errorCallback);
                }
            },
            success: function (data) {
                if (data == null) {
                    raiseAjaxError(null, null, 'The metric contains no data.', errorCallback);
                } else {
                    callback(data);
                }
            }
        });
    };
    getOrgSummaryList = function (dispositionType, requestTypes, organizations, pageIndex, pageSize, orderBy, orderDesc, callback, errorCallback) {
        //ajax call 
        if (dispositionType == null) dispositionType = 2;
        if (pageIndex == 0) pageIndex = 0;
        if (pageSize == 0) pageSize = 5;
        if (orderBy == null) orderBy = 'DispositionDate';
        if (orderDesc == null || (orderDesc != 'true' && orderDesc != 'false')) orderDesc = 'true';
        $.ajax({
            type: "GET",
            url: serviceBase + "orgsummary/?dispositionType=" + dispositionType + "&requestTypes=" + (requestTypes || '') + "&organizations=" + (organizations || '')
                + "&pageIndex=" + pageIndex + "&pageSize=" + pageSize + "&orderBy=" + orderBy + "&orderDesc=" + orderDesc,
            dataType: "json",
            //contentType: "application/json; charset=utf-8",
            error: function (jqXHR, textStatus, errorThrown) {
                raiseAjaxError(jqXHR, textStatus, errorThrown, errorCallback);
            },
            statusCode: {
                200: function (data) { //authenticated
                },
                401: function (data) { //users needs to login first
                    window.location.reload(true);
                },
                404: function (data) {
                    handleErrorCode('The organizations could not be loaded.', data, errorCallback);
                }
            },
            success: function (data) {
                callback(data);
            }
        });
    };

    return {
        setErrorHandler: setErrorHandler,
        getAll: getAll,
        getMetrics: getMetrics,
        getOrgSummaryList: getOrgSummaryList
    };

}();

/* Staff service */

var staffService = new function () {
    var serviceBase = gdConfig.jsonApiUrl + 'staff/',
    errorHandler = null,
    setErrorHandler = function (callback) {
        errorHandler = callback;
    },
    raiseAjaxError = function (jqXHR, textStatus, errorThrown, errorCallback) {
        if (errorCallback != null) {
            errorCallback(jqXHR, textStatus, errorThrown);
        }
        else if (errorHandler != null) {
            errorHandler(jqXHR, textStatus, errorThrown);
        } else {
            ajaxServiceErrorHandler(jqXHR, textStatus, errorThrown);
        }
    },
    handleErrorCode = function (defaultMsg, errorData, errorCallback) {
        var status = defaultMsg;
        var response = '';
        if (errorData != null) {
            status = errorData.statusText;
            response = errorData.responseText;
        }
        raiseAjaxError(null, status, response, errorCallback);
    },
	getAll = function (callback, errorCallback) {
	    $.ajax({
	        type: "GET",
	        url: serviceBase,
	        dataType: "json",
	        //contentType: "application/json; charset=utf-8",
	        error: function (jqXHR, textStatus, errorThrown) {
	            raiseAjaxError(jqXHR, textStatus, errorThrown, errorCallback);
	        },
	        statusCode: {
	            200: function (data) { //authenticated
	            },
	            401: function (data) { //users needs to login first
	                window.location.reload(true);
	            },
	            404: function (data) {
	                handleErrorCode('Not found.', data, errorCallback);
	            }
	        },
	        success: function (data) {
	            if (data == null) {
	                raiseAjaxError(null, null, 'No staff were found.', errorCallback);
	            } else {
	                callback(data);
	            }
	        }
	    });
	};
    return {
        setErrorHandler: setErrorHandler,
        getAll: getAll
    };

}();


/* Attrib service */

var attribService = new function () {
    var serviceBase = gdConfig.jsonApiUrl + 'attribtypes/',
    errorHandler = null,
    setErrorHandler = function (callback) {
        errorHandler = callback;
    },
    raiseAjaxError = function (jqXHR, textStatus, errorThrown, errorCallback) {
        if (errorCallback != null) {
            errorCallback(jqXHR, textStatus, errorThrown);
        }
        else if (errorHandler != null) {
            errorHandler(jqXHR, textStatus, errorThrown);
        } else {
            ajaxServiceErrorHandler(jqXHR, textStatus, errorThrown);
        }
    },
    handleErrorCode = function (defaultMsg, errorData, errorCallback) {
        var status = defaultMsg;
        var response = '';
        if (errorData != null) {
            status = errorData.statusText;
            response = errorData.responseText;
        }
        raiseAjaxError(null, status, response, errorCallback);
    },
    getAttribTypeById = function (attribTypeId, callback, errorCallback) {
        //ajax call 
        $.ajax({
            type: "GET",
            url: serviceBase + attribTypeId,
            dataType: "json",
            //contentType: "application/json; charset=utf-8",
            error: function (jqXHR, textStatus, errorThrown) {
                raiseAjaxError(jqXHR, textStatus, errorThrown, errorCallback);
            },
            statusCode: {
                200: function (data) { //authenticated
                },
                401: function (data) { //users needs to login first
                    window.location.reload(true);
                },
                404: function (data) {
                    handleErrorCode('The attrib type could not be loaded.', data, errorCallback);
                }
            },
            success: function (data) {
                callback(data);
            }
        });
    },
    saveAttribType = function(attribTypeId, attribType, callback, errorCallback) {
        //ajax call
        var json = JSON.stringify(attribType);
        $.ajax({
            type: "PUT",
            url: serviceBase + attribTypeId,
            dataType: "json",
            data: json,
            contentType: "application/json; charset=utf-8",
            error: function (jqXHR, textStatus, errorThrown) {
                raiseAjaxError(jqXHR, textStatus, errorThrown, errorCallback);
            },
            statusCode: {
                200: function (data) { //authenticated
                },
                401: function (data) { //users needs to login first
                    window.location.reload(true);
                },
                404: function (data) {
                    handleErrorCode('The attrib type could not be saved.', data, errorCallback);
                }
            },
            success: function (data) {
                callback(data);
            }
        });
    },
    createAttribType = function(attribType, callback, errorCallback) {
        //ajax call
        $.ajax({
            type: "POST",
            url: serviceBase,
            dataType: "json",
            data: attribType,
            //contentType: "application/json; charset=utf-8",
            error: function (jqXHR, textStatus, errorThrown) {
                raiseAjaxError(jqXHR, textStatus, errorThrown, errorCallback);
            },
            statusCode: {
                200: function (data) { //authenticated
                },
                401: function (data) { //users needs to login first
                    window.location.reload(true);
                },
                404: function (data) {
                    handleErrorCode('The attrib type could not be saved.', data, errorCallback);
                }
            },
            success: function (data) {
                callback(data);
            }
        });
    },
    getAttribById = function (attribTypeId, attribId, callback, errorCallback) {
        //ajax call 
        $.ajax({
            type: "GET",
            url: serviceBase + attribTypeId + '/attribs/' + attribId,
            dataType: "json",
            //contentType: "application/json; charset=utf-8",
            error: function (jqXHR, textStatus, errorThrown) {
                raiseAjaxError(jqXHR, textStatus, errorThrown, errorCallback);
            },
            statusCode: {
                200: function (data) { //authenticated
                },
                401: function (data) { //users needs to login first
                    window.location.reload(true);
                },
                404: function (data) {
                    handleErrorCode('The attrib could not be loaded.', data, errorCallback);
                }
            },
            success: function (data) {
                callback(data);
            }
        });
    },
    deleteAttribById = function(attribTypeId, attribId, callback, errorCallback) {
        //ajax call 
        $.ajax({
            type: "DELETE",
            url: serviceBase + attribTypeId + '/attribs/' + attribId,
            dataType: "json",
            //contentType: "application/json; charset=utf-8",
            error: function (jqXHR, textStatus, errorThrown) {
                raiseAjaxError(jqXHR, textStatus, errorThrown, errorCallback);
            },
            statusCode: {
                200: function (data) { //authenticated
                },
                401: function (data) { //users needs to login first
                    window.location.reload(true);
                },
                404: function (data) {
                    handleErrorCode('The attrib could not be loaded.', data, errorCallback);
                }
            },
            success: function (data) {
                callback(data);
            }
        });
    };
	
    return {
        setErrorHandler: setErrorHandler,
        getAttribTypeById: getAttribTypeById,
        getAttribById: getAttribById,
        deleteAttribById: deleteAttribById,
        saveAttribType: saveAttribType,
        createAttribType: createAttribType
    };

}();
