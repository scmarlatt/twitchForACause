(function () {
	'use strict';
	angular
		.module('twitchForACause')
		.factory('userInfoService', userInfoService);

	userInfoService.$inject = ['$http'];

	function userInfoService($http) {
	    
	    function getUserById (id) {
	        return $http({
	        	url: '/api/events/',
	        	method: 'GET',
	        	params: { _id: id }
	        })
            .success(function (response) {
	            return response;
	        })
            .error(function (error) {
	            console.log('XHR Failed for getUserById.' + error);
	        });
	    }

	    function addUser (userData) {
	    	return $http({
	    			url: '/api/user/newUser',
	    			method: 'POST',
	    			data: userData
	    		}) 
	    		.success(function (response) {
	    			return response;
	    		})
	    		.error(function (error) {
	    			console.log('XHR Failed for addUser.' + error);
	    		});
	    }

	    function updateUserInfoById (id, updatedUserData) {
	    	return $http({
	    		url: '/api/user/',
	    		method: 'POST',
	    		params: { _id: id },
	    		data: updatedUserData
	    	})
	    	.success(function (response) {
	    		return response;
	    	})
	    	.error(function (error) {
	    		console.log('XHR Failed for updateUserInfoById.' + error);
	    	});
	    }

	    return {
	        getUserById: getUserById,
	        addUser: addUser,
	        updateUserInfoById: updateUserInfoById
	    };
	}
})();