(function() {
    'use strict';

    angular.module('app.components').controller('ParticipantsController', ParticipantsController);

    ParticipantsController.$inject = [
        '$state',
        'auth'
    ];

    function ParticipantsController(
        $state,
        auth
    ) {
        var vm = this;

        vm.loadingChart = false;
		
        vm.showInvitations = function (){
            vm.loadingChart = true;
        	$state.go('layout.invitations');
        };

        vm.showSelectedExps = function (){
            vm.loadingChart = true;
        	$state.go('layout.experiments');
        };
		
        vm.showPublicExps = function (){
			vm.loadingChart = true;
        	$state.go('layout.publicExps');
        };
        
    }
})();
