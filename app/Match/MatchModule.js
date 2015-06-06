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





            
        }
    ])

    .controller('MatchlistController', ['$scope', '$stateParams', 'MatchUI', 'Match', '$cookieStore', function($scope, $stateParams, MatchUI, Match, $cookieStore){
        
    }])

    .controller('MatchController', ['resolvedMatch', function(resolvedMatch){
        this.match = resolvedMatch;
    }])



    .factory('Match', ['$sailsResource', '$sailsSocket', '$cookieStore', function($sailsResource, $sailsSocket, $cookieStore){
        var ms = $sailsResource('match', "/api/match/:id", { id: '@id' })
        ms.$name = 'match';

        return ms;

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

        /**
     * @ngdoc service
     * @name tkdscore.match.servie:MatchManger
     * 
     * @description
     * Takes care of managing the match list
     *
    */
    .service('MatchManager', ['ListManager', 'Match', 'Mat', function(ListManager, Match, Mat){

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
                
                var matches = MatchManager.get();


                function newMatch() {
                    var match = MatchManager.add();
                }

                function destroy(match) {
                    // TODO - ask
                    MatchManager.destroy(match);
                }


                this.openEdit = MatchUI.openEdit;
                this.matches = matches;
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
                className: 'ngdialog-theme-normal',
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
 * A template for editing match informatchion
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
                
                var match = {};

                if(angular.isNumber(this.item)) {
                    // if it's ID - get the relevant data
                    match = Match.findOne($scope.item);
                } else {
                    // if not - assume it is the item and work with it directly
                    match = $scope.item;
                }

                function save(match) {
                    match.$save();
                }


                this.match = match;
                this.save = save;
          
            }],

            // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
            link: function($scope, iElm, iAttrs, controller) {

                
            }
        };
    }])









})();


