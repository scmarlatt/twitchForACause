(function () {
    'use strict';
    angular
        .module('twitchForACause')
        .directive('loginDirective', loginDirective);

    //import { htmlTemplate } from 'main.directve.html';

    function loginDirective() {
        var directive = {
            restrict: 'EA',
            /*scope: {
                
            },*/
            templateUrl: 'dist/partials/login/login.html',
            link: linkFunc,
            controller: loginController,
            // note: This would be 'ExampleController' (the exported controller name, as string)
            // if referring to a defined controller in its separate file.
            controllerAs: 'login',
            bindToController: true // because the scope is isolated
        };

        return directive;

        function linkFunc(scope, el, attr, ctrl) {
            
        }
    }

    loginController.$inject = ['$scope'];

    function loginController($scope) {
        // Injecting $scope just for comparison
        var vm = this;

        vm.init = function () {

        };

        vm.init();
    }
})();