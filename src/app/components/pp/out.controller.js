(function() {
    'use strict';

    angular.module('app.components').controller('OutController', OutController);

    OutController.$inject = [
        '$mdDialog', 
        '$rootScope',
        '$scope',
        '$window'
    ];

    function OutController(
        $mdDialog, 
        $rootScope,
        $scope,
        $window
    ) {
        var vm = this;
        vm.callHref = function (ref) {
            $window.open(ref, '_blank');
        };

        vm.docref = 'https://organicityeu.github.io';
        vm.github = 'https://github.com/OrganicityEu/';
        vm.zoho = 'https://support.zoho.com/portal/organicity/home';
        vm.q2a = 'http://dev.qa.organicity.eu/index.php';
    }
})();