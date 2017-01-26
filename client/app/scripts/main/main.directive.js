(function () {
    'use strict';
    angular
        .module('twitchForACause')
        .directive('tfacDirective', tfacDirective);

    //import { htmlTemplate } from 'main.directve.html';

    function tfacDirective() {
        var directive = {
            restrict: 'EA',
            /*scope: {
                
            },*/
            link: linkFunc,
            controller: TfacController,
            // note: This would be 'ExampleController' (the exported controller name, as string)
            // if referring to a defined controller in its separate file.
            controllerAs: 'tfac',
            bindToController: true // because the scope is isolated
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {
            
        }
    }

    TfacController.$inject = ['$scope', '$http', 'mainDataService'];

    function TfacController($scope, $http, mainDataService) {
        // Injecting $scope just for comparison
        var vm = this;

        vm.events = ['123', '456', '789', 'scomar1221', 'clintstevens', 'moonmoonow'];
        vm.eventData = {
            STREAMER: "scomar1221"
        };
        vm.todaysGoal = 1000;
        vm.totalRaised = 647220;

        vm.getUpcomingEvents = function () {
            mainDataService.getUpcomingEvents().then(function (response) {
                vm.events = response.data;
            });
        };

        vm.postNewEvent = function (eventData) {
            mainDataService.postNewEvent(eventData).then(function (response) {
                vm.events = response.data;
            });
        };

        vm.deleteEvent = function (eventID) {

        };

        vm.init = function () {
            //vm.getUpcomingEvents();
        };

        vm.init();
    }
})();