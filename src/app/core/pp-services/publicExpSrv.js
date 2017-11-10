(function() {
    'use strict';

    angular.module('app.components')
        .factory('publicExpSrv', [
            'publicExpAPI', 
            publicExpSrv
        ]);


    function publicExpSrv(
        publicExpAPI
    ) {
        var experiments = null;
        var service = {
            loadPubExperiments: loadPubExperiments,
            getPubExperiments: getPubExperiments
        };
		
        return service;
		
        function loadPubExperiments (success, fail) 
        {
            publicExpAPI.getPubExperiments( 
				function (res){
					experiments = res.experiments;
					//console.log("EXPS ",experiments);
				   return success();
				}, fail);   
        }
        
        function getPubExperiments ()
        {
            return (experiments !== null ? experiments : []);
        }
		
    }
})();