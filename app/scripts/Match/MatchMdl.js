
'use strict';


angular.module('tkdApp.match')
.service('MatchService', ['RestFactory', function(RestFactory){


    //// PREPARE THE SERVICE ////
    var s = new RestFactory({
        path: 'Match', 
    });

    s.items = [];

    return s;
}]);








