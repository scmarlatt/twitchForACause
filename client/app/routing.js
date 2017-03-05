(function() {
	'use strict';
	angular
		.module('twitchForACause')
		.config(mainConfig);

		mainConfig.$inject = ['$stateProvider'];

		function mainConfig($stateProvider) {
			var loginState = {
				name: 'login',
				url: '/login',
				template: '<login-directive></login-directive>',
				// use resolve to fetch data before state loads
				resolve: {

				}
			};

			var landingState = {
				name: 'landing',
				url: '/',
				template: '<browse-event-directive></browse-event-directive>'
			};

			// var viewUserState = {
			// 	name: 'viewUser',
			// 	url: '/view/user',
			// 	template: 'dist/partials/landing.html'
			// };

			// var viewEventState = {
			// 	name: 'viewEvent',
			// 	url: '/view/event',
			// 	template: 'dist/partials/landing.html',
			// 	resolve: {

			// 	}
			// };

			$stateProvider.state(loginState);
			$stateProvider.state(landingState);
			// $stateProvider.state(viewUserState);
			// $stateProvider.state(viewEventState);
		}
})();