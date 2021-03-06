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

    TfacController.$inject = ['$scope', '$http', 'mainDataService', 'userInfoService'];

    function TfacController($scope, $http, mainDataService, userInfoService) {
        // Injecting $scope just for comparison
        var vm = this;

        vm.init = function () {
            //vm.getUpcomingEvents();
        };

        vm.init();
    }
})();