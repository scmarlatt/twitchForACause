(function () {
    'use strict';
    angular
        .module('twitchForACause')
        .directive('browseEventDirective', browseEventDirective);

    //import { htmlTemplate } from 'main.directve.html';

    function browseEventDirective() {
        var directive = {
            restrict: 'EA',
            /*scope: {
                
            },*/
            templateUrl: 'dist/partials/landing/landing.html',
            link: linkFunc,
            controller: browseEventController,
            // note: This would be 'ExampleController' (the exported controller name, as string)
            // if referring to a defined controller in its separate file.
            controllerAs: 'bec',
            bindToController: true // because the scope is isolated
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {
            
        }
    }

    browseEventController.$inject = ['$scope', '$http', 'browseEventDataService'];

    function browseEventController($scope, $http, browseEventDataService) {
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
            browseEventDataService.startEvent('iddqdow');
        }

        vm.endEvent = function () {
            browseEventDataService.endEvent('iddqdow');
        }

        vm.postNewEvent = function (eventData) {
            browseEventDataService.postNewEvent(eventData).then(function (response) {
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