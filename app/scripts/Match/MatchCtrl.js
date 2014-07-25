
'use strict';

angular.module('tkdApp.match')


.controller('MatchListCtrl', ['$scope', '$state', 'Socket', 'MatchService', 'ModalMsg',
    function($scope, $state, Socket, MatchService, ModalMsg) {
        
        Socket.on('newMatch', function(match) {
            match = MatchService.generateNew(match);
            MatchService.items.push(match);
            $scope.matchList = MatchService.items;
        });

        Socket.on('deleteMatch', function(match) {
            var index = MatchService.items.indexOf(match);
            MatchService.items.splice(1, index);
            $scope.matchList = MatchService.items;
        });

        Socket.on('updateMatch', function(match) {
            console.log(MatchService.items);
            _.forEach(MatchService.items, function(matchItem) {
                if(matchItem._id === match._id) {
                    MatchService.items[MatchService.items.indexOf(matchItem)] = match;
                }
            });
            
            $scope.matchList = MatchService.items;
        });

        $scope.matchList = MatchService.items;

        MatchService.findList().then(function success(items) {
            MatchService.items = items;
            $scope.matchList = MatchService.items;
        }, function fail(err) {

        });

        $scope.onDetail = function(e, row) {
            if(e) {e.stopPropagation();}
            $state.go('match_detail', {
                match_id: row._id
            });
        };

        $scope.onScoreboard = function(e, row) {
            if(e) {e.stopPropagation();}
            $state.go('match_scoreboard', {
                match_id: row._id
            });
        };

        $scope.onJudge = function(e, row) {
            if(e) {e.stopPropagation();}
            $state.go('match_judge', {
                match_id: row._id
            });
        };



        $scope.onControls = function(e, row) {
            if(e) {e.stopPropagation();}
            $state.go('match_master', {
                match_id: row._id
            });
        };

        $scope.onAdd = function(e) {
            if(e) {e.stopPropagation();}
            MatchService.generateNew({}).post().then(function success(match) {

            }, function fail(err) {
                alert(err);
            });
            
        };

        $scope.onRemove = function(e, row) {
            if(e) {e.stopPropagation();}

            ModalMsg.areYouSure('Are you sure you want to delete this match?', function(){
                row.remove().then(function success() {
                    var index = MatchService.items.indexOf(row);
                    MatchService.items.splice(index, 1); // remove local copy without reloading from server
                    $scope.matchList = MatchService.items;
                }, function fail() {

                });
            }, function(){
                //cancel
            });
            
        };
    }
])

.controller('MatchCtrl', ['$scope', '$state', 'Socket', 'resolved_match',
    function($scope, $state, Socket, resolved_match) {
        
        $scope.match = resolved_match;
        
        Socket.on('deleteMatch', function(match) {
            if($scope.match._id === match._id) {
                alert('Match has been deleted');
                $state.go('front', {
                    
                });
            }
        });

        Socket.on('updateMatch', function(match) {
            if($scope.match._id === match._id) {
                $scope.match = match;
            }
        });

        $scope.onTriggerUpdate = function(){
            if($scope.match._id) {
                $scope.match.put().then(function(item){
                    $scope.match = item;
                }, function fail(err) {
                    alert(err);
                });
            } else {
                $scope.match.post().then(function(item){
                    $state.go('match_detail', {
                        match_id: item._id
                    });
                }, function fail(err) {
                    alert(err);
                });
            }
        };

    }
])


.controller('MatchControlsCtrl', ['$scope', '$state', '$stateParams', '$modal', 'Socket', 'resolved_match',
    function($scope, $state, $stateParams, $modal, Socket, resolved_match) {
        var beep = new Audio('sounds/beep1.wav');

        Socket.on('deleteMatch', function(match) {
            if($scope.match._id === match._id) {
                alert('Match has been deleted');
                $state.go('front', {
                    
                });
            }
        });

        Socket.on('updateMatch', function(match) {
            if($scope.match._id === match._id) {
                $scope.match = match;
            }
        });

        $scope.match = resolved_match;
        $scope.timer = {
            roundTimeMS: resolved_match.roundTimeMS,
            breakTimeMS: resolved_match.breakTimeMS,
            pauseWatchMS: 0,
        };

        var viewType = $state.current.name; // match_master, match_scoreboard, match_controls, match_judge

        Socket.emit('join', {id:resolved_match._id, viewType:viewType});

        Socket.on('roundtime', function(time){
            $scope.timer.roundTimeMS = time.ms;
            $scope.timer.pauseWatchMS = 0;
        });

        Socket.on('breaktime', function(time){
            $scope.timer.breakTimeMS = time.ms;
            $scope.timer.pauseWatchMS = 0;
        });

        Socket.on('pausetime', function(time){
            $scope.timer.pauseWatchMS = time.ms;
        });

        Socket.on('soundhorn', function() {
            beep.play();
        });


        Socket.on('match', function(match) {
            $scope.match = match;
        });


        $scope.edit = function(e) {
            e.stopPropagation();
            /*
            $state.go('match_detail', {
                match_id: $scope.match._id
            });
            */
            editMatch($scope.match);
        };

        $scope.changeRound = function(e, val) {
            e.stopPropagation();
            Socket.emit('changeRound', {id:$scope.match._id, value:$scope.match.round + val});
        };

        $scope.points = function(e, player, points) {
            e.stopPropagation();
            Socket.emit('points', {id:$scope.match._id, player: player, points:points});
        };

        $scope.penalties = function(e, player, points) {
            e.stopPropagation();
            Socket.emit('penalties', {id:$scope.match._id, player: player, points:points});
        };

        $scope.reset = function(e) {
            e.stopPropagation();
            Socket.emit('resetMatch', {id:$scope.match._id});
        };

        $scope.pauseResume = function(e) {
            e.stopPropagation();
            Socket.emit('pauseresume', {id:$scope.match._id});
        };

        $scope.soundhorn = function(e) {
            e.stopPropagation();
            Socket.emit('soundhorn', {id:$scope.match._id});
        };




        ///// TODO //////
        $scope.onJudge = function(e, player, target) {
            if(e) {e.stopPropagation();}

            // TODO
            // Set timeout for repeats presses - then call sendJudgeScore when done
        };


        var sendJudgeScore = function(player, points) {
            Socket.emit('registerscore', {
                match_id: $stateParams.match_id,
                player: player,
                points: points
            });
        };
        ////////////////


        var editMatch = function(match) {
            var mi = $modal.open({
                //windowClass: 'modal-small',
                templateUrl: 'views/match/detail.html',
                controller: ['$scope', function($scope) {
                    $scope.match = match;

                    $scope.onTriggerUpdate = function(){
                        if($scope.match._id) {
                            $scope.match.put().then(function(item){
                                $scope.match = item;
                            }, function fail(err) {
                                alert(err);
                            });
                        } else {
                            $scope.match.post().then(function(item){
                                $state.go('match_detail', {
                                    match_id: item._id
                                });
                            }, function fail(err) {
                                alert(err);
                            });
                        }
                    };
                }]
            });
        };
    }
]);