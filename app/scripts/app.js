'use strict';

/**
 * @ngdoc overview
 * @name tvurApp
 * @description
 * # tvurApp
 *
 * Main module of the application.
 */
angular.module('tkdApp', [
	'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'restangular',

    'ui.router',
    'ui.bootstrap',
    'xeditable',

    'bs.common',
    'tkdApp.match',
])


.config(function(RestangularProvider) {
    RestangularProvider.setBaseUrl('/api');
    RestangularProvider.setParentless(true);
    RestangularProvider.setRestangularFields({
      id: '_id',
    });
})

.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider) {
        $locationProvider.html5Mode(false);
        $locationProvider.hashPrefix('');

        $urlRouterProvider.otherwise('/');

        
        $stateProvider.state('front', {
            url: '/',
            templateUrl: 'views/main.html',
            controller: 'MainCtrl'
        });
        

    }
])


.run(['$log', '$rootScope', '$state', '$stateParams', 'editableOptions',
    function($log, $rootScope, $state, $stateParams, editableOptions) {
        
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
        


        //////////////////////////////////////////////////


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
            $log.error(error);
            alert('Navigation error: ' + error.data.message);
            throw error;
        });

        $rootScope.$on('$stateNotFound', function(event, unfoundState, fromState, fromParams) {
            $rootScope.hideLoading();
            $log.debug('State not found: ' + unfoundState.to); // "lazy.state"
            $log.debug(unfoundState.toParams); // {a:1, b:2}
            $log.debug(unfoundState.options); // {inherit:false} + default options
        });

        $rootScope.$on('sessionLogin', function(event, user) {
            //while we need to do this - it's really annoying as we cannot refresh the page!
            //$state.go('organisation_home', {organisation_id: SessionService.session.user.organisation});
        });

        $rootScope.$on('sessionLogout', function(event, user) {
            //console.log(event);
            //$state.go('organisation_home', {organisation_id: SessionService.session.user.organisation});
        }) ;

    }
]);
