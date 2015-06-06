'use strict';

angular.module('bsol.common', [
    'ui.bootstrap',
    'ngDialog',
])



/**
 * @ngdoc filter
 * @name bsol.common.filter:bsFilter_newlineBr 
 * @function
 * 
 * @description
 * Applied to some text - this filter returns the field with any <br> converted to a standard new line
 * <pre>
 * {{textToModify | bsFilter_newlineBr}}
 * </pre>
 */
.filter('bsolFilter_newlineBr', ['$sce', function($sce) {
    return function(inputStr) {
        var outputStr = inputStr.replace(/\n/g, '<br>');
        return $sce.getTrustedHtml(outputStr);
    };
}])



.filter('bsol_objectArrayAsString', [function() {
    return function(inputArray, field) {
        var s = '';
        _.forEach(inputArray, function(item) {
            s += item[field] + '; ';
        });
        return s;
    };
}])

/**
 * @ngdoc filter
 * @name bsol.common.filter:bsFilter_arrayIndexValue 
 * @function
 * 
 * @description
 * Applied to an integer - this filter returns the value at that location in the given array
 * <pre>
 * {{arrayKey | bsFilter_arrayIndexValue:theArrayToReturnFrom}}
 * </pre>
 */
.filter('bsolFilter_arrayIndexValue', function() {
    return function(index, resArray) {
        var word = resArray[Number(index)];
        return word;
    };
})



/**
 * @ngdoc filter
 * @name bsol.common.filter:bsFilter_inArray 
 * @function
 * 
 * @description
 * Applied to an array key - this filter returns the value in the given array
 * <pre>
 * {{arrayKey | bsolFilter_inArray:theArrayToReturnFrom}}
 * </pre>
 */
.filter('bsolFilter_inArray', function() {
    return function(data, a) {
        if (!data) {return;}

        var ret = {};
        for (var key in a) {
            if (a[key] in data) {
                ret[a[key]] = (data[a[key]]);
            }
        }
        return ret;

    };
})

/**
 * @ngdoc filter
 * @name bsol.common.filter:bsFilter_listDescription 
 * @function
 * 
 * @description
 * Applied to a key value - this filter returns the corresponding description. Both key and description fields can optionally be set
 * <pre>
 * {{object.keyAttribute | bsolFilter_listDescription:objectContainingValues:'keyAttribute':'returnedAttribute'}}
 * </pre>
 */
.filter('bsolFilter_listDescription', [

    function() {
        return function(id, listdata, idName, descriptionName) {
            if (!idName) {idName = 'id';}
            if (!descriptionName) {descriptionName = 'description';}
            for (var item in listdata) {
                if (listdata[item][idName] === id) {return listdata[item][descriptionName];}
            }

            return id;
        };
    }]
)




/**

 * @ngdoc service
 * @name bsol.common.service:errorHandler
 * 
 * @description
 * Generic functionality for ngGrid
 *
 * returns array of objects representing the list
*/
.service('ErrorHandler', ['AlertService', function(AlertService) {
        var errorHandler = function(errorData) {
            var err = errorData;
            if(err.$response) {
                err = err.$response.data;
            }

            if(err) {
                AlertService.addAlert(err);
            
                
            } else {
                console.error(err);
                AlertService.addAlert('Critical Error - check console log', 'danger');
            }
        };

        return errorHandler;
}])




/**
 * @ngdoc directive
 * @name bsol.common.directive:bsolLoading
 * 
 * @description
 * Simple visual feedback when syncing from server
 *
 * <pre> <bsol-loading> ng-model="myTrueFalseVar"></bsol-loading> </pre>
*/
.directive('bsolLoading', [function(){
    // Runs during compile
    return {
        // name: '',
        // priority: 1,
        // terminal: true,
        scope: {
            ngModel: '=',
        }, // {} = isolate, true = child, false/undefined = no change
        controller: function($scope, $element, $attrs, $transclude) {
            $scope.loading = $scope.ngModel;

        },
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
        // template: '',
        templateUrl: 'bsol/views/loading.html',
        // transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function($scope, iElm, iAttrs, controller) {
            
        }
    };
}])
/**
 * @ngdoc directive
 * @name bsol.common.directive:bsolDashboard
 * 
 * @description
 * Fpr displaying widgets on a dashboard
 *
 * 
*/
.directive('bsolDashboard', [function(){
    // Runs during compile
    return {
        // name: '',
        // priority: 1,
        // terminal: true,
        scope: false, //isolate, true = child, false/undefined = no change
        controller: function($scope, $element, $attrs, $transclude) {
            
        },
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
        //template: 'Hello stuff',
        templateUrl: 'bsol/views/dashboard.html',
        transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function($scope, iElm, iAttrs, controller) {

        }
    };
}])
/**
 * @ngdoc directive
 * @name bsol.common.directive:bsolDashboard
 * 
 * @description
 * Fpr displaying widgets on a dashboard
 *
 * 
*/
.directive('bsolDashboardWidget', [function(){
    // Runs during compile
    return {
        // name: '',
        // priority: 1,
        // terminal: true,
        scope: {
            heading: '@',
            width: '@',
        }, //isolate, true = child, false/undefined = no change
        controller: function($scope, $element, $attrs, $transclude) {
            $element[0].style.width = $scope.width;
        },
        // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
        restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
        //template: 'Hello stuff',
        templateUrl: 'bsol/views/dashboard-widget.html',
        transclude: true,
        // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
        link: function($scope, iElm, iAttrs, controller) {

        }
    };
}])

;