(function () {
	'use strict';
	angular
		.module('twitchForACause')
		.factory('mainDataService', mainDataService);

	mainDataService.$inject = ['$http'];

	function mainDataService($http) {
	    
	    function getUpcomingEvents() {
	        return $http.get('/api/events')
	            .success(function (response) {
		            return response;
		        })
	            .error(function (error) {
		            console.log('XHR Failed for getUpcomingEvents.' + error);
		        });
	    }

	    function postNewEvent(formData) {
	    	return $http.post('/api/events', formData)
	    		.success(function (response) {
	    			return response;
	    		})
	    		.error(function (error) {
	    			console.log('XHR Failed for postNewEvent.' + error);
	    		});
	    }

	    return {
	        getUpcomingEvents: getUpcomingEvents,
	        postNewEvent: postNewEvent
	    };
	}
})();