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





.directive('bsolEditListButton', [

    function() {
        // Runs during compile
        return {
            // name: '',
            // priority: 1,
            // terminal: true,
            scope: {
                //ngModel: '=',
                bsListname: '@',
                bsListkeys: '=',
                bsListdata: '=',
                bsNewdata: '=',
            },
            controller: ['$scope', '$element', '$attrs', '$transclude', '$modal',
                function($scope, $element, $attrs, $transclude, $modal) {

                    $scope.onEditClick = function(e) {
                        var editBox = $modal.open({
                            //template: '<div class="modal-body">' + msg + '</div>',
                            scope: $scope,
                            template: '<div bs-edit-list bs-listname="' + $attrs.bsolListname + '" bs-listkeys="' + $attrs.bsolListkeys + '" bs-listdata="' + 'bsListdata' + '" bs-newdata="' + 'bsNewdata' + '"></div>',
                            //templateUrl: 'vies/bs/editlist.html',
                            controller: ['$scope', '$modalInstance',

                                function($scope, $modalInstance) {                                    $scope.onCloseClick = function(e) {
                                        $modalInstance.close();
                                    };
                                }
                            ]

                        });

                    };
                }
            ],
            // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
            template: '<button type="button" class="btn btn-primary btn-xs" ng-click="onEditClick($event)" tooltip="Edit {{bsListname}} list"><span class="glyphicon glyphicon-edit"></span></button>',
            //templateUrl: '',
            // transclude: true,
            // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
            link: function($scope, iElm, iAttrs, controller) {

            }
        };
    }
])






.directive('bsolDropList', [

    function() {
        // Runs during compile
        return {
            //name: '',
            priority: 1,
            // terminal: true,
            scope: {
                ngModel: '=',
                ngBlur: '&',
                ngChange: '&',
                bsolListdata: '=',
            }, // {} = isolate, true = child, false/undefined = no change

            controller: ['$scope', '$element', '$attrs', '$transclude', '$modal',
                function($scope, $element, $attrs, $transclude, $modal) {
                    //$scope.bsolListService = bsListService;

                    //bsListService.updateList($scope.bsolListname)


                    $scope.onItemClick = function(e, item) {
                        //$scope.ngModel = item.id;
                       // $scope.ngChange({
                        //    $event: e
                       // });
                    };

                    $scope.onItemSelect = function(e) {
                        setTimeout(function() {
                            //$scope.ngChange({
                            //    $event: e
                            //});
                        }, 1);
                    };




                }
            ],
            require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
            templateUrl: 'bsol/view/dropdown.html',
            // transclude: true,
            //compile: function(tElement, tAttrs) {},

            link: function($scope, iElm, iAttrs, ngModelController) {

            }
        };
    }
])



.directive('bsolEditList', [

    function() {
        // Runs during compile
        return {
            // name: '',
            // priority: 1,
            // terminal: true,
            scope: {
                //ngModel: '=',
                bsolListdata: '=',
                bsolNewdata: '=',
            }, // {} = isolate, true = child, false/undefined = no change
            controller: 'EditListController',
            // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
            // template: '',
            templateUrl: 'bsol/views/editlist.html',
            // transclude: true,
            // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
            link: function($scope, iElm, iAttrs, bsListService) {

            }
        };
    }
])

.controller('EditListController', ['$scope', '$element', '$attrs', '$transclude', 'bsStateService', '$modal', 'AlertService',
    function($scope, $element, $attrs, $transclude, bsStateService, $modal, AlertService) {

        $scope.newItem = {};
        _.extend($scope.newItem, $scope.bsolNewdata);
        

        $scope.onAddClick = function(e) {
            e.stopPropagation();
    
            $scope.bsolListdata.$post($scope.newItem).then(function success(item) {
                $scope.newForm.$setPristine();
                $scope.bsolListdata.push(item);
            }, function fail(err) {
                alert(err);
            });
        };

        $scope.onFieldBlur = function(e, row, form) {
            e.stopPropagation();
            console.log('calling blur');
            row.$put().$promise.then(function success(item) {
                form.$setPristine();
            }, function fail(err) {

            });
        };

        $scope.onRemoveClick = function(e, row) {
            e.stopPropagation();
            AlertService.areYouSure('Do you want to remove this item?', function yes() {
                row.$destroy().$promise.then(function success() {
                    var index = $scope.bsolListdata.indexOf(row);
                    $scope.bsolListdata.splice(index, 1);
                }, function fail() {

                });
            }, function no() {
                console.log('delete canceled');
            });
        };
    }
])


