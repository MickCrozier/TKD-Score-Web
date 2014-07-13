(function() {
    'use strict';

    angular.module('tkdApp.match')


    .controller('MatchListCtrl', ['$scope', '$state', 'MatchService',
        function($scope, $state, MatchService) {
            

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

            $scope.onAdd = function(e) {
                if(e) {e.stopPropagation();}
                $state.go('match_new');
            };

            $scope.onRemove = function(e, row) {
                if(e) {e.stopPropagation();}
    
                row.remove().then(function success() {
                    var index = MatchService.items.indexOf(row);
                    MatchService.items.splice(index, 1); // remove local copy without reloading from server
                    $scope.matchList = MatchService.items;
                }, function fail() {

                });

            };
        }
    ])

    .controller('MatchCtrl', ['$scope', 'resolved_match',
        function($scope, resolved_match) {
            
            $scope.match = resolved_match;

            $scope.onTriggerUpdate = function(){
                $scope.match.put().then(function(item){
                    $scope.match = item;
                }, function fail(err) {
                    alert(err);
                });
            };
        }
    ]);

})();