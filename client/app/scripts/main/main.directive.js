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

    TfacController.$inject = ['$scope', '$http'];

    function TfacController($scope, $http) {
        // Injecting $scope just for comparison
        var vm = this;
        vm.init();

        vm.events = ["imaqtpie's bdc stream for blm", "MoonMoon's stream for ozone house", "Riot Games $1000 per kill"];
        

        vm.init = function () {
            vm.getUpcomingEvents();
        }

        vm.getUpcomingEvents = function () {
            $http.get('', function SuccessCallback () {

            }, function ErrorCallback () {

            });
        };
    }
})();