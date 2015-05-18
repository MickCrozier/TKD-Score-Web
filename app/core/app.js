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
	//'restmod',
    //'ngTagsInput',
    //'ui.grid',
    //'ui.grid.edit',
    //'ui.grid.selection',
    //'ui.grid.expandable',
    //'ui.grid.autoResize',


	'ui.router',
	'ui.bootstrap',
    'ui.keypress',
    'ui.event',
    'ui.select',
    'ui.date',
    'ui.layout',
    //'ui.calendar',
    'xeditable',
    //'rt.popup',
    'ngDialog',
    'cfp.hotkeys',
    'duScroll',
    'ngNotify',

    'bsol.session',
    'bsol.common',

    'sails.io',
    
    'qtime.services',
    'tkdscore.match',
	
])




.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode(false);
        $locationProvider.hashPrefix('');

        $urlRouterProvider.otherwise('/matchlist/');

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



.run(['$log', '$rootScope', '$state', '$stateParams', 'SessionService', 'editableOptions', 'AlertService', '$cookieStore',
    function($log, $rootScope, $state, $stateParams, SessionService, editableOptions, AlertService, $cookieStore) {
         
        ///////////// Config stuff ///////////////////
        
        editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'

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

        SessionService.status().then(function success(session) {
            console.log('Already logged in');
            
        }, function fail(data) {

        });
    }
]);
