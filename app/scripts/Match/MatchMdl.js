(function() {
    'use strict';


    var service = ['RestFactory', function(RestFactory){


        //// PREPARE THE SERVICE ////
        var s = new RestFactory({
            path: 'Match', 
        });

        s.items = [];

        return s;
    }];

    angular.module('tkdApp.match').service('MatchService', service);


})();