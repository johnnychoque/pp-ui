(function() {
    'use strict';

    angular.module('app')
        .run(run);

    run.$inject = ['$rootScope', '$state', 'Restangular', 'auth', '$templateCache', '$window', 'animation'];

    function run($rootScope, $state, Restangular, auth, $templateCache, $window, animation) {
        $window.localStorage.clear(); //tmp.
        /**
         * every time the state changes, run this check for whether the state
         * requires authentication and, if needed, whether the user is
         * authenticated.
         *
         * authenticate can be: true, false or undefined
         * true when the user must be authenticated to access the route. ex: user profile
         * false when the user cannot be authenticated to access the route. ex: login, signup
         * undefined when it doesn't matter whether the user is logged in or not
         */


        /*jshint unused:false*/
        $rootScope.$on('$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {

            // on state change close all alerts opened
            animation.hideAlert();

            // move window up on state change
            $window.scrollTo(0, 0);

            return;
        });

        Restangular.addFullRequestInterceptor(function(element, operation, what, url, headers, params, httpConfig) {
            if (auth.isAuth()) {
                var token = auth.getToken();
                headers.Authorization = 'Bearer ' + token;
            }
            return {
                element: element,
                headers: headers,
                params: params,
                httpConfig: httpConfig
            };
        });
    }

})();