.directive('bsolIncludeList', [

    function() {
        // Runs during compile
        return {
            // name: '',
            // priority: 1,
            // terminal: true,
            scope: {
                //ngModel: '=',
                bsListname: '@',
                bsListtitles: '=',
                bsListkeys: '=',
                bsListdata: '=',
                bsNewdata: '=',
            }, // {} = isolate, true = child, false/undefined = no change
            controller: 'IncludelistController',
            // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
            // template: '',
            templateUrl: 'bsol/views/includelist.html',
            // transclude: true,
            // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
            link: function($scope, iElm, iAttrs, bsListService) {

            }
        };
    }
])

.controller('IncludelistController', ['$scope', '$element', '$attrs', '$transclude', 'bsStateService', '$modal', 'AlertService',
    function($scope, $element, $attrs, $transclude, bsStateService, $modal, AlertService) {

        $scope.newItem = {};
        _.extend($scope.newItem, $scope.bsolNewdata);
        

        $scope.onDetailClick = function(e, row) {
            e.stopPropagation();
            row.goToDetail();
        };


        $scope.onRemoveClick = function(e, row) {
            e.stopPropagation();
            AlertService.areYouSure('Do you want to remove this item?', function yes() {
                row.remove().then(function success() {
                    var index = $scope.bsolListdata.indexOf(row);
                    $scope.bsolListdata.splice(index, 1);
                }, function fail() {

                });
            }, function no() {
                console.log('delete canceled');
            });
        };
    }
])


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

/**

 * @ngdoc directive
 * @name tvur.services.directive:genericGrid
 * 
 * @description
 * A generic customisable grid for top level lists
 * 
*/
.directive('genericGrid', function(){
        // Runs during compile
        return {
            scope: {
                gridOptions: '=',
                datastore: '=',
              
            }, // {} = isolate, true = child, false/undefined = no change
            controller: ['$scope', '$element', '$attrs', '$transclude', 'ErrorHandler', 'CommonGrid', 'AlertService', function($scope, $element, $attrs, $transclude, ErrorHandler, CommonGrid, AlertService) {
                
                $scope.gridScope = {
                    
                };
                
                $scope.datastore.on('collectionupdated', function() {
                    $scope.gridOptions.data = $scope.datastore.collection;
                });
                
                $scope.remove = function(e) {
                    $scope.datastore.removeRows($scope.gridApi.selection.getSelectedRows());
                };

                $scope.add = function(e) {
                    var baseNewChild = {};
                    $scope.datastore.addNoSync(baseNewChild);  
                };
            }],

            //require: 'parent', // Array = multiple requires, ? = optional, ^ = check parent elements
            restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
            templateUrl: 'bsol/views/template-generic-grid.html',
            
            link: function($scope, iElm, iAttrs, controller) {
                
            }
        };
    })

.service('GenericUI', ['ngDialog', function(ngDialog){
     this.openEditGrid = function(datastore, gridOptions) {
        var dialog = ngDialog.open({
            plain: true,
            className: 'ngdialog-theme-normal',
            template:'<generic-grid datastore="datastore" grid-options="gridOptions"></generic-grid>',
            
            controller: ['$scope',
                function($scope) {
                    $scope.gridOptions = gridOptions;
                    $scope.datastore = datastore;
                }
            ]
        });
        return dialog.closePromise;
     }; 

     this.ask = function(question) {
        var dialog = ngDialog.open({
            plain: false,
            className: 'ngdialog-theme-normal',
            template:'bsol/views/template-question.html',
            
            controller: ['$scope',
                function($scope) {
                  
                    $scope.question = question;
                    $scope.answer = '';

                    $scope.ok = function(e) {
                        e.stopPropagation();
                        $scope.closeThisDialog($scope.answer);
                    };

                    $scope.cancel = function(e) {
                        e.stopPropagation();
                        $scope.closeThisDialog();
                    };
                }
            ]
        });
        return dialog.closePromise;
     }; 


}])
;