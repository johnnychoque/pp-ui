(function() {
    'use strict';

    angular.module('app.components')
        .factory('EpCommunity', ['$log', 'ExperimentsAPI', EpCommunity]);


    function EpCommunity($log, ExperimentsAPI) {

        var invitations = null;

        var service = {
            getInvitations: getInvitations,
            loadParInvitations: loadParInvitations,
            updateInvitations: updateInvitations,
			newParticipants: newParticipants
        };

        return service;

		/*
		
		*/
        function getInvitations () {
            return (invitations !== null ? invitations : []);
        }

		/*
		
		*/
        function loadParInvitations (success_, fail_) {
            ExperimentsAPI.getParInvitations(function (ret) {
                invitations = ret;
                console.log(invitations);
                success_();
            }, fail_);
        }
		
		/*
		
		*/
        function updateInvitations (invs, success_, fail_) {
            console.log('INVS-> ',invs);
            ExperimentsAPI.updateInvitations(invs, function() {
                invitations = invs;
                success_();
            }, fail_);
        }

		/*
		Un usuario que acepta una invitación es añadido a la BD de participantes
		*/
        function newParticipants (parts, success_, fail_) {
            ExperimentsAPI.newParticipants(parts, function() {
                //invitations = invs;
                success_();
            }, fail_);
        }
		
    }
})();