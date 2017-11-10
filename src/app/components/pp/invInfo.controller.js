(function() {
    'use strict';

    angular.module('app.components')
        .controller('InvInfoController', InvInfoController);

    InvInfoController.$inject = ['invitation', '$mdDialog'];

    function InvInfoController(invitation, $mdDialog) {
        var vm = this;
        vm.invitation = invitation;
        //console.log('invitation ',vm.invitation);

		vm.readableDate = function (str) {
			var date = new Date(str);
			return date.toString().substring(0, 15);
		};
        
        vm.accept = function () {
            $mdDialog.hide();
        };
    }
	
})();
