(function() {
    'use strict';

    angular.module('app.components')
        .factory('invitationAPI', ['Restangular', invitationAPI]);


    function invitationAPI(Restangular) {

        var service = {
            getInvitations: getInvitations,
            updateInvitations: updateInvitations
        };

        return service;

		/*
		
		*/
        function getInvitations(success_, fail_){
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
            //console.log('Updating invitations');
            //console.log(invs);
            Restangular.one(path).customPUT(invs).then(
                function () {
                    //console.log('Updating OK!!');
                    success_();
                }, function () {
                    console.log('Updating FAIL!!');
                    fail_();
                });
        }

    }
})();
