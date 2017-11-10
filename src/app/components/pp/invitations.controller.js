(function() {
    'use strict';

    angular.module('app.components')
        .controller('InvitationsController', InvitationsController);

    InvitationsController.$inject = [
		'$state', 
		'participantSrv',
		'selectedExpSrv',
		'invitationSrv',
		'DTOptionsBuilder',
		'DTColumnDefBuilder', 
		'$mdDialog',
		'alert',
		'auth'
	];

    function InvitationsController(
		$state,
		participantSrv, 
		selectedExpSrv,
		invitationSrv,
		DTOptionsBuilder, 
		DTColumnDefBuilder, 
		$mdDialog,
		alert,
		auth
	) {
        var vm = this; 
        vm.invs = invitationSrv.getInvitations();
        vm.states = {};
        vm.updateEnabled = false;
        vm.loadingChart = false;
        
        for (var i = 0; i < vm.invs.length; i++) {
            vm.states[vm.invs[i].experimentId] = vm.invs[i].state;
        }

		//console.log("Invitaciones ---");
        //console.log(JSON.stringify(vm.invs));

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
			DTColumnDefBuilder.newColumnDef(3).notSortable(),
            DTColumnDefBuilder.newColumnDef(4),
            DTColumnDefBuilder.newColumnDef(5).notSortable(),
			DTColumnDefBuilder.newColumnDef(6).notSortable()
        ];

        vm.invInfo = function(ev,invitation) {
			var inv = JSON.parse(JSON.stringify(invitation));
            var custom = {
                locals: { invitation: inv },
                controller: 'InvInfoController as vm',
                templateUrl: 'app/components/pp/invInfo.html',
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

        vm.accept = function (inv) {
            vm.states[inv.experimentId] = 'accepted';
            vm.updateEnabled = true;
        };

        vm.reject = function (inv) {
            vm.states[inv.experimentId] = 'rejected';
            vm.updateEnabled = true;
        };

        vm.isAccepted = function (inv ){
            return (vm.states[inv.experimentId] === 'accepted');	
        };
        
        vm.isRejected = function (inv ){
            return (vm.states[inv.experimentId] === 'rejected');	
        };

        vm.update = function () {
			//console.log("invs before UPDATE ",vm.invs);
            var auxInvs = angular.copy(vm.invs);
            var parts = [];
            var exps = [];
            var objPart = {};
			var objExp = {};
			
            vm.loadingChart = true;
			//console.log('STATES ', vm.states);
            for (var i = 0; i < auxInvs.length; i++) {
				auxInvs[i].state = vm.states[auxInvs[i].experimentId];
				if ((auxInvs[i].state == 'accepted') && (auxInvs[i].state !== vm.invs[i].state)) {
					// Object to add to participant collection
					objPart = new Object();
					objPart.experimentId = auxInvs[i].experimentId;
					objPart.email = auxInvs[i].email;
					objPart.subscribedId = auth.getCurrentUserId();
					objPart.username = auth.getCurrentUserName();
					parts.push(objPart);
					// Object to add to experiment collection
					objExp = new Object();
					objExp.experimentId = auxInvs[i].experimentId;
					objExp.experimentName = auxInvs[i].experimentName;
					objExp.description = auxInvs[i].description;
					objExp.username = auth.getCurrentUserName();
					objExp.subscribedFrom = 'Invitation';
					exps.push(objExp);					
				}
            }
            //console.log('PARTS-> ',parts);
            //console.log('AUXinvs-> ', auxInvs);
            
            invitationSrv.updateInvitations (auxInvs, 
                function () {
                    vm.loadingChart = false;
                    alert.success('Invitationes updated');
                    vm.invs = invitationSrv.getInvitations();
					//console.log("invs despues de update ",vm.invs);
                }, 
                function () {
                    vm.loadingChart = false;
                    vm.invs = invitationSrv.getInvitations();
                    alert.error('Invitationes could not be updates');
                }
            );
            
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
			
            selectedExpSrv.newExperiments (exps, 
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
            
            vm.updateEnabled = false;
            //vm.states = {};
            //vm.invs = participantSrv.getInvitations();
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
