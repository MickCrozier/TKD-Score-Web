
'use strict';

/**
 * @ngdoc overview
 * @name qtime.services
 *
 * @description
 * Regular shit throughout the application are made available through this module
 */

var Module = angular.module('qtime.services', [ 
    'bsol.session',
    'ui.bootstrap',
])

.run(['$templateCache', function($templateCache){
    $templateCache.put('ui-grid/custom/stringEditor',
        "<div><form name=\"inputForm\"><input type=\"string\" ng-class=\"'colt' + col.uid\" ui-grid-editor ng-model=\"MODEL_COL_FIELD\"></form></div>"
    );

    $templateCache.put('ui-grid/custom/minutesEditor',
        "<div><form name=\"inputForm\"><input minutes-formatter type=\"string\" ng-class=\"'colt' + col.uid\" ui-grid-editor ng-model=\"MODEL_COL_FIELD\"></form></div>"
    );

    $templateCache.put('ui-grid/custom/uiGridHeaderCellWithEditButton',
        "<div ng-class=\"{ 'sortable': sortable }\"><div class=\"ui-grid-vertical-bar\">&nbsp;</div><div class=\"ui-grid-cell-contents\" col-index=\"renderIndex\"><span><button type=\"button\" ng-click=\"getExternalScopes().editButtonPressed($event)\" class=\"btn btn-primary btn-xs\" tooltip=\"Edit\" tooltip-placement=\"bottom\"><span class=\"glyphicon glyphicon-edit\"></span></button>{{ col.displayName CUSTOM_FILTERS }}</span> <span ui-grid-visible=\"col.sort.direction\" ng-class=\"{ 'ui-grid-icon-up-dir': col.sort.direction == asc, 'ui-grid-icon-down-dir': col.sort.direction == desc, 'ui-grid-icon-blank': !col.sort.direction }\">&nbsp;</span></div><div class=\"ui-grid-column-menu-button\" ng-if=\"grid.options.enableColumnMenus && !col.isRowHeader  && col.colDef.enableColumnMenu !== false\" class=\"ui-grid-column-menu-button\" ng-click=\"toggleMenu($event)\"><i class=\"ui-grid-icon-angle-down\">&nbsp;</i></div><div ng-if=\"filterable\" class=\"ui-grid-filter-container\" ng-repeat=\"colFilter in col.filters\"><input type=\"text\" class=\"ui-grid-filter-input\" ng-model=\"colFilter.term\" ng-click=\"$event.stopPropagation()\" ng-attr-placeholder=\"{{colFilter.placeholder || ''}}\"><div class=\"ui-grid-filter-button\" ng-click=\"colFilter.term = null\"><i class=\"ui-grid-icon-cancel right\" ng-show=\"!!colFilter.term\">&nbsp;</i><!-- use !! because angular interprets 'f' as false --></div></div></div>"
    );


    
}])



