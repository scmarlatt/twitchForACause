(function () {
    'use strict';
    angular
        .module('twitchForACause')
        .directive('navDirective', navDirective);

    //import { htmlTemplate } from 'main.directve.html';

    function navDirective() {
        var directive = {
            restrict: 'EA',
            /*scope: {
                
            },*/
            templateUrl: '/nav',
            link: linkFunc,
            controller: navController,
            // note: This would be 'ExampleController' (the exported controller name, as string)
            // if referring to a defined controller in its separate file.
            controllerAs: 'nc',
            bindToController: true // because the scope is isolated
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {
            
        }
    }

    navController.$inject = ['$scope', '$http'];

    function navController($scope, $http) {
        // Injecting $scope just for comparison
        var vm = this;

        vm.init = function () {

        };

        vm.init();
    }
})();