(function() {
    'use strict';

    angular.module('app.components')
        .factory('invitationSrv', ['invitationAPI', invitationSrv]);


    function invitationSrv(invitationAPI) {

        var invitations = null;

        var service = {
            getInvitations: getInvitations,
            loadInvitations: loadInvitations,
            updateInvitations: updateInvitations
        };

        return service;

		/*
		
		*/
        function getInvitations () {
            return (invitations !== null ? invitations : []);
        }

		/*
		
		*/
        function loadInvitations (success_, fail_) {
            invitationAPI.getInvitations(function (ret) {
                invitations = ret;
                //console.log(invitations);
                success_();
            }, fail_);
        }
		
		/*
		
		*/
        function updateInvitations (invs, success_, fail_) {
            //console.log('INVS-> ',invs);
            invitationAPI.updateInvitations(invs, function() {
                invitations = invs;
                success_();
            }, fail_);
        }

    }
})();