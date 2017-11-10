(function() {
    'use strict';

    angular.module('app.components')
        .controller('ExpInfoController', ExpInfoController);

    ExpInfoController.$inject = ['experiment', '$mdDialog'];

    function ExpInfoController(experiment, $mdDialog) {
        var vm = this;
        vm.experiment = experiment;
        //console.log('experiment ',vm.experiment);

		vm.readableDate = function (str) {
			var date = new Date(str);
			return date.toString().substring(0, 15);
		};
        
        vm.accept = function () {
            $mdDialog.hide();
        };
    }
	
})();
