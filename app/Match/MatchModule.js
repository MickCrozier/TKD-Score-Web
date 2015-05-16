(function() {
    'use strict';

    var Module = angular.module('tkdscore.match', [ // list dependancies
        'bsol.session',
        'ui.bootstrap',
        'sailsResource',
        'ngDialog',
    ])

    .config(['$stateProvider',
        function($stateProvider) {
            $stateProvider
            .state('matchlist', {
                url: '/matchlist/',
                //parent:'',
                template: '<match-list></match-list>',
                //templateUrl: 'cues/views/showlist.html',
                controller: 'MatchlistController',
                controllerAs: 'MatchlistController'
            })

            .state('match', {
                url: '/match/:matchId',
                template: '<div ui-view=""></div>',
                abstract:true,
                controller: 'MatchController',
                controllerAs: 'MatchController',
                resolve: {
                    resolvedMatch: ['$stateParams', 'Match', 'MatchService', function($stateParams, Match, MatchService) {
                            return MatchService.get($stateParams.matchId).$promise;
                        }
                    ]
                }
            })

            .state('controls', {
                url: '/controls',
                template: '<match-controls match="MatchController.match"></match-controls>',
                parent:'match',
            })

            .state('scoreboard', {
                url: '/scordboard',
                template: '<scoreboard match="MatchController.match"></scoreboard>',
                parent:'match',
            })

            .state('master', {
                url: '/master',
                templateUrl: 'match/views/template-master.html',
                parent:'match',
            })

            .state('judge', {
                url: '/judge',
                template: '<match-judge match="MatchController.match"></match-judge>',
                parent:'match',
            })


            
        }
    ])

    .controller('MatchlistController', ['$scope', '$stateParams', 'MatchUI', 'Match', function($scope, $stateParams, MatchUI, Match){
        
    }])

    .controller('MatchController', ['resolvedMatch', function(resolvedMatch){
        this.match = resolvedMatch;
    }])



    .factory('Match', ['$sailsResource', '$sailsSocket', function($sailsResource, $sailsSocket){
        var ms = $sailsResource('match', "/api/match/:id", { id: '@id' })
        ms.$name = 'match';


        ms.changeRound = function(id, val) {
            $sailsSocket.post('/api/match/controls/changeRound', {id:id, value:val})
            .success(function(resp) {

            })
            .error(function(resp) {
                console.error('controls error', resp);
            })
        }

        ms.points = function (id, player, points) {
            $sailsSocket.post('/api/match/controls/points', {id:id, player: player, points:points})
            .success(function(resp) {

            })
            .error(function(resp) {
                console.error('controls error', resp);
            })
        }

        ms.penalties = function (id, player, points) {
            $sailsSocket.post('/api/match/controls/penalties', {id:id, player: player, points:points})
            .success(function(resp) {

            })
            .error(function(resp) {
                console.error('controls error', resp);
            })
        }

        ms.resetMatch = function (id) {
            $sailsSocket.post('/api/match/controls/resetMatch', {id:id})
            .success(function(resp) {

            })
            .error(function(resp) {
                console.error('controls error', resp);
            })
        }

        ms.pauseResume = function (id) {
            $sailsSocket.post('/api/match/controls/pauseResume', {id:id})
            .success(function(resp) {

            })
            .error(function(resp) {
                console.error('controls error', resp);
            })
        }

        

        ms.soundHorn = function (id) {
         
            $sailsSocket.post('/api/match/controls/soundhorn', {id:id})
            .success(function(resp) {

            })
            .error(function(resp) {
                console.error('controls error', resp);
            })
        }


        ms.registerScore = function (id, player, target, turning) {
            $sailsSocket.post('/api/match/controls/registerscore', {id:id, player: player, target:target, turning:turning})
            .success(function(resp) {

            })
            .error(function(resp) {
                console.error('controls error', resp);
            })
        }

        ms.registerJudge = function (id) {
            $sailsSocket.post('/api/match/judge', {id:id})
            .success(function(resp) {

            })
            .error(function(resp) {
                console.error('Judge Registration Error', resp);
            })
        }

        ms.removeJudge = function (id, judge) {
            $sailsSocket.post('/api/match/removejudge', {id:id, judge: judge})
            .success(function(resp) {

            })
            .error(function(resp) {
                console.error('Judge Remove Error', resp);
            })
        }

        return ms;

    }])

        /**
     * @ngdoc service
     * @name tkdscore.match.servie:MatchManger
     * 
     * @description
     * Takes care of managing the match list
     *
    */
    .service('MatchManager', ['ListManager', 'Match', function(ListManager, Match){

        return new ListManager({
            parentDataModel: null,
            dataModel: Match,
            defaultNewData: {},
            hasParent: false,
        })

    }])


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
                var penalties = (num/2);
                var filled = 0;
                
                for(var i = 0; i<Math.floor(penalties); i++) {
                    //r+= '&#x2588 ';
                    r+= '<img src="/images/mark_gamjeom.png" class="scoreboard-mark">';
                    filled++;
                }
                
                if(Math.floor(num/2) !== penalties && penalties !== 0) {
                    //r+= '&#x2584 ' ;

                    r+= '<img src="/images/mark_kyongo.png" class="scoreboard-mark">';
                    filled++;
                }

                
                while(filled < 4) {
                    //r+= '_ ' ;
                    r+= '<img src="/images/mark_blank.png" class="scoreboard-mark">';
                    filled++;    
                }
                return r;
            };
        }
    ])

    .directive('matchList', [function(){
        return {
            scope: {},
            controllerAs: 'matchListVm',
            controller: ['$scope', '$state', 'MatchUI', 'MatchManager', function($scope, $state, MatchUI, MatchManager) {
                
        
                function gotoControls(match) {
                    $state.go('controls', {matchId:match.id})
                }

                function newMatch() {
                    var match = MatchManager.add();
                }

                function destroy(match) {
                    // TODO - ask
                    MatchManager.destroy(match);
                }

                function gotoMaster(match) {
                    $state.go('master', {matchId:match.id})
                }

                function gotoScoreboard(match) {
                    $state.go('scoreboard', {matchId:match.id})
                }

                this.matches = MatchManager.get();
                this.openEdit = MatchUI.openEdit;

                this.gotoControls = gotoControls;
                this.gotoScoreboard = gotoScoreboard;
                this.gotoMaster = gotoMaster;
                this.newMatch = newMatch;
                this.destroy = destroy;
            }],
            restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
            templateUrl: 'match/views/template-list.html',
            
            link: function($scope, iElm, iAttrs, controller) {
                
            }
        };
    }])





