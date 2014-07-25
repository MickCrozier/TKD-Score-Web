(function() {
    'use strict';

    
    
    angular.module('bs.common')

    .config(function(RestangularProvider) {
        RestangularProvider.setBaseUrl('/api');
        RestangularProvider.setParentless(true);
        RestangularProvider.setRestangularFields({
          id: '_id',
        });
    })

    .factory('RestFactory', ['$timeout', '$q', 'Restangular', function($timeout, $q, Restangular){
        
        var f = function(args) {
            this.MAX_FIND_RECORDS_LIMIT = 10000;
            this._parent = args.parent || null;

            if(!args.path) {throw new Error('path is required for new RestFactory');}
            this._pathString = args.path;
            this._findRecordLimit = args.limit || this.MAX_FIND_RECORDS_LIMIT;
        };


        f.prototype.setParent = function(restObj) {
            if(!restObj.post) {
                throw new Error('Resource Parent requires a restangularObj');
            }
            this._parent = restObj;
        };

        f.prototype.getParent = function() {
            return this._parent;
        };

        f.prototype.setPath = function(path) {
            this._pathString = path;
        };

        f.prototype.getPath = function() {
            return this._pathString;
        };

        f.prototype.setLimit = function(limit) {
            if(typeof limit !== 'number') {throw new Error('setLimit only accepts a Number');}
            this._findRecordLimit = limit;
        };

        f.prototype.getLimit = function() {
            return this._findRecordLimit;
        };

        f.prototype.find = function(id) {
            var defer = $q.defer();
            Restangular.one(this._pathString, id).get().then(function(item) {
                defer.resolve(item);
            }, function fail(err) {
                defer.reject(err);
            });
            return defer.promise;
        };

        f.prototype.findList = function(searchParams) {
            var defer = $q.defer();
            if(!searchParams) {searchParams = {};}
            searchParams.limit = searchParams.limit || this._findRecordLimit;
            // TODO need to lock search to parent!

            Restangular.all(this._pathString, searchParams).getList().then(function success(items) {
                defer.resolve(items);
            }, function fail(err) {
                defer.reject(err);
            });
            return defer.promise;
        };

        f.prototype.generateNew = function(newRecord) {
            return Restangular.restangularizeElement(null, newRecord, this._pathString);
        };

        f.prototype.create = function(newRecord) {
            var defer = $q.defer();
            newRecord = this.generateNew(newRecord);
            
            newRecord.post().then(function success(item) {
                defer.resolve(item);
            }, function fail(err) {
                defer.reject(err);
            });
            return defer.promise;
        };

        f.prototype.initList = function() {
            var l = [];
            Restangular.restangularizeCollection(this._parent, l, this._pathString);
            return l;
        };


        return f;
        
    }]);

  

})();
