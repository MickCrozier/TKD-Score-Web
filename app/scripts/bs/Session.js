'use strict';

angular.module('bs.session', [ // list dependancies
    'ngCookies',
    'ngSanitize',
    'bs.common',
    'ui.bootstrap'
])

/** 
 @ngdoc service
 @name SessionService
 @requires $http $cookieStore
 @description
 Provides session and cookie handling for the application
 Allows for data to persist between refreshes
 Current User specific information should also stored here - such as their organisation
 */
.service('SessionService', ['$log', '$q', '$http', 'Restangular',
    function($log, $q, $http, $rootScope, Restangular) {

        var thisService = {

            session: {},
            params: {},

            /**
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
                    deferred.reject(data.errors);

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
                        deferred.resolve(data.session);
                    }
                    //console.log(data);
                })

                .error(function(data, status, headers, config) {
                    $log.debug('error with getting user status');
                    $log.debug('Got: ' + status);
                    for (var i in data.errors) {
                        $log.debug(data.errors[i].message);
                    }
                    deferred.reject(data.errors);
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
                    deferred.reject(data.errors);
                    thisService.session = {};
                });
            },


            // Update the users credentials - only if the loggedin user has been changed
            updateUser: function(userDetails) {
                if(thisService.session.user.id === userDetails.id) {
                    thisService.session.user = userDetails.clone();
                }
            }



        }; // thisService


        //thisService.status(); //? Why are we calling status at load time??


        return thisService;
    }
])

// need to use controller as syntax in ui-router    controller: 'SessionCtrl as session'
// then session.navbar_isCollapsed in view

.controller('SessionCtrl', ['SessionService', '$stateParams', '$state',
    function(SessionService, $stateParams, $state) {
        // TODO: Try using a header ui-view and loading the contrroller using the routing system!
        // Rather than the controller being loaded by the view

        var vm = this;


        //////////////////////////
        // Bind model variables
        //////////////////////////
        vm.user = SessionService.session.user;

        vm.getOrgId = function() {
            return $stateParams.organisation_id;
        };


        //////////////////////////
        // Init UI Variables
        //////////////////////////
        vm.navbar_isCollapsed = true;
        

        //////////////////////////
        // UI Actions
        //////////////////////////
        vm.onLoginClick = function() {
            SessionService.login(vm.loginFormModel.username, vm.loginFormModel.password)
            .then(function error(errors){
                alert(errors);
            }, function success(session){
            
                // redirect on login?
            //$state.go('organisation_home', {organisation_id: SessionService.session.user.organisation});

                // or just update the view to reflect the new logged in user?
            });
        };

        vm.onLogoutClick = function() {
            SessionService.logout()
            .then(function error(errors){
                alert(errors);
            }, function success() {
                //$state.go('organisation_home', {organisation_id: SessionService.session.user.organisation}); // WON'T WORK - get organisation_id from $stateParams
            });
        };

        vm.onAccountSettingsClick = function() {
            $state.go('user_detail', {
                organisation_id: SessionService.session.user.organisation,
                user_id: SessionService.session.user._id,
            });
        };

        vm.onOrgSettingsClick = function() {
            $state.go('organisation_detail', {
                organisation_id: SessionService.session.user.organisation,
                user_id: SessionService.session.user._id,
            });
        };
    }
]);