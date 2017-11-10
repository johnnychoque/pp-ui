(function() {
    'use strict';

    angular.module('app.components')
        .controller('SelectedExpsController', SelectedExpsController);

    SelectedExpsController.$inject = [
		'$state', 
		'selectedExpSrv',
		'DTOptionsBuilder',
		'DTColumnDefBuilder',
		'$mdDialog'
	];

    function SelectedExpsController(
		$state,
		selectedExpSrv, 
		DTOptionsBuilder, 
		DTColumnDefBuilder,
		$mdDialog
	) {
        var vm = this; 
        vm.exps = selectedExpSrv.getExperiments();
        vm.loadingChart = false;
        
        vm.dtOptions = DTOptionsBuilder.newOptions()
        .withPaginationType('full_numbers')
        .withLanguage({
            "sLengthMenu": "Show _MENU_ invitations",
        })
        .withOption('lengthMenu', [10, 20, 50]);

        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
			DTColumnDefBuilder.newColumnDef(4)
        ];

        vm.expInfo = function(ev,experiment) {
			var exp = JSON.parse(JSON.stringify(experiment));
			//console.log('EXP ',exp);
            var custom = {
                locals: { experiment: exp },
                controller: 'ExpInfoController as vm',
                templateUrl: 'app/components/pp/expInfo.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: false
            };
            $mdDialog.show(custom, function(){}, function(){});
        };
		
        vm.shortDescription = function(str) {
            return str.substr(0, 150) + '...';
        };
        
        vm.getDate = function (d) {
            var date = new Date(d);
            return date.toISOString().slice(0, 10);
        };

        vm.goBack = function() {
            vm.loadingChart = true;
            $state.go('layout.parts');
        };
		
        vm.goHome = function (){
            $state.go('layout.parts');
        };
    }
    
})();
