(function() {
    'use strict';

    angular.module('app.components')
        .controller('InvPortalController', InvPortalController);

    InvPortalController.$inject = ['$log','EpCommunity', 'DTOptionsBuilder', 'DTColumnDefBuilder', '$mdDialog', 'alert', 'auth'];

    function InvPortalController($log, EpCommunity, DTOptionsBuilder, DTColumnDefBuilder, $mdDialog, alert, auth) {
        var vm = this; 
        vm.statusOpt = '';
        vm.invs = EpCommunity.getInvitations();
        vm.states = {};
        vm.updateEnabled = false;
        vm.loadingChart = false;
        
        //HARDCODED
        //vm.participantId = '909090';
        //vm.username = 'tester';

        vm.participantId = auth.getCurrentUserId();
        vm.username = auth.getCurrentUserName();
        /*
        for (var i = 0; i < vm.invs.length; i++) {
            vm.states[vm.invs[i].experimentId] = vm.invs[i].state;
        }*/

        console.log(JSON.stringify(vm.invs));

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
            DTColumnDefBuilder.newColumnDef(6).notSortable(),
        ];

        vm.shortDescription = function(str) {
            return str.substr(0, 150) + '...';
        };
        
        vm.getDate = function (d) {
            var date = new Date(d);
            return date.toISOString().slice(0, 10);
        };

        vm.showInfo = function(inv) {
            $mdDialog.show({
                locals: {
                  mdInfo: {
                     proceed: function() { $mdDialog.hide(); },
                     title: inv.experimentName,
                     info: inv.description,
                  }
                },
                controller: 'EpErrorController as vm',
                templateUrl: 'app/components/ep/epError.html',
                clickOutsideToClose: false
            });

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
            var auxInvs = angular.copy(vm.invs);
            var parts = [];
            
            vm.loadingChart = true;
            var obj = {};
            console.log('STATES ', vm.states);
            for (var i = 0; i < auxInvs.length; i++) {
                if (vm.states[auxInvs[i].experimentId] === undefined) {
                    auxInvs[i].state = 'pending';
                }
                else {
                    auxInvs[i].state = vm.states[auxInvs[i].experimentId];
                    if (auxInvs[i].state == 'accepted') {
                        obj = new Object();
                        obj.experimentId = auxInvs[i].experimentId;
                        obj.subscribedId = vm.participantId;
                        obj.username = vm.username;
                        parts.push(obj);
                    }
                }
            }
            console.log('PARTS-> ',parts);
            console.log('AUXinvs-> ', auxInvs);
            
            EpCommunity.updateInvitations (auxInvs, 
                function () {
                    vm.loadingChart = false;
                    alert.success('Invitationes updated');
                    vm.invs = EpCommunity.getInvitations();
                }, 
                function () {
                    vm.loadingChart = false;
                    vm.invs = EpCommunity.getInvitations();
                    alert.error('Invitationes could not be updates');
                }
            );
            
            EpCommunity.newParticipants (parts, 
                function () {
                    vm.loadingChart = false;
                    //alert.success('Invitationes updated')
                    //vm.invs = EpCommunity.getInvitations();
                }, 
                function () {
                    vm.loadingChart = false;
                    //vm.invs = EpCommunity.getInvitations();
                    //alert.error('Invitationes could not be updates')
                }
            );
            
            vm.updateEnabled = false;
            vm.states = {};
            vm.invs = EpCommunity.getInvitations();
        };
    }
    
})();
