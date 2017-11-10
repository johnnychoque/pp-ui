(function() {
    'use strict';

    angular.module('app.components')
        .factory('selectedExpSrv', ['selectedExpAPI', selectedExpSrv]);


    function selectedExpSrv(selectedExpAPI) {

		var experiments = null;
		var applications = null;

        var service = {
			getExperiments: getExperiments,
			loadExperiments: loadExperiments,
			newExperiments: newExperiments,
			loadApplications: loadApplications
        };

        return service;

		/*
		
		*/
        function getExperiments () {
            return (experiments !== null ? experiments : []);
        }

		
		/*
		
		*/
        function loadExperiments (success, fail) {
            selectedExpAPI.getExperiments(function (ret) {
                experiments = ret;
                //console.log(experiments);
                success();
            }, fail);
        }
		
		
        function loadApplications(success, fail) {
			for (i = 0; i < experiments.length; i++) {
				selectedExpAPI.getApplications(experiments[i].experimentId, success_, fail_);
			}
			
			function success_(apps) {
				//console.log("APPS ", apps);
				for (j=0; j<apps.length; j++) {
					applications.push(apps[j]); 
				}
			}

			function fail_() {}
        }
		
		/*
		Los experimentos elegidos son añadidos a la coleccion "experiments"
		*/
        function newExperiments (exps, success, fail) {
            selectedExpAPI.newExperiments(exps, function() {
				loadExperiments(function success_(){}, function fail_(){});
                success();
            }, fail);
        }
		
    }
})();