/**
 * @ngdoc service
 * @name tkdscore.match.service:MatchUI
 * 
 * @description
 * A collection of UI helpers that can be called in js
 *
*/
    .service('MatchUI', ['ngDialog', function(ngDialog){

        // Opens a dialog containg the cuebuilder directive for editing cues.
        // accepts either the cue id or the cue model itself
        this.openEdit = function(item) {
            var dialog = ngDialog.open({

                plain: true,
                //className: 'ngdialog-theme-normal',
                template:'<div><matcheditor item="item"></matcheditor></div>',
                
                controller: ['$scope',
                    function($scope) {
                        $scope.item = item;
                    }
                ]
            });
            return dialog.closePromise;
        };

    }])






    /**
 * @ngdoc directive
 * @name tkdscore.match.directive:matcheditor
 * 
 * @description
 * A template for editing match information
 *
 * <pre> <matcheditor> item="myIdOrMyMatchItem"></matcheditor> </pre>
*/
    .directive('matcheditor', [ function(){
        // Runs during compile
        return {
            // name: '',
            // priority: 1,
            // terminal: true,
            scope: {
                item: '=',
            }, // {} = isolate, true = child, false/undefined = no change
            // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
            templateUrl: 'match/views/template-edit.html',
            controllerAs: 'matchEditorVm',
            controller: ['$scope', 'AlertService', 'Match', function($scope, AlertService, Match){
                if(angular.isNumber(this.item)) {
                    // if it's ID - get the relevant data
                    this.match = Match.findOne($scope.item);
                } else {
                    // if not - assume it is the item and work with it directly
                    this.match = $scope.item;
                }

                function save(match) {
                    this.match.$save();
                }

                function removeJudge(judge) {
                    Match.removeJudge(this.match.id, judge)
                }

                this.save = save;
                this.removeJudge = removeJudge;

            }],

            // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
            link: function($scope, iElm, iAttrs, controller) {

                
            }
        };
    }])

    .directive('matchControls', [ function(){
        // Runs during compile
        return {
            // name: '',
            // priority: 1,
            // terminal: true,
            scope: {
                match: '=',
            }, // {} = isolate, true = child, false/undefined = no change
            // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
            templateUrl: 'match/views/template-controls.html',
            controllerAs: 'matchControlsVm',
            controller: ['$scope', 'AlertService', 'Match', 'MatchUI', function($scope, AlertService, Match, MatchUI){
                if(angular.isNumber($scope.match)) {
                    // if it's ID - get the relevant data
                    this.match = Match.findOne($scope.match);
                } else {
                    // if not - assume it is the item and work with it directly
                    this.match = $scope.match;
                }

                function changeRound(val) {
                    Match.changeRound(this.match.id, this.match.round + val);
                };

                function points(player, points) {
                    Match.points(this.match.id, player, points);
                };

                function penalties(player, points) {
                    Match.penalties(this.match.id, player, points);
                };

                function resetMatch() {
                    Match.resetMatch(this.match.id);
                };

                function pauseResume() {
                    Match.pauseResume(this.match.id);
                };

                function soundHorn() {
                    Match.soundHorn(this.match.id);
                };

                function edit() {
                    MatchUI.openEdit(this.match);
                }

                function removeJudge(judge) {
                    Match.removeJudge(this.match.id, judge)
                }

                this.edit = edit;
                this.points = points;
                this.penalties = penalties;
                this.resetMatch = resetMatch;
                this.pauseResume = pauseResume;
                this.soundHorn = soundHorn;
                this.changeRound = changeRound;

            
            }],

            // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
            link: function($scope, iElm, iAttrs, controller) {

            }
        };
    }])

    .directive('matchJudge', [ function(){
        // Runs during compile
        return {
            // name: '',
            // priority: 1,
            // terminal: true,
            scope: {
                match: '=',
            }, // {} = isolate, true = child, false/undefined = no change
            // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
            templateUrl: 'match/views/template-judge.html',
            controllerAs: 'matchJudgeVm',
            controller: ['$scope', 'AlertService', 'Match', 'MatchUI', 'SessionService', function($scope, AlertService, Match, MatchUI, SessionService){
                var self = this;
                if(angular.isNumber($scope.match)) {
                    // if it's ID - get the relevant data
                    this.match = Match.findOne($scope.match);
                } else {
                    // if not - assume it is the item and work with it directly
                    this.match = $scope.match;
                }

                var timers = {
                    1: null,
                    2: null,
                }

                var taps = {
                    1: {body: 0, head:0},
                    2: {body: 0, head:0},
                }
                

                function tap(player, target) {
                  
                    taps[player][target] += 1;

                    if(timers[player] === null) {
                        timers[player] = setTimeout(function() {
                            
                            tranmitTaps(player, taps[player][target], target);

                            timers[player] = null;
                            taps[player][target] = 0;
                        }, 250);
                    }

                };


                function tranmitTaps(player, numberOfTaps, target) {
                    var turning = false;
                    if(numberOfTaps > 1) {
                        turning = true;
                    }
                    console.log('Sending Taps', player, target, turning)
                    Match.registerScore(self.match.id, player, target, turning)
                }


                function register() {
                    Match.registerJudge(this.match.id);
                }

                function notRegistered() {
                    var judges = [
                        this.match.judge1,
                        this.match.judge2,
                        this.match.judge3,
                        this.match.judge4,
                    ];

                    _.forEach(judges, function(judgeIdentifier) {
                        var reg = false
                        var myIdent = SessionService.session.session.id;
                        if(judgeIdentifier === myIdent) {
                            reg = true;
                        }
                    })
                    return reg;
                }

                this.tap = tap;
                this.register = register;
                this.notRegistered = notRegistered;

            
            }],

            // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
            link: function($scope, iElm, iAttrs, controller) {

            }
        };
    }])

    .directive('highlightOnChange', ['$timeout', function($timeout) {
        return {

            scope: {
                ngBind: '=',
                highlightOnChange: '@',
                highlightOnChangeTime: '@',
            }, // {} = isolate, true = child, false/undefined = no change
            // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
            link: function($scope, iElm, iAttrs, controller) {

                $scope.$watch('ngBind', function() {
                    iElm.addClass($scope.highlightOnChange);
                    $timeout(function() {
                        iElm.removeClass($scope.highlightOnChange);
                    }, $scope.highlightOnChangeTime || 1000)
                })
            }
        };
    }])

    .directive('scoreboard', [ function(){
        // Runs during compile
        return {
            // name: '',
            // priority: 1,
            // terminal: true,
            scope: {
                match: '=',
            }, // {} = isolate, true = child, false/undefined = no change
            // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
            templateUrl: 'match/views/template-scoreboard.html',
            controllerAs: 'scoreboardVm',
            controller: ['$scope', '$timeout', '$sailsSocket', 'ngNotify', 'Match', 'MatchUI', function($scope, $timeout, $sailsSocket, ngNotify, Match, MatchUI){
                var self = this;
                var horn = new Audio('sounds/beep1.wav');

                if(angular.isNumber($scope.match)) {
                    // if it's ID - get the relevant data
                    this.match = Match.findOne($scope.match);
                } else {
                    // if not - assume it is the item and work with it directly
                    this.match = $scope.match;
                }

                this.timer = {
                    roundTimeMS: this.match.roundTimeMS,
                    breakTimeMS: this.match.breakTimeMS,
                    pauseWatchMS: 0,
                };

                $sailsSocket.subscribe('roundtime', function(resp) {
                    self.timer.roundTimeMS = resp.ms;
                });

                $sailsSocket.subscribe('pausetime', function(resp) {
                    self.timer.pauseWatchMS = resp.ms;
                });

                $sailsSocket.subscribe('breaktime', function(resp) {
                    self.timer.breakTimeMS = resp.ms;
                });

                $sailsSocket.subscribe('soundhorn', function(resp) {
                    horn.play();
                });

                var PLAYER_TITLE = {
                    1: 'Hong',
                    2: 'Chong',
                }

                var judgeIndicator = {};
                judgeIndicator[1] = [0,0,0,0];
                judgeIndicator[2] = [0,0,0,0];
                    


                $sailsSocket.subscribe('judge', function(resp) {    

                    console.log('JUDGE: ', resp.source, resp.player, resp.points);
                    //ngNotify.set('JUDGE: ' + resp.judge + ' (' + resp.source + ') ' + PLAYER_TITLE[resp.player] + ' ' + resp.points + ' points');
                    
                    showJudgeIndicator(resp.judge, resp.player, resp.points);
                });

                function showJudgeIndicator(judge, player, points) {
                    judgeIndicator[player][judge - 1] = points;
                    $timeout(function() {
                        judgeIndicator[player][judge - 1] = 0;
                    }, self.match.scoreTimeout * 0.75);
                }



                
                this.judgeIndicator = judgeIndicator;



            
            }],

            // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
            link: function($scope, iElm, iAttrs, controller) {

                
            }
        };
    }])

    .service('MatchService', ['Match', function(Match) {
        this.Model = Match;
        this.item = {};

        var self = this;

        this.get = function(id) {
            if(!id) {
                return self.item;
            }

            if(self.item.id === id) {
                return this.item;
            } else {
                self.item = this.Model.findOne({id:id})
            }
            return self.item;
        }

    }])







})();


