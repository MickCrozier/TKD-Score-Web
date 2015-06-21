/*
    This file is part of TKD Score Web.
    Copyright 2015 Mick Crozier

    TKD Score Web is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    TKD Score Web is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with TKD Score Web.  If not, see <http://www.gnu.org/licenses/>.
 */
 
'use strict';

/**
 * @ngdoc overview
 * @name tvurApp
 * @description
 * # tvurApp
 *
 * Main module of the application.
 */
angular.module('tkdscore', [
	'ngAnimate',
	'ngCookies',
	'ngSanitize',
	'ngTouch',

	'ui.router',
	'ui.bootstrap',
    'ngDialog',
    'cfp.hotkeys',
    'ngNotify',

    'bsol.session',
    'bsol.common',

    'sails.io',
    'qtime.services',
    'tkdscore.match',
    'tkdscore.mat',
])




.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode(false);
        $locationProvider.hashPrefix('');

        $urlRouterProvider.otherwise('/');

        $stateProvider.state('front', {
            url: '/',
            templateUrl: 'core/views/main.html',
            //controller: 'MainCtrl'
        });
    }
])


.config(['$provide', function($provide) {
    // Add force reload to $state
    $provide.decorator('$state', function($delegate, $stateParams) {
        $delegate.forceReload = function() {
            return $delegate.go($delegate.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        };
        return $delegate;
    });
}])


// Socket error handling - does not work well.
.run(['$sailsSocket', '$state', 'AlertService', function($sailsSocket, $state, AlertService){
    
    $sailsSocket.subscribe('connect', function(data) {
        console.log('Socket conneted:', data);
    });

    $sailsSocket.subscribe('disconnect', function(data) {
        console.log('Socket conneted:', data);
        //reload();
    });

    $sailsSocket.subscribe('reconnecting', function(data) {
        console.log('Socket conneted:', data);
        //reload();
    });

    $sailsSocket.subscribe('reconnect', function(data) {
        console.log('Socket conneted:', data);
    });

    $sailsSocket.subscribe('error', function(data) {
        console.log('Socket error:', data);
        //reload();
    });

   


    var reload = function() {
        AlertService.areYouSure('Realtime socket error. Do you wish to reload?', function() {
            $state.forceReload();
        }, function() {
            // Just close
        })
    }

}])


/*

// Set the theme for xeditable
.run(['editableOptions', function(editableOptions){
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
}])
*/

.run(['$log', '$rootScope', '$state', '$stateParams', 'SessionService', 'AlertService', '$cookieStore',
    function($log, $rootScope, $state, $stateParams, SessionService, AlertService, $cookieStore) {
         
        ///////////// Config stuff ///////////////////
        

        FastClick.attach(document.body);
        



        ////////////////////////////////////////////////////////
        // THIS IS WHERE THE GLOBAL CODE GOES

        $rootScope.APP_VERSION = '0.0.0';
        $rootScope.server_version = '0.0.0'; // this should be updated when first calling login status

        $rootScope.loading = false;
        $rootScope.showLoading = function() {
            $rootScope.loading = true;
        };

        $rootScope.hideLoading = function() {
            $rootScope.loading = false;
        };

        $rootScope.$log = $log;


        


        

        //////////////////////////////////////////////////

        $rootScope.alerts = AlertService;




        

        //////// GLOBAL EVENT ACTIONS /////////////////

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            $rootScope.showLoading();
            

            /*

            // SECURTIY
            if (SessionService.session && SessionService.session.authenticated) {

              
                console.log(toState)
                // Check user has the same org_code or is an authorised admin
                if(SessionService.session.user.organisation != toParams.organisation_id ) { // check the code
                    console.log('User not permitted - organisation_id mismatch - DENY THE CHANGE - how do we do this?')
                    $state.go('organisation_home', {organisation_id: SessionService.session.user.organisation})
                    //event.preventDefault()
                }

            } 
            */
            


        });



        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            $rootScope.hideLoading();
            $log.debug('State change success');
            //$scope.newLocation = $location.path();
            //if(fromParams.user_id) StateService.put('user_id', fromParams.user_id);
            //if(fromParams.timesheet_id) StateService.put('timesheet_id', fromParams.timesheet_id);
            //if(fromParams.org_code) StateService.put('org_code', fromParams.org_code);
        });

        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            $rootScope.hideLoading();
            alert('Navigation error: ' + error);
            throw error;
        });

        $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
            $rootScope.hideLoading();
            $log.debug('State not found: ' + unfoundState.to); // "lazy.state"
            $log.debug(unfoundState.toParams); // {a:1, b:2}
            $log.debug(unfoundState.options); // {inherit:false} + default options
        });


        // check if we are logged in - also established session
        SessionService.status().then(function success(session) {
            console.log('Already logged in');
            
        }, function fail(data) {

        });
    }
]);
