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
            templateUrl: 'views/match/detail.html',
            controller: 'MatchCtrl',
            resolve: {
                resolved_match: MatchModule.new_match,
            }
        })

        .state('match', {
            abstract: true,
            url: '/:match_id',
            templateUrl: 'views/match/parent.html',
            resolve: {
                resolved_match: MatchModule.resolve_match,
            }
        })

        .state('match_detail', {
            parent:'match',
            url: '/detail',
            controller: 'MatchCtrl',
            templateUrl: 'views/match/detail.html',
        })

        .state('match_home', {
            parent: 'match',
            controller: 'MatchCtrl',
            url: '/',
            templateUrl: 'views/match/home.html',
        })

        .state('match_scoreboard', {
            parent: 'match',
            controller: 'MatchControlsCtrl',
            url: '/scoreboard',
            templateUrl: 'views/match/scoreboard.html',
        })

        .state('match_controls', {
            parent: 'match',
            controller: 'MatchControlsCtrl',
            url: '/controls',
            templateUrl: 'views/match/controls.html',
        })

        .state('match_master', {
            parent: 'match',
            controller: 'MatchControlsCtrl',
            url: '/master',
            templateUrl: 'views/match/match_master.html',
        });

    }]
)


/**
 * @ngdoc filter
 * @name formatTime
 * @function
 * 
 * @description
 * To a millisecon value - returns minutes and seconds
 * isCountDown adds 999 milliseconds to display - to 0 is triggered when it changes to 0
 * rather than 1 second later
 */
.filter('formatTime', [

    function() {
        return function(rawtime, isCountDown) {

            var adjustedTime = rawtime;
            // when counting down need to add time on the display so that timers will appear to stop SMACK ON 00:00
            if(isCountDown) { 
              adjustedTime = rawtime + 999; 
            }

            var ds = Math.round(adjustedTime/100) + '';
            var sec = Math.floor(adjustedTime/1000);
            var min = Math.floor(adjustedTime/60000);
            ds = ds.charAt(ds.length - 1);

            sec = sec - 60 * min + '';

            if(sec.charAt(sec.length - 2) !== '') {
              sec = sec.charAt(sec.length - 2) + sec.charAt(sec.length - 1);
            } else {
              sec = 0 + sec.charAt(sec.length - 1);
            } 
            min = min + '';

            if(min.charAt(min.length - 2) !== '')
            {
              min = min.charAt(min.length - 2)+min.charAt(min.length - 1);
            } else {
              min = 0 + min.charAt(min.length - 1);
            }
            //return min + ':' + sec + ':' + ds;
            return min + ':' + sec;
        };


    }
])

/**
 * @ngdoc filter
 * @name formatPenalties
 * @function
 * 
 * @description
 * Converts number into html images
 */
.filter('formatPenalties', [

    function() {
        return function(num) {
            var r = '';
            var penalties = (num/2)
            var filled = 0;
            
            for(var i = 0; i<Math.floor(penalties); i++) {
                //r+= '&#x2588 ';
                r+= '<img src="/images/mark_gamjeom.png" class="scoreboard-mark">'
                filled++;
            }
            
            if(Math.floor(num/2) != penalties && penalties !=0) {
                //r+= '&#x2584 ' ;

                r+= '<img src="/images/mark_kyongo.png" class="scoreboard-mark">';
                filled++;
            }
            
            while(filled < 4) {
                //r+= '_ ' ;
                r+= '<img src="/images/mark_blank.png" class="scoreboard-mark">';
                filled++    
            }
            return r;
        };
    }
]);

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

MatchModule.new_match = ['MatchService',
    function(MatchService) {
        return MatchService.generateNew({});
    }
];

})();