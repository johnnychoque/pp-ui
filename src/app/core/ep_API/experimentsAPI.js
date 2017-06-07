(function() {
    'use strict';

    angular.module('app.components')
        .factory('ExperimentsAPI', ['$log', 'Restangular', ExperimentsAPI]);


    function ExperimentsAPI($log, Restangular) {

        var service = {
            getParInvitations: getParInvitations,
            updateInvitations: updateInvitations,
			newParticipants: newParticipants
        };

        return service;

		/*
		
		*/
        function getParInvitations(success_, fail_){
            var path = 'par-invitations';
            Restangular.one(path).get().then(
                function (res){
                    return success_(res.plain());
                },
                function (){
                    return fail_();
                });
        }

		/*
		
		*/
        function updateInvitations (invs, success_, fail_) {
            var path = 'par-invitations';
            console.log('Updating invitations');
            console.log(invs);
            Restangular.one(path).customPUT(invs).then(
                function () {
                    console.log('Updating OK!!');
                    success_();
                }, function () {
                    console.log('Updating KO!!');
                    fail_();
                });
        }

		/*
		
		*/
        function newParticipants (parts, success_, fail_) {
            var path = 'participants';
            console.log('Creating new participants');
            console.log(parts);
            Restangular.one(path).customPOST(parts).then(
                function () {
                    console.log('New participants OK!!');
                    success_();
                }, function () {
                    console.log('New participants KO!!');
                    fail_();
                });
        }
		

    }
})();
