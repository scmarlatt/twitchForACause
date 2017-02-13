(function () {
    'use strict';
    angular
        .module('twitchForACause')
        .directive('eventDirective', eventDirective);

    //import { htmlTemplate } from 'main.directve.html';

    function eventDirective() {
        var directive = {
            restrict: 'EA',
            /*scope: {
                
            },*/
            templateUrl: '/events',
            link: linkFunc,
            controller: eventController,
            // note: This would be 'ExampleController' (the exported controller name, as string)
            // if referring to a defined controller in its separate file.
            controllerAs: 'ec',
            bindToController: true // because the scope is isolated
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {
            
        }
    }

    eventController.$inject = ['$scope', '$http', 'eventDataService'];

    function eventController($scope, $http, eventDataService) {
        // Injecting $scope just for comparison
        var vm = this;

        vm.events = ['123', '456', '789', 'scomar1221', 'clintstevens', 'moonmoonow'];
        vm.eventData = {
            STREAMER: "kjhovey"
        };
        vm.todaysGoal = 1000;
        vm.totalRaised = 647220;
/*
        vm.getEvents = function (type) {
            eventDataService.getEvents(type).then(function (response) {
                vm.events = response.data;
            });
        };
        */
        vm.startEvent = function () {
            eventDataService.startEvent('iddqdow');
        }

        vm.endEvent = function () {
            eventDataService.endEvent('iddqdow');
        }

        vm.postNewEvent = function (eventData) {
            eventDataService.postNewEvent(eventData).then(function (response) {
                vm.events = response.data;
            });
        };

        vm.deleteEvent = function (eventID) {

        };

        vm.init = function () {
            //vm.getEvents('live');
            //vm.getEvents('upcoming');
        };

        vm.init();
    }
})();