

(function() {
    'use strict';

    angular.module('bsol.common',['ngDialog', 'ngNotify'])
    .service('AlertService', ['$modal', 'ngDialog', 'ngNotify', function($modal, ngDialog, ngNotify){


    	var s = [];
		s.addAlert = function(msg, type) {
		    s.push({type:type, msg: msg});
		};

		s.closeAlert = function(index) {
		    s.splice(index, 1);
		};

		s.alert = function(msg) {
            ngDialog.open({
                plain: true,
                template: '<div class="modal-body">' + msg + '</div>',
                
            });
        };

        s.areYouSure = function(question, yesFn, noFn) {
            if(!question) {
                var question = "Are you sure";
            }
            
            ngDialog.open({
                //windowClass: 'modal-small',
                plain: true,

                template: '<div class="modal-body">' + question + '?</div><button class="btn btn-md btn-danger" ng-click="onYesClick($event)">Yes</button><button class="btn btn-md btn-success" ng-click="onNoClick($event)">No</button>',
                controller: ['$scope',
                    function($scope) {
                        $scope.onYesClick = function(e) {
                            yesFn();
                            $scope.closeThisDialog('doit');
                        };

                        $scope.onNoClick = function(e) {
                            if(noFn) {
                                noFn();
                            }
                            $scope.closeThisDialog('cancel');
                        };
                    }
                ]
            });
        };

        s.notify = function(message) { // TODO enhance with classes and permanance
            ngNotify.set(message);
        }


        return s;
        
    }]);

})();



