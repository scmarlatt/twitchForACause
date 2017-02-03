(function () {
	'use strict';
	angular
		.module('twitchForACause')
		.factory('mainDataService', mainDataService);

	mainDataService.$inject = ['$http'];

	function mainDataService($http) {

	    return {};
	}
})();