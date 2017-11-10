(function() {
    'use strict';

    angular.module('app.components')
        .factory('participantSrv', ['participantAPI', participantSrv]);


    function participantSrv(participantAPI) {

        var invitations = null;
		var experiments = null;

        var service = {
			newParticipants: newParticipants
        };

        return service;

		/*
		Un usuario que acepta una invitación es añadido a la BD de participantes
		*/
        function newParticipants (parts, success_, fail_) {
            participantAPI.newParticipants(parts, function() {
                success_();
            }, fail_);
        }
		
    }
})();