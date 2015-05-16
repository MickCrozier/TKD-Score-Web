'use strict';

angular.module('bsol.session', [ // list dependancies
    'ngSanitize',
    'bsol.common',
    'ui.bootstrap',
    'ui.router',
])




/** 
 @ngdoc service
 @name NetworkErrorService
 @requires
 @description
 Needs to be moved to another module
 */
.service('NetworkErrorService', [function(){
    var translate = function(errCode) {
        var msg = '';
        switch(errCode) {
            case 'ECONNREFUSED':
                msg = 'Unable to connect to server - Connection Refused';
                break;
            default:
                msg = 'An error occurred - ' + errCode;
        }

        return msg;
    };

    return {
        translate: translate,
    };
}])




/** 
 @ngdoc service
 @name bsol.session.service:SessionService
 @requires $http $cookieStore
 @description
 Provides session and cookie handling for the application
 Allows for data to persist between refreshes
 Current User specific information should also stored here - such as their organisation
 */
.service('SessionService', ['$log', '$q', '$http', '$rootScope',
    function($log, $q, $http, $rootScope) {

        
        var thisService = {

            session: {},
            params: {},

    /**
    
    @function
    @name bsol.session.SessionService.method:login
    @description 
    Log in to the remote server. Fetches session information
    @param {string} username Username to log in with
    @param {string} password The plain text password
    */
            login: function(username, password) {

                var deferred = $q.defer();

                $http({
                    url: '/api/login',
                    method: 'POST',
                    data: JSON.stringify({
                        username: username,
                        password: password
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                .success(function(data, status, headers, config) {
                    //Restangular.restangularizeElement(null, data.user, 'User');
                    thisService.session = data.session;
                    deferred.resolve(data.session);
                })

                .error(function(data, status, headers, config) {
                    console.log('error logging in');
                    console.log('Got: ' + status);
                    for (var i in data.errors) {
                        console.log(data.errors[i].message);
                    }
                    deferred.reject(data);

                });

                return deferred.promise;
            },


            /**
  @description
  Fetches session information from the remote server
  */
            status: function() {
                var deferred = $q.defer();

                $http({
                    url: '/api/login',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })

                .success(function(data, status, headers, config) {
                    
                    if (data.session) {
                        //Restangular.restangularizeElement(null, data.session.user, 'User');
                        thisService.session = data.session;
                        console.log(data.session);
                        deferred.resolve(data.session);
                    } else {
                        deferred.reject(data);
                    }
                    
                })

                .error(function(data, status, headers, config) {
                    $log.debug('error with getting user status');
                    $log.debug('Got: ' + status);
                    for (var i in data.errors) {
                        $log.debug(data.errors[i].message);
                    }
                    deferred.reject(data);
                });

                return deferred.promise;
            },

            /**
  @description
  Remove the current session information from the remote server
  */
            logout: function() {

                var deferred = $q.defer();

                $http({
                    url: '/api/logout',
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })

                .success(function(data, status, headers, config) {
                    thisService.session = {};
                    deferred.resolve(data.session);
                })

                .error(function(data, status, headers, config) {
                    for (var i in data.errors) {
                        $log.debug('Error: ' + data.errors[i].message);
                    }
                    deferred.reject(data);
                    thisService.session = {};
                });

                return deferred.promise;
            },


            // Update the users credentials - only if the loggedin user has been changed
            updateUser: function(userDetails) {
                if(thisService.session.user.id === userDetails.id) {
                    thisService.session.user = userDetails;
                }
            }



        }; // thisService


        //thisService.status(); //? Why are we calling status at load time??
        return thisService;
    }
])



.controller('SessionController', ['$scope', 'SessionService', '$stateParams', '$state', 'AlertService',
    function($scope, SessionService, $stateParams, $state, AlertService) {
        // TODO: Try using a header ui-view and loading the contrroller using the routing system!
        // Rather than the controller being loaded by the view



        //////////////////////////
        // Bind model variables
        //////////////////////////
        $scope.user = SessionService.session.user;
        $scope.contact = SessionService.session.contact;
        $scope.session = SessionService.session;

        $scope.getOrgId = function() {
            return $stateParams.organisation_id;
        };


        //////////////////////////
        // Init UI Variables
        //////////////////////////
        $scope.navbar_isCollapsed = true;
        

        ////////////////////////// 
        // UI Actions
        //////////////////////////
        $scope.onLoginClick = function() {
            SessionService.login($scope.loginFormModel.username, $scope.loginFormModel.password)
            .then(function success(session){
                 // redirect on login?
                console.log('logging in');
                $scope.user = SessionService.session.user;
                $scope.contact = SessionService.session.contact;
                $scope.session = SessionService.session;
                $state.go('organisation_home', {organisation_id: SessionService.session.contact.organisation});
                
                // or just update the view to reflect the new logged in user?
            }, function fail(errors){
                AlertService.addAlert(errors, 'danger');
               
            });
        };

        $scope.onLogoutClick = function() {
            SessionService.logout()
            .then(function success(){
                 // redirect on login?
                //$state.go('organisation_home', {organisation_id: SessionService.session.user.organisation});
                $scope.session = SessionService.session;
                $scope.contact = SessionService.session.contact;
                $scope.user = SessionService.session.user;

                // or just update the view to reflect the new logged in user?
            }, function fail(errors){
                alert(errors);
               
            });
        };

        $scope.onAccountSettingsClick = function() {
            $state.go('user_detail', {
                organisation_id: SessionService.session.contact.organisation,
                user_id: SessionService.session.user.id,
            });
        };

        $scope.onOrgSettingsClick = function() {
            $state.go('organisation_detail', {
                organisation_id: SessionService.session.contact.organisation,
                user_id: SessionService.session.user.id,
            });
        };
    }
]);