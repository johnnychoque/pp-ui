(function() {
    'use strict';

    angular.module('app.components')
        .factory('publicExpAPI', [
		'Restangular',
		'Config',	
		publicExpAPI]
	);


    function publicExpAPI(
		Restangular,
		Config
	) {

        var api = Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(Config.getEpEndpoint());
        });

        var service = {
            getPubExperiments: getPubExperiments
        };

        return service;
		
        function getPubExperiments (success, fail){
            var path = 'publicexperiments';
            api.one(path).get().then( function (res){ return success(res.plain()); }, fail);
        }
		
    }
})();