

(function() {
    'use strict';
    var Module = angular.module('tvur.users', [ // list dependancies
        'bsol.session',
        'bsol.common',
        'ui.bootstrap',
        'bsol.common',
        'xeditable',
        'restmod',
    ])

    .config(['$stateProvider',
        function($stateProvider) {

            $stateProvider.state('user', {
                parent: 'organisation',
                abstract: true,
                url: '/user',
                templateUrl: 'user/views/parent.html',
                resolve: {
                    resolved_organisation: function(resolved_organisation) {
                        return resolved_organisation;
                    },
                }
            })


            .state('user_detail', {
                parent: 'user',
                url: '/:user_id',
                template: '<div><account-detail user="resolved_user"></account-detail>',
                //controller: 'UserController',
                resolve: {
                    resolved_organisation: function(resolved_organisation) {
                        return resolved_organisation;
                    },
                    resolved_user: Module.resolve_user,
                }
            });
        }
    ])

    .factory('User', ['$state', 'restmod',  'SessionService',  function($state, restmod, SessionService){

        var User = restmod.model('api/user', {
            contacts: { hasMany: 'Contact' },
            goToDetail: function() {
                $state.go('user_detail', {
                    user_id: this.id,
                });
            },
        });


        User.updateUser = function(userDetails) {
            SessionService.updateUser(userDetails);
        };
        return User;
        
    }])



    .directive('accountDetail', ['$q', '$timeout', '$state',  '$stateParams', 'AlertService', 'User', 'SessionService', 'ContactUI', 
    function($q, $timeout, $state, $stateParams, AlertService, User, SessionService, ContactUI) {
        // Runs during compile
        return {
            scope: {
                user: '=',
            }, // {} = isolate, true = child, false/undefined = no change

            //require: '', // Array = multiple requires, ? = optional, ^ = check parent elements
            restrict: 'EA', // E = Element, A = Attribute, C = Class, M = Comment
            templateUrl: 'user/views/detail.html',
            
            link: function($scope, iElm, iAttrs, controller) {
                $scope.loading = true;
                $scope.contact = SessionService.session.contact;
                
                User.$find($stateParams.user_id).$then(function(user) {
                    $scope.user = user;
                    $scope.userFormModel = $scope.user;
                    $scope.contact = SessionService.session.contact;
                    $scope.loading = false;
                });

                $scope.availableTypes = ['OPERATOR'];
                
                $scope.availableTypes = ['OPERATOR', 'ADMIN', 'SYSTEMDEV', 'SYSTEMADMIN', 'SYSTEMSUPPORT'];
                
                
                $scope.openContactCard = function() {
                    ContactUI.openEdit(SessionService.session.contact);
                };

                $scope.onChangePasswordClick = function(e) {
                    alert('Not yet functional');
                };

                $scope.cancelUserEdit = function(e) {
                    if($scope.userFormModel.id) {
                        // is editable - cancel the edit
                        $scope.editableForm.$cancel();
                    } else {
                        // is new - go back
                        $state.go('organisation_detail');
                    }
                };

                $scope.saveUser = function() {
                    var defer = $q.defer();

                    $scope.loading = true;


                    /////// THIS IS CRAP - written for restangular, now using restmod ///////////////
                    ///////////// RE_WRITE ME ASAP AS PROB NOT WORK WITH NEW USER!!!! ////////////
                    if(!$scope.userFormModel.id) {
                        $scope.userFormModel.post().then(function success(item) {
                            $timeout(function() {User.updateUser(item);});
                            $scope.loading = false;
                            $scope.userFormModel = item;
                            defer.resolve();
                        }, function fail(err) {
                            $scope.loading = false;

                            $scope.userFormModel = $scope.user; // Revert - probably doen't work as is refference not copy


                            // temp error check as sails is returning 200 with this error
                            if(err.data.validationErrors) {
                                var validationErrors = err.data.validationErrors;
                                AlertService.alert(validationErrors.summary);
                                
                                for (var att in validationErrors.invalidAttributes) {
                                    $scope.editableForm.$setError(att, validationErrors.invalidAttributes[att][0].message);
                                }
                                defer.reject('Validation Error');
                            } else if(err.data) {
                                defer.reject(err.data.message);
                                AlertService.alert(err.data.message);
                                defer.reject('Error');
                            } else {
                                defer.reject('Bad Error');
                                console.error(err);
                                AlertService.alert('Critical Error - check console log');
                                defer.reject('Error');
                            }
                        });

                    } else {
                        
                  
                        $scope.userFormModel.$save().$then(function success(item) {
                            // temp error check as sails is returning 200 with this error
                            $timeout(function() {User.updateUser(item);});
                            $scope.loading = false;
                            $scope.userFormModel = item;
                            defer.resolve();
                        }, function fail(err) {
                            $scope.loading = false;

                            $scope.userFormModel = $scope.user; // Revert


                            // temp error check as sails is returning 200 with this error
                            if(err.data.validationErrors) {
                                var validationErrors = err.data.validationErrors;
                                AlertService.alert(validationErrors.summary);
                                
                                for (var att in validationErrors.invalidAttributes) {
                                    $scope.editableForm.$setError(att, validationErrors.invalidAttributes[att][0].message);
                                }
                                defer.reject('Validation Error');
                            } else if(err.data) {
                                defer.reject(err.data.message);
                                AlertService.alert(err.data.message);
                                defer.reject('Error');
                            } else {
                                defer.reject('Bad Error');
                                console.error(err);
                                AlertService.alert('Critical Error - check console log');
                                defer.reject('Error');
                            }
                        });
                    }
                    return defer.promise;
                };

               
            }
        };
    }]);


    Module.resolve_user = ['$stateParams', 'User',
        function($stateParams, User) {
            console.log('Resolving User');
            return User.$find($stateParams.user_id).$promise;
        }
    ];

    Module.new_user = ['resolved_contact', 'User',
        function(resolved_organisation, User) {
            return User.$create({
                
            });
        }
    ];

})();