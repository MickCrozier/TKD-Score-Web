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
            $sailsSocket.post('/api/match/controls/changeRound', {id:id, value:$scope.match.round + val})
            .success(function(resp) {

            })
            .error(function(resp) {
                console.log.error('controls error', resp);
            })
        }

        ms.points = function (id, player, points) {
            $sailsSocket.post('/api/match/controls/points', {id:id, player: player, points:points})
            .success(function(resp) {

            })
            .error(function(resp) {
                console.log.error('controls error', resp);
            })
        }

        ms.penalties = function (id, player, points) {
            $sailsSocket.post('/api/match/controls/penalties', {id:id, player: player, points:points})
            .success(function(resp) {

            })
            .error(function(resp) {
                console.log.error('controls error', resp);
            })
        }

        ms.reset = function (id) {
            $sailsSocket.post('/api/match/controls/reset', {id:id})
            .success(function(resp) {

            })
            .error(function(resp) {
                console.log.error('controls error', resp);
            })
        }

        ms.pauseResume = function (id) {
            $sailsSocket.post('/api/match/controls/pauseResume', {id:id})
            .success(function(resp) {

            })
            .error(function(resp) {
                console.log.error('controls error', resp);
            })
        }

        

        ms.soundhorn = function (id) {
            $sailsSocket.post('/api/match/controls/soundhorn', {id:id})
            .success(function(resp) {

            })
            .error(function(resp) {
                console.log.error('controls error', resp);
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

                function gotoMatch(match) {
                    $state.go('match', {matchId:match.id})
                }

                this.matches = MatchManager.get();
                this.openEdit = MatchUI.openEdit;

                this.gotoControls = gotoControls;
                this.gotoMatch = gotoMatch;
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

                this.save = save;

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
                    Match.changRound(this.match.id, val);
                };

                function points(player, points) {
                    Match.points(this.match.id, player, points);
                };

                function penalties(player, points) {
                    Match.penalties(this.match.id, player, points);
                };

                function reset() {
                    Match.reset(this.match.id);
                };

                function pauseResume() {
                    Match.pauseResume(this.match.id);
                };

                function soundHorn() {
                    Match.soundHorn(this.match.id);
                };

                this.edit = MatchUI.openEdit;
                this.points = points;
                this.penalties = penalties;
                this.reset = reset;
                this.pauseResume = pauseResume;
                this.soundHorn = soundHorn;

            
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


