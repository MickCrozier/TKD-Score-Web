

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

        s.areYouSure = function(question, yesFn, noFn, yesText, noText) {
            if(!question) {
                var question = "Are you sure";
            }

            if(!yesText) {
                var yesText = "Yes";
            }

            if(!noText) {
                var noText = "No";
            }
            
            ngDialog.open({
                //windowClass: 'modal-small',
                plain: true,
                showClose: false,
                closeByEscape: false,
                closeByDocument: false,
                template: '<div class="modal-body">' + question + '?</div><button class="btn btn-md btn-danger btn-block" ng-click="onYesClick($event)">' + yesText + '</button><button class="btn btn-md btn-success btn-block" ng-click="onNoClick($event)">' + noText + '</button>',
                
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



