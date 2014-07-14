'use strict';

angular.module('bs.common', ['ui.bootstrap', 'btford.socket-io'])

.service('ModalMsg', ['$modal',
    function($modal) {

        this.alert = function(msg) {
            $modal.open({
                template: '<div class="modal-body">' + msg + '</div>',
                windowClass: 'warning'
            });
        };


        this.areYouSure = function(question, yesFn, noFn) {
            $modal.open({
                //windowClass: 'modal-small',
                template: '<div class="modal-body">' + question + '?</div><button class="btn btn-md btn-danger" ng-click="onYesClick($event)">Yes</button><button class="btn btn-md btn-success" ng-click="onNoClick($event)">No</button>',
                controller: ['$scope', '$modalInstance',
                    function($scope, $modalInstance) {
                        $scope.onYesClick = function(e) {
                            yesFn();
                            $modalInstance.close('doit');
                        };

                        $scope.onNoClick = function(e) {
                            noFn();
                            $modalInstance.dismiss('cancel');
                        };
                    }
                ]
            });
        };
    }
])

.service('bsStateService', ['$rootScope', '$cookieStore',
    function($rootScope, $cookieStore) {

        var state = {

        }; // This object will hold our current state and variables

        /**
  @description
  Get persitant data from memory or storage
  @param {string} key The key or property to get
  @returns {string} The value of the key or property
  */
        this.get = function(key) {
            return state[key] || $cookieStore.get(key);
        };

        /**
  @description
  Put temp data into memory
  @param {string} key The key or property to put
  @param {string} value The value of the key or property to put
  */
        this.put = function(key, value) {
            //$cookieStore.put(key, value);
            state[key] = value;
        };

        /**
  @description
  Put persitant data into storage
  @param {string} key The key or property to put
  @param {string} value The value of the key or property to put
  */
        this.store = function(key, value) {
            $cookieStore.put(key, value);
        };


        /**
  @description
  Removes persitant data from storage and memory
  @param {string} key The key or property to remove
  */
        this.remove = function(key) {
            $cookieStore.remove(key);
            delete(state[key]);
        };

    }
])



/**
 * @ngdoc filter
 * @name bs.common.filter:bsFilter_newlineBr 
 * @function
 * 
 * @description
 * Applied to some text - this filter returns the field with any <br> converted to a standard new line
 * <pre>
 * {{textToModify | bsFilter_newlineBr}}
 * </pre>
 */
.filter('bsFilter_newlineBr', ['$sce', function($sce) {
    return function(inputStr) {
        var outputStr = inputStr.replace(/\n/g, '<br>');
        return $sce.getTrustedHtml(outputStr);
    };
}])


/**
 * @ngdoc filter
 * @name bs.common.filter:bsFilter_arrayIndexValue 
 * @function
 * 
 * @description
 * Applied to an integer - this filter returns the value at that location in the given array
 * <pre>
 * {{arrayKey | bsFilter_arrayIndexValue:theArrayToReturnFrom}}
 * </pre>
 */
.filter('bsFilter_arrayIndexValue', function() {
    return function(index, resArray) {
        var word = resArray[Number(index)];
        return word;
    };
})



/**
 * @ngdoc filter
 * @name bs.common.filter:bsFilter_inArray 
 * @function
 * 
 * @description
 * Applied to an array key - this filter returns the value in the given array
 * <pre>
 * {{arrayKey | bsFilter_inArray:theArrayToReturnFrom}}
 * </pre>
 */
