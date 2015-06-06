
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


/**
 * @ngdoc factory
 * @name bsol.common.factory:ListManager
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
         * @methodOf bsol.common.ListManager
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
             * @methodOf bsol.common.ListManager
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
             * @methodOf bsol.common.ListManager
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
;



