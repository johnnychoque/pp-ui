(function() {
    'use strict';
    angular.module('app.components').factory('auth', auth);
    auth.$inject = [
        '$http',
        '$location',
        '$state',
        '$timeout',
        '$window',
        'jwtHelper',
        'AuthAPI',
        'Config'
    ];

    function auth(
        $http,
        $location,
        $state,
        $timeout,
        $window,
        jwtHelper,
        AuthAPI,
        Config
    ) {
        var user = {
            token: null,
            refresh_token: null,
            data: {}
        };
        var lastCheck = null;
        var refreshingToken = false;
        $timeout(function() {initialize();}, 100);
        var service = {
            isAuth: isAuth,
            getCurrentUser: getCurrentUser,
            getCurrentUserId: getCurrentUserId,
			getCurrentUserName: getCurrentUserName,
            login: login,
            logout: logout,
            callback: callback,
            getToken: getToken,
            refreshToken: refreshToken,
            getRolesUser: getRolesUser,
			isUserParticipant: isUserParticipant
        };
        return service;

        function initialize() {
            initUser();
            var token = $window.localStorage.getItem('organicity.token');
            var refresh_token = $window.localStorage.getItem('organicity.token');
            var data = $window.localStorage.getItem('organicity.data');

            try {
                if (!jwtHelper.isTokenExpired(token) ){
                    user.token = token;
                    user.refresh_token = refresh_token;
                    user.data = JSON.parse(data);
                    return $location.path('/participants');
                } else if (jwtHelper.parse(refresh_token)){
                    refreshToken(refresh_token);
                    return $location.path('/participants');
                }
            } catch (e){

            }
        }

        function initUser () {
            $window.localStorage.removeItem('organicity.token');
            $window.localStorage.removeItem('organicity.data');
            $window.localStorage.removeItem('organicity.refresh_token');
            user = { token: null, refresh_token: null, data: {}};
        }

        var myLast = new Date();
        //console.log(myLast);
        function checkToken () {
            try {
                if (!jwtHelper.isTokenExpired(user.token)) {
                    //console.log(myLast)
                    return;
                }
                if (user.refresh_token !== null && refreshingToken === false) {
                    refreshingToken = true;
                    refreshToken(user.refresh_token);     
                    return;               
                }
            } catch (e){
                logout();
            }
        }

        function refreshToken (tok) {
            return AuthAPI.refreshToken(tok, function(data) {
                user.token = data.access_token;
                user.refresh_token = data.refresh_token;
                var jwt_decoded = jwtHelper.decodeToken(user.token); 
                user.data = {};
                user.data.email = jwt_decoded.email;
                user.data.preferred_username = jwt_decoded.preferred_username;
                user.data.id = jwt_decoded.sub;
                user.data.roles = jwt_decoded.realm_access.roles;
                window.localStorage.setItem('organicity.token', user.token);
                window.localStorage.setItem('organicity.refresh_token', user.reresf_token);
                window.localStorage.setItem('organicity.data', JSON.stringify(user.data));
                refreshingToken = false;
                return;
             }, function() {
                refreshingToken = false;
                logout();
                return;
             });
        }

        function getToken () {
            checkToken();
            return user.token;
        }

        function getCurrentUser() {
            return user;
        }

        function getCurrentUserId() {
            return user.data.id;
        }
		
        function getCurrentUserName() {
            return user.data.preferred_username;
        }
        
		function getRolesUser() {
			return user.data.roles;
		}
		
		function isUserParticipant(success, fail) {
			return (user.data.roles.includes('participant') ? success() : fail() );
		}
        
        function isAuth() {
            if (elapsed()) {
               checkToken();
            }
            return (user.token !== null);
        }


        function login() {
            var winLoc = 'https://accounts.organicity.eu/realms/organicity/protocol/openid-connect/auth?client_id=' +
            Config.getClientId() + '&response_type=code&redirect_uri=' +
            Config.getRedirectUri () + '&scope=offline_access';
            //console.log(winLoc);
            window.location.href = winLoc;
        }

        function callback() {
            if (user.token !== null) {
                return $location.path('/participants');
            }
            //var authCode = $location.search()['code'];
            var authCode = $location.search().code;
            AuthAPI.requireToken(authCode, function(data) {
                //console.log(data.access_token);
                user.token = data.access_token;
                user.refresh_token = data.refresh_token;
                var jwt_decoded = jwtHelper.decodeToken(user.token); 
                //console.log('JWT ', jwt_decoded);
                user.data = {};
                user.data.email = jwt_decoded.email;
                user.data.preferred_username = jwt_decoded.preferred_username;
                user.data.id = jwt_decoded.sub;
                user.data.roles = jwt_decoded.realm_access.roles;
                window.localStorage.setItem('organicity.token', user.token);
                window.localStorage.setItem('organicity.refresh_token', user.reresf_token);
                window.localStorage.setItem('organicity.data', JSON.stringify(user.data));
                return $location.path('/participants');
             }, function(res) {
                return $location.path('/welcome');
             });
        }
		
        function logout(str) {
            initUser();
            return $location.path('/welcome');
        }

        function elapsed () {
            if (lastCheck === null) {
                lastCheck = new Date();
                return true;
            }
            var now = new Date();
            if ( (now - lastCheck) > 1000 ) {
                lastCheck = new Date();
                return true;   
            }
            return false;
        }
    }
})();
