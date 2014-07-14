'use strict';

angular.module('bs.common')
.service('Socket', ['socketFactory', function(socketFactory){

	return socketFactory();
}]);