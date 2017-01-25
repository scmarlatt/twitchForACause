(function () {
	'use strict';
	angular
		.module('twitchForACause')
		.factory('mainDataService', mainDataService);

	mainDataService.$inject = ['$http', 'logger'];

	function dataservice($http, logger) {
	    return {
	        getUpcomingEvents: getUpcomingEvents
	    };

	    function getUpcomingEvents() {
	        return $http.get('')
	            .then(getUpcomingEventsComplete)
	            .catch(getUpcomingEventsFailed);

	        function getUpcomingEventsComplete(response) {
	            return response.data.results;
	        }

	        function getUpcomingEventsFailed(error) {
	            logger.error('XHR Failed for getUpcomingEvents.' + error.data);
	        }
	    }
	}
})();