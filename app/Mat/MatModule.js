(function() {
    'use strict';

    var Module = angular.module('tkdscore.mat', [ // list dependancies
        'bsol.session',
        'ui.bootstrap',
        'sailsResource',
        'ngDialog',
    ])

    .config(['$stateProvider',
        function($stateProvider) {
            $stateProvider
            .state('matlist', {
                url: '/matlist/',
                //parent:'',
                template: '<mat-list></mat-list>',
                //templateUrl: 'cues/views/showlist.html',
                controller: 'MatlistController',
                controllerAs: 'MatlistController'
            })

            .state('mat', {
                url: '/mat/:matId',
                template: '<div ui-view=""></div>',
                abstract:true,
                controller: 'MatController',
                controllerAs: 'MatController',
                resolve: {
                    resolvedMat: ['$stateParams', 'Mat', 'MatService', function($stateParams, Mat, MatService) {
                            return MatService.get($stateParams.matId).$promise;
                        }
                    ]
                }
            })

            .state('controls', {
                url: '/controls',
                template: '<mat-controls mat="MatController.mat"></mat-controls>',
                parent:'mat',
            })

            .state('scoreboard', {
                url: '/scordboard',
                template: '<scoreboard mat="MatController.mat"></scoreboard>',
                parent:'mat',
            })

            .state('master', {
                url: '/master',
                templateUrl: 'mat/views/template-master.html',
                parent:'mat',
            })

            .state('judge', {
                url: '/judge',
                template: '<mat-judge mat="MatController.mat"></mat-judge>',
                parent:'mat',
            })


            
        }
    ])

    .controller('MatlistController', ['$scope', '$stateParams', 'MatUI', 'Mat', '$cookieStore', function($scope, $stateParams, MatUI, Mat, $cookieStore){
        
    }])

    .controller('MatController', ['resolvedMat', function(resolvedMat){
        this.mat = resolvedMat;
    }])



    .factory('Mat', ['$sailsResource', '$sailsSocket', '$cookieStore', function($sailsResource, $sailsSocket, $cookieStore){
        var ms = $sailsResource('mat', "/api/mat/:id", { id: '@id' })
        ms.$name = 'mat';


        ms.changeRound = function(id, val) {
            $sailsSocket.post('/api/mat/controls/changeRound', {id:id, value:val})
            .success(function(resp) {

            })
            .error(function(resp) {
                console.error('controls error', resp);
            })
        }

        ms.points = function (id, player, points) {
            $sailsSocket.post('/api/mat/controls/points', {id:id, player: player, points:points})
            .success(function(resp) {

            })
            .error(function(resp) {
                console.error('controls error', resp);
            })
        }

        ms.penalties = function (id, player, points) {
            $sailsSocket.post('/api/mat/controls/penalties', {id:id, player: player, points:points})
            .success(function(resp) {

            })
            .error(function(resp) {
                console.error('controls error', resp);
            })
        }

        ms.resetMat = function (id) {
            $sailsSocket.post('/api/mat/controls/resetMat', {id:id})
            .success(function(resp) {

            })
            .error(function(resp) {
                console.error('controls error', resp);
            })
        }

        ms.pauseResume = function (id) {
            $sailsSocket.post('/api/mat/controls/pauseResume', {id:id})
            .success(function(resp) {

            })
            .error(function(resp) {
                console.error('controls error', resp);
            })
        }

        

        ms.soundHorn = function (id) {
         
            $sailsSocket.post('/api/mat/controls/soundhorn', {id:id})
            .success(function(resp) {

            })
            .error(function(resp) {
                console.error('controls error', resp);
            })
        }


        ms.registerScore = function (id, player, target, turning) {

            $sailsSocket.post('/api/mat/controls/registerscore', {id:id, player: player, target:target, turning:turning})
            .success(function(resp) {

            })
            .error(function(resp) {
                console.error('controls error', resp);
            })
        }

        ms.registerJudge = function (id) {
            console.log('heelo');
            $sailsSocket.post('/api/mat/judge', {id:id})
            .success(function(resp) {

            })
            .error(function(resp) {
                console.error('Judge Registration Error', resp);
            })
        }

        ms.removeJudge = function (id, judge) {
            $sailsSocket.post('/api/mat/removejudge', {id:id, judge: judge})
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
     * @name tkdscore.mat.servie:MatManger
     * 
     * @description
     * Takes care of managing the mat list
     *
    */
    .service('MatManager', ['ListManager', 'Mat', function(ListManager, Mat){

        return new ListManager({
            parentDataModel: null,
            dataModel: Mat,
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

    .directive('matList', [function(){
        return {
            scope: {},
            controllerAs: 'matListVm',
            controller: ['$scope', '$state', 'MatUI', 'MatManager', function($scope, $state, MatUI, MatManager) {
                
        
                function gotoControls(mat) {
                    $state.go('controls', {matId:mat.id})
                }

                function newMat() {
                    var mat = MatManager.add();
                }

                function destroy(mat) {
                    // TODO - ask
                    MatManager.destroy(mat);
                }

                function gotoMaster(mat) {
                    $state.go('master', {matId:mat.id})
                }

                function gotoScoreboard(mat) {
                    $state.go('scoreboard', {matId:mat.id})
                }

                function gotoJudge(mat) {
                    $state.go('judge', {matId:mat.id})
                }

                this.mates = MatManager.get();
                this.openEdit = MatUI.openEdit;

                this.gotoControls = gotoControls;
                this.gotoScoreboard = gotoScoreboard;
                this.gotoMaster = gotoMaster;
                this.gotoJudge = gotoJudge;
                this.newMat = newMat;
                this.destroy = destroy;
            }],
            restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
            templateUrl: 'mat/views/template-list.html',
            
            link: function($scope, iElm, iAttrs, controller) {
                
            }
        };
    }])





/**
 * @ngdoc service
 * @name tkdscore.mat.service:MatUI
 * 
 * @description
 * A collection of UI helpers that can be called in js
 *
*/
    .service('MatUI', ['ngDialog', function(ngDialog){

        // Opens a dialog containg the cuebuilder directive for editing cues.
        // accepts either the cue id or the cue model itself
        this.openEdit = function(item) {
            var dialog = ngDialog.open({

                plain: true,
                className: 'ngdialog-theme-normal',
                template:'<div><mateditor item="item"></mateditor></div>',
                
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
 * @name tkdscore.mat.directive:mateditor
 * 
 * @description
 * A template for editing mat information
 *
 * <pre> <mateditor> item="myIdOrMyMatItem"></mateditor> </pre>
*/
    .directive('mateditor', [ function(){
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
            templateUrl: 'mat/views/template-edit.html',
            controllerAs: 'matEditorVm',
            controller: ['$scope', 'AlertService', 'Mat', function($scope, AlertService, Mat){
                if(angular.isNumber(this.item)) {
                    // if it's ID - get the relevant data
                    this.mat = Mat.findOne($scope.item);
                } else {
                    // if not - assume it is the item and work with it directly
                    this.mat = $scope.item;
                }

                function save(mat) {
                    this.mat.$save();
                }

                function removeJudge(judge) {
                    Mat.removeJudge(this.mat.id, judge)
                }

                this.save = save;
                this.removeJudge = removeJudge;

            }],

            // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
            link: function($scope, iElm, iAttrs, controller) {

                
            }
        };
    }])

    .directive('matControls', [ function(){
        // Runs during compile
        return {
            // name: '',
            // priority: 1,
            // terminal: true,
            scope: {
                mat: '=',
            }, // {} = isolate, true = child, false/undefined = no change
            // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
            templateUrl: 'mat/views/template-controls.html',
            controllerAs: 'matControlsVm',
            controller: ['$scope', 'AlertService', 'Mat', 'MatUI', '$cookieStore', function($scope, AlertService, Mat, MatUI, $cookieStore){
                if(angular.isNumber($scope.mat)) {
                    // if it's ID - get the relevant data
                    this.mat = Mat.findOne($scope.mat);
                } else {
                    // if not - assume it is the item and work with it directly
                    this.mat = $scope.mat;
                }

                function changeRound(val) {
                    Mat.changeRound(this.mat.id, this.mat.round + val);
                };

                function points(player, points) {
                    Mat.points(this.mat.id, player, points);
                };

                function penalties(player, points) {
                    Mat.penalties(this.mat.id, player, points);
                };

                function resetMat() {
                    Mat.resetMat(this.mat.id);
                };

                function pauseResume() {
                    Mat.pauseResume(this.mat.id);
                };

                function soundHorn() {
                    Mat.soundHorn(this.mat.id);
                };

                function edit() {
                    MatUI.openEdit(this.mat);
                }

                function removeJudge(judge) {
                    Mat.removeJudge(this.mat.id, judge)
                }

                this.edit = edit;
                this.points = points;
                this.penalties = penalties;
                this.resetMat = resetMat;
                this.pauseResume = pauseResume;
                this.soundHorn = soundHorn;
                this.changeRound = changeRound;

            
            }],

            // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
            link: function($scope, iElm, iAttrs, controller) {

            }
        };
    }])

    .directive('matJudge', [ function(){
        // Runs during compile
        return {
            // name: '',
            // priority: 1,
            // terminal: true,
            scope: {
                mat: '=',
            }, // {} = isolate, true = child, false/undefined = no change
            // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
            templateUrl: 'mat/views/template-judge.html',
            controllerAs: 'matJudgeVm',
            controller: ['$scope', 'AlertService', 'Mat', 'MatUI', 'SessionService', function($scope, AlertService, Mat, MatUI, SessionService){
                var self = this;
                if(angular.isNumber($scope.mat)) {
                    // if it's ID - get the relevant data
                    this.mat = Mat.findOne($scope.mat);
                } else {
                    // if not - assume it is the item and work with it directly
                    this.mat = $scope.mat;
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
                    //console.log('Sending Taps', player, target, turning)
                    Mat.registerScore(self.mat.id, player, target, turning)
                }


                function register() {
                    Mat.registerJudge(this.mat.id);
                }

                
                

                function registered() {
                    var judges = [
                        this.mat.judge1,
                        this.mat.judge2,
                        this.mat.judge3,
                        this.mat.judge4,
                    ];
                  

                    var myIdent = SessionService.session.ident;
                    var reg = false
                    _.forEach(judges, function(judgeIdentifier, key) {
                  
                        if(judgeIdentifier === myIdent) {
                            reg = 'Judge ' + (key + 1);
                        }
                    });
                  
                    return reg;
                }

                this.tap = tap;
                this.register = register;
                this.registered = registered;

            
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
                mat: '=',
            }, // {} = isolate, true = child, false/undefined = no change
            // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
            restrict: 'AE', // E = Element, A = Attribute, C = Class, M = Comment
            templateUrl: 'mat/views/template-scoreboard.html',
            controllerAs: 'scoreboardVm',
            controller: ['$scope', '$timeout', '$sailsSocket', 'ngNotify', 'Mat', 'MatUI', function($scope, $timeout, $sailsSocket, ngNotify, Mat, MatUI){
                var self = this;
                var horn = new Audio('sounds/beep1.wav');

                if(angular.isNumber($scope.mat)) {
                    // if it's ID - get the relevant data
                    this.mat = Mat.findOne($scope.mat);
                } else {
                    // if not - assume it is the item and work with it directly
                    this.mat = $scope.mat;
                }

                this.timer = {
                    roundTimeMS: this.mat.roundTimeMS,
                    breakTimeMS: this.mat.breakTimeMS,
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
                    }, self.mat.scoreTimeout * 0.75);
                }



                
                this.judgeIndicator = judgeIndicator;



            
            }],

            // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
            link: function($scope, iElm, iAttrs, controller) {

                
            }
        };
    }])

    .service('MatService', ['Mat', function(Mat) {
        this.Model = Mat;
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


