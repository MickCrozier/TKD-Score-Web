(function() {
    'use strict';


var MatchModule = angular.module('tkdApp.match', [ // list dependancies
    'ui.bootstrap'
])

.config(['$stateProvider',
    function($stateProvider) {
        
        $stateProvider
        .state('match_list', {
            url: '/',
            templateUrl: 'views/match/list.html',
            controller: 'MatchListCtrl'
        })

        .state('match_new', {
            url: '/new',
            templateUrl: 'views/match/new.html',
            controller: 'MatchCtrl',
        })

        .state('match', {
            abstract: true,
            url: '/:match_id',
            controller: 'MatchCtrl',
            templateUrl: 'views/match/parent.html',
            resolve: {
                resolved_match: MatchModule.resolve_match,
            }
        })

        .state('match_detail', {
            parent:'match',
            url: '/detail',
            templateUrl: 'views/match/detail.html',
            //controller: 'MatchCtrl',
        })

        .state('match_home', {
            parent: 'match',
            controller: 'MatchCtrl',
            url: '/',
            templateUrl: 'views/match/home.html',
        })

        .state('match_scoreboard', {
            parent: 'match',
            controller: 'MatchCtrl',
            url: '/',
            templateUrl: 'views/match/scoreboard.html',
        });
    }]
);

MatchModule.resolve_match = ['$q', '$stateParams', 'MatchService',
        function($q, $stateParams, MatchService) {
            var defer = $q.defer();
            MatchService.find($stateParams.match_id).then(function(foundItem) {
                defer.resolve(foundItem);
            }, function fail(err) {
                defer.reject(err);
            });

            return defer.promise;
        }
    ];

})();