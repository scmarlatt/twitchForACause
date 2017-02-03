(function () {
	'use strict';
	angular
		.module('twitchForACause')
		.factory('eventDataService', eventDataService);

	eventDataService.$inject = ['$http'];

	function eventDataService($http) {
	    return {
	        getEvents: getEvents,
	        postNewEvent: postNewEvent
	    };

	    function getEvents(type) {
	        return $http({
	        	url: '/api/events/',
	        	method: 'GET',
	        	params: { status: type }
	        })
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

	}
})();