(function() {
    'use strict';
	
    angular.module('app.components').controller('PublicExpsController', PublicExpsController);
    PublicExpsController.$inject = [
        '$state',
        'alert',
        'DTOptionsBuilder', 
        'DTColumnDefBuilder',
        '$mdDialog',
		'publicExpSrv',
		'participantSrv',
		'selectedExpSrv',
		'auth'
    ];

    function PublicExpsController(
        $state,
        alert,
        DTOptionsBuilder, 
        DTColumnDefBuilder,
        $mdDialog,
		publicExpSrv,
		participantSrv,
		selectedExpSrv,
		auth
    ) {
        var vm = this;
		vm.somethingChanged = false;
		
		vm.loadingChart = false;
		
        vm.dtOptions = DTOptionsBuilder.newOptions()
        .withPaginationType('full_numbers')
        .withLanguage({
            "sLengthMenu": "Show _MENU_ experiments",
        })
        .withOption('lengthMenu', [10, 20, 50]);
		
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
			DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2).notSortable(),
            DTColumnDefBuilder.newColumnDef(3).notSortable()
        ];
		
        init();

        function init() {
			vm.loadingChart = true;
			
			vm.origPubExps = publicExpSrv.getPubExperiments();
			vm.selExps = selectedExpSrv.getExperiments();
			
			vm.pubExps = [];
			// detectar experimentos publicos que ya estan en la lista de experimentos seleccionados
			var found = false;
			for (var i = 0; i < vm.origPubExps.length; ++i) {
				for (var j = 0; j < vm.selExps.length; ++j) {
					if (vm.origPubExps[i].experimentId == vm.selExps[j].experimentId) {
						found = true;
					}
				}
				if (!found) {
					vm.pubExps.push(vm.origPubExps[i]);
				}
				found = false;
			}

			for (var n = 0; n < vm.pubExps.length; ++n) {
				vm.pubExps[n].selected = false;
			}
			
			vm.loadingChart = false;
		}
		
		
        vm.selClick = function() {
            vm.somethingChanged = true;
        };
		
		vm.sendExps = function() {
            var parts = [];
            var exps = [];
            var objPart = {};
			var objExp = {};
			
			vm.loadingChart = true;
			for (var i = 0; i < vm.pubExps.length; ++i) {
				if (vm.pubExps[i].selected) {
					// Object to add to participant collection
					objPart = new Object();
					objPart.experimentId = vm.pubExps[i].experimentId;
					objPart.subscribedId = auth.getCurrentUserId();
					objPart.username = auth.getCurrentUserName();
					parts.push(objPart);
					// Object to add to experiment collection
					objExp = new Object();
					objExp.experimentId = vm.pubExps[i].experimentId;
					objExp.experimentName = vm.pubExps[i].name;
					objExp.description = vm.pubExps[i].description;
					objExp.username = auth.getCurrentUserName();
					objExp.subscribedFrom = 'Public Experiment';
					exps.push(objExp);	
				}
			}
			
            participantSrv.newParticipants (parts, 
                function () {
                    vm.loadingChart = false;
                    //alert.success('Invitationes updated')
                    //vm.invs = participantSrv.getInvitations();
                }, 
                function () {
                    vm.loadingChart = false;
                    //vm.invs = participantSrv.getInvitations();
                    //alert.error('Invitationes could not be updates')
                }
            );
					
            return selectedExpSrv.newExperiments (exps, 
                function () {
					vm.somethingChanged = false;
                    vm.loadingChart = false;
					return $state.go($state.current, {}, { reload: true });
                    //alert.success('Invitationes updated')
                    //vm.invs = participantSrv.getInvitations();
                }, 
                function () {
					vm.somethingChanged = false;
                    vm.loadingChart = false;
					return $state.go($state.current, {}, { reload: true });
                    //vm.invs = participantSrv.getInvitations();
                    //alert.error('Invitationes could not be updates')
                }
            );
		};
		
        vm.shortDescription = function(str) {
            return str.substr(0, 150) + '...';
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