.filter('bsFilter_inArray', function() {
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
 * @name bs.common.filter:bsFilter_listDescription //  middle part is always filter 
 * @function
 * 
 * @description
 * Applied to a key value - this filter returns the corresponding description. Both key and description fields can optionally be set
 * <pre>
 * {{object.keyAttribute | bsFilterDescription:objectContainingValues:'keyAttribute':'returnedAttribute'}}
 * </pre>
 */
.filter('bsFilter_listDescription', [

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





.directive('bsEditListButton', [

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
                            template: '<div bs-edit-list bs-listname="' + $attrs.bsListname + '" bs-listkeys="' + $attrs.bsListkeys + '" bs-listdata="' + 'bsListdata' + '" bs-newdata="' + 'bsNewdata' + '"></div>',
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
            // replace: true,
            // transclude: true,
            // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
            link: function($scope, iElm, iAttrs, controller) {

            }
        };
    }
])






.directive('bsDropList', [

    function() {
        // Runs during compile
        return {
            //name: '',
            priority: 1,
            // terminal: true,
            scope: {
                ngModel: '=',
                bsListname: '@',
                ngBlur: '&',
                ngChange: '&',
                bsValuedisplay: '=',
                bsListdata: '=',
            }, // {} = isolate, true = child, false/undefined = no change

            controller: ['$scope', '$element', '$attrs', '$transclude', '$modal',
                function($scope, $element, $attrs, $transclude, $modal) {
                    //$scope.bsListService = bsListService;

                    //bsListService.updateList($scope.bsListname)


                    $scope.onItemClick = function(e, item) {
                        $scope.ngModel = item.id;
                        $scope.ngChange({
                            $event: e
                        });
                    };

                    $scope.onItemSelect = function(e) {
                        // THIS IS VERY BAD STYLE
                        // The directive is not updating before the event is fired
                        // so as a temp measure a timeout has been placed.
                        // NEED TO FIGURE OUT HOW TO UPDATE THE PARENT SCOPE BEFORE FIREING THE EVENT
                        setTimeout(function() {
                            $scope.ngChange({
                                $event: e
                            });
                        }, 1);
                    };




                }
            ],
            require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
            templateUrl: 'views/bs/dropdown.html',
            // replace: true,
            // transclude: true,
            //compile: function(tElement, tAttrs) {},

            link: function($scope, iElm, iAttrs, ngModelController) {

            }
        };
    }
])



.directive('bsEditList', [

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
            }, // {} = isolate, true = child, false/undefined = no change
            controller: 'editlistCtrl',
            // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
            // template: '',
            templateUrl: 'views/bs/editlist.html',
            // replace: true,
            // transclude: true,
            // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
            link: function($scope, iElm, iAttrs, bsListService) {

            }
        };
    }
])

.controller('editlistCtrl', ['$scope', '$element', '$attrs', '$transclude', 'bsStateService', '$modal', 'ModalMsg',
    function($scope, $element, $attrs, $transclude, bsStateService, $modal, ModalMsg) {

        $scope.newItem = {};
        _.extend($scope.newItem, $scope.bsNewdata);
        

        $scope.onAddClick = function(e) {
            e.stopPropagation();
    
            $scope.bsListdata.post($scope.newItem).then(function success(item) {
                $scope.newForm.$setPristine();
                $scope.bsListdata.push(item);
            }, function fail(err) {
                alert(err);
            });
        };

        $scope.onFieldBlur = function(e, row, form) {
            e.stopPropagation();
            console.log('calling blur');
            row.put().then(function success(item) {
                form.$setPristine();
            }, function fail(err) {

            });
        };

        $scope.onRemoveClick = function(e, row) {
            e.stopPropagation();
            ModalMsg.areYouSure('Do you want to remove this item?', function yes() {
                row.remove().then(function success() {
                    var index = $scope.bsListdata.indexOf(row);
                    $scope.bsListdata.splice(index, 1);
                }, function fail() {

                });
            }, function no() {
                console.log('delete canceled');
            });
        };
    }
])


.directive('bsIncludeList', [

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
            controller: 'includelistCtrl',
            // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
            // template: '',
            templateUrl: 'views/bs/includelist.html',
            // replace: true,
            // transclude: true,
            // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
            link: function($scope, iElm, iAttrs, bsListService) {

            }
        };
    }
])

.controller('includelistCtrl', ['$scope', '$element', '$attrs', '$transclude', 'bsStateService', '$modal', 'ModalMsg',
    function($scope, $element, $attrs, $transclude, bsStateService, $modal, ModalMsg) {

        $scope.newItem = {};
        _.extend($scope.newItem, $scope.bsNewdata);
        

        $scope.onDetailClick = function(e, row) {
            e.stopPropagation();
            row.goToDetail();
        };


        $scope.onRemoveClick = function(e, row) {
            e.stopPropagation();
            ModalMsg.areYouSure('Do you want to remove this item?', function yes() {
                row.remove().then(function success() {
                    var index = $scope.bsListdata.indexOf(row);
                    $scope.bsListdata.splice(index, 1);
                }, function fail() {

                });
            }, function no() {
                console.log('delete canceled');
            });
        };
    }
]);