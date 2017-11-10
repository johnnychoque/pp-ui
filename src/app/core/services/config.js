(function() {
    'use strict';


    angular.module('app.components').factory('Config', [
        Config
    ]);

    function Config() {

        var develop = true;
        
        var dev_client_id = 'participants-portal-dev';
        var dev_redirect_uri = 'http://10.10.1.81:8060/';
        var dev_base_url = 'http://10.10.1.81:8082';
		var dev_ep_url = 'http://10.10.1.81:8081';

        var dep_client_id = 'participants-portal';
        var dep_redirect_uri = 'https://participants.organicity.eu/';
		// PP usa el mismo API del CM
        var dep_base_url = 'https://communities.organicity.eu:9443';
		var dep_ep_url = 'https://experimenters.organicity.eu:8443';

        var service = {
            getClientId: getClientId,
            getRedirectUri: getRedirectUri,
            getBaseUrl: getBaseUrl,
			getEpEndpoint : getEpEndpoint
        };

        return service;

        function getBaseUrl ()  {
            if (develop === true) { return dev_base_url; }
            return dep_base_url;
        }

        function getClientId () {
            if (develop === true) { return dev_client_id; }
            return dep_client_id;
        }

        function getRedirectUri () {
            if (develop === true) { return dev_redirect_uri; }
            return dep_redirect_uri;
        }
		
        function getEpEndpoint () {
            if (develop === true) { return dev_ep_url; }
            return dep_ep_url;
        }
    }
})();