/**
 * @ngdoc factory
 * @name qtime.services.factory:ListManager
 * 
 * @param {object} options An object containing the options.
     * parentDataModel - the Model factory of the parent
     * dataModel - the Model factory of the list items
     * defaultNewData - The default data to be inserted when adding a new item
     * getParent - The function to get the parent data if no parent is provided 
 * 
 * @description
 * Creates a manager for a list/collection of a given datamodel.
 *<pre>myAwesomeCollection = new ListManager(options);</pre>
 *
*/
    .factory('ListManager', [function() {
        var f = function(options) {
            this.parentDataModel = options.parentDataModel;
            this.dataModel = options.dataModel;
            this.defaultNewData = options.defaultNewData;
            this.hasParent = (angular.isDefined(options.hasParent)) ? options.hasParent : true;
            this.populate = options.populate;
            this.getParent = options.getParent || function() {throw new Error('Unable to get parent as no parent and no getParent function provided');}
            this.sort = options.sort || null;

            this.data = [];
            this.parent = {};
        }

        f.prototype = {
            /**
         * @ngdoc method
         * @name ListManagerListManager#get
         * @methodOf qtime.services.ListManager
         *
         * @description
         * Gets the children of the associated parent 
         *
         * @param {string} parent The object for which the list is required. 
         * @returns {HttpPromise} Future array || The array. 
         */
            get: function(parent) {
                var self = this;
                var getList = function(options) {
                    if(!options) {
                        var options = {};
                    }

                    if(options.sort) {
                        this.sort = options.sort;
                    }

                    self.defaultNewData[self.parentDataModel.$name] = self.parent.id; // setup new data id
                    console.log('Getting ' + self.dataModel.$name + ' for ' + self.parentDataModel.$name + ': ', self.parent.id)
                    var search = {};
                    search[self.parentDataModel.$name] = self.parent.id;
                    if(self.populate) {
                        search.populate = self.populate;
                    }
                    if(self.sort) {
                        search.sort = self.sort;
                    }
                    self.data = self.dataModel.find(search);
                }

                var getListNoParent = function() {
                    console.log('Getting ' + self.dataModel.$name + ' for all')
                    var search = {};
                    if(self.populate) {
                        search.populate = self.populate;
                    }
                    self.data = self.dataModel.find(search);
                }

                if(self.hasParent) {
                    // IF PARENT NOT PROVIDED - Use the provided getParent function
                    // this does not work if its a promise
                    if(!parent) {
                        parent = self.getParent();
                        self.parent = parent;
                    
                    } 
                    
                    if(self.parent.id !== parent.id) {
                        var parentId = parseInt(parent);
                        if(angular.isNumber(parentId) && !isNaN(parentId)) {
                            parentDataModel.findOne({id:parentId}).$promise.then(function(resp) {
                                self.parent = resp;
                                getList();
                            })
                        } else {
                            self.parent = parent;
                            getList();
                        }
                    } 
                    

                } else {
                    getListNoParent();
                }

                return self.data;
            },

            /**
             * @ngdoc method
             * @name ListManager#add
             * @methodOf qtime.services.ListManager
             *
             * @description
             * Syncs a new role to loaded roles array 
             *
             * @param {string} item Optional - The Object to add
             */
            add: function(item) {
                var newItem = item || angular.copy(this.defaultNewData);
                var created = this.dataModel.create(newItem);
                this.data.push(created);
                return created;
            },

            /**
             * @ngdoc method
             * @name ListManager#destroy
             * @methodOf qtime.services.ListManager
             *
             * @description
             * Removes the givin object from the list array
             *
             * @param {object} item The object to be removed
             */
            destroy: function(item) {
                var dataItem = _.find(this.data, {id:item.id}, this.data);
                dataItem.$destroy();
                this.data.splice(this.data.indexOf(dataItem), 1);
            },

            findWithId: function(id) {
                return _.find(this.data, {id:id});
            }

        }

        return f;


    }])

.service('StoreService', ['$rootScope', '$cookieStore',
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

 * @ngdoc service
 * @name tvur.services.service:errorHandler
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

 * @ngdoc filter
 * @name tvur.services.directive:minutesFilter
 * 
 * @description
 * Convert mintues since midnight to time
 * 
*/
.filter('minutesFilter', [
    function() {
        return function(time) {
            var hours = parseInt(time / 60);
            var minutes = time - (hours * 60);
            
            if(isNaN(hours) || isNaN(minutes)) {
                return time;
            }

            var hoursStr = hours < 10 ? '0' + hours : hours;
            var minutesStr = minutes < 10 ? '0' + minutes : minutes;

            return hoursStr + ':' + minutesStr;
        
        };
    }]
)


 /**
   *  @ngdoc directive
   *  @name ui.grid.edit.directive:uiGridEditDropdown
   *  @element div
   *  @restrict A
   *
   *  @description dropdown editor for editable fields.
   *  Provides EndEdit and CancelEdit events
   *
   *  Events that end editing:
   *     blur and enter keydown, and any left/right nav
   *
   *  Events that cancel editing:
   *    - Esc keydown
   *
   */


/**

 * @ngdoc directive
 * @name tvur.services.directive:minutesFormatter
 * 
 * @description
 * Attach to a input text field to convert mintues since midnight to time
 * 
*/
.directive('minutesFormatter', function($filter) {
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, ngModelController) {

        /*  
            ngModelController.$parsers.push(function(data) {
                //convert data from view format to model format
                return data; //converted
            });
        */
            ngModelController.$formatters.push(function(data) {
                //convert data from model format to view format
                var formatFilter = $filter('minutesFilter');
                var formattedData = formatFilter(data); // why not???
                return formattedData; //converted
            });
        },

        restrict: 'A',
    }
})



