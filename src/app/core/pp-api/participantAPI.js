(function() {
    'use strict';

    angular.module('app.components')
        .factory('participantAPI', ['$log', 'Restangular', participantAPI]);


    function participantAPI($log, Restangular) {

        var service = {
			newParticipants: newParticipants
        };

        return service;

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
                    console.log('New participants FAIL!!');
                    fail_();
                });
        }
		

    }
})();
