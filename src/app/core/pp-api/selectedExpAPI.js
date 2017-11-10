(function() {
    'use strict';

    angular.module('app.components')
        .factory('selectedExpAPI', ['Restangular','Config', selectedExpAPI]);


    function selectedExpAPI(Restangular,Config) {

        var api = Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(Config.getEpEndpoint());
        });
		
        var service = {
			getExperiments: getExperiments,
			newExperiments: newExperiments,
			getApplications: getApplications
        };

        return service;

		/*
		Solicita a cm-api los experimentos en los que participa un usuario.
		cm-api filtra los experimentos en base al username obtenido del token que recibe
		*/
        function getExperiments(success_, fail_){
            var path = 'experiments';
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
        function newExperiments (exps, success_, fail_) {
            var path = 'experiments';
            //console.log('Creating new experiments');
            //console.log(exps);
            Restangular.one(path).customPOST(exps).then(
                function () {
                    //console.log('New experiments OK!!');
                    success_();
                }, function () {
                    console.log('New experiments BAD!!');
                    fail_();
                });
        }
		
        function getApplications(experId, success_, fail_) {
            var path = 'experiments/' + experId + '/applications';
			//console.log("getApps API");
            api.one(path).get().then(
                function(res) {
					//console.log(res);
                    success_(res.plain());
                },
                function() {
					console.log("fail");
                    fail_();
                });
        }

    }
})();
