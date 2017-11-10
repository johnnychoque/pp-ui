(function() {
    'use strict';

    angular.module('app').config(config);

    config.$inject = [
        '$stateProvider', 
        '$urlRouterProvider', 
        '$locationProvider', 
        'RestangularProvider',
        'ConfigProvider'
    ];

    function config(
        $stateProvider, 
        $urlRouterProvider, 
        $locationProvider, 
        RestangularProvider,
        ConfigProvider
    ) {
        $stateProvider.state('callback', {
                url: '/',
                authenticate: false,
                resolve: {
                    callback: function(auth) {
                        auth.callback();
                    }
                }
            })
			
            .state('layout', {
                url: '',
                abstract: true,
                templateUrl: 'app/components/layout/layout.html',
                controller: 'LayoutController',
                controllerAs: 'vm'
            })
			
            .state('layout.welcome', {
                url: '/welcome',
                views: { 
                    'content@layout': {
                        templateUrl: 'app/components/pp/welcome.html',
                        controller: 'WelcomeController',
                        controllerAs: 'vm',
                        resolve: {
                            islogged: function(auth) {
                                auth.logout();
                            }
                        }
                    }
                },
            })
			
            .state('layout.out', {
                url: '/out',
                views: { 
                    'content@layout': {
                        templateUrl: 'app/components/pp/out.html',
                        controller: 'OutController',
                        controllerAs: 'vm',
                        resolve: { }
                    }
                },
            })
			
            .state('layout.static', {
                url: '/static',
                views: { 
                    'content@layout': {
                        templateUrl: 'app/components/static/static.html',
                        controller: 'StaticController',
                        controllerAs: 'vm'
                    }
                }
            })
			
            .state('layout.parts', {
                url: '/participants',
                views: { 
                    'content@layout': {
                        templateUrl: 'app/components/pp/participants.html',
                        controller: 'ParticipantsController',
                        controllerAs: 'vm',
                        resolve: {
                            islogged: function($state, auth) {
                                if (!auth.isAuth()) {
                                    return auth.logout();
                                }
                            }/*,
                            checkUser: function($q, $state, auth) {
                                var defer = $q.defer();
                                defer.promise.then(function() {
                                }, function(){
									console.log("no es PARTICIPANTE. Fuera!");
                                    auth.logout('/out');
                                    $state.go('layout.out');
                                    return;
                                 });
                                auth.isUserParticipant(defer.resolve, defer.reject);
                                return defer.promise;
                            }*/
                        }
                    }
                }
            })
			
            .state('layout.invitations', {
                url: '/invitations',
                views: { 
                    'content@layout': {
                        templateUrl: 'app/components/pp/invitations.html',
                        controller: 'InvitationsController',
                        controllerAs: 'vm',
                        resolve: {
                            islogged: function($state, auth) {
                                if (!auth.isAuth()) {
                                    return auth.logout();
                                }
                            },
                            loadInvitations: function(invitationSrv, $q, $state, auth) {
                                var defer = $q.defer(); 
								//console.log("loadInvitations");
								invitationSrv.loadInvitations(function() {
									defer.resolve({ success: true });
								}, function() {
									defer.resolve({ success: false });
								});
								return defer.promise;
                            }
                        }
                    }
                }
            })
			
			// Selected experiments
            .state('layout.experiments', {
                url: '/experiments',
                views: { 
                    'content@layout': {
                        templateUrl: 'app/components/pp/selectedExps.html',
                        controller: 'SelectedExpsController',
                        controllerAs: 'vm',
                        resolve: {
                            islogged: function($state, auth) {
                                if (!auth.isAuth()) {
                                    return auth.logout();
                                }
                            },
                            loadExperiments: function(selectedExpSrv, $q, $state, auth) {
                                var defer = $q.defer(); 
								//console.log("loadExperiments");
								selectedExpSrv.loadExperiments(function() {
									defer.resolve({ success: true });
								}, function() {
									defer.resolve({ success: false });
								});
								return defer.promise;
                            }
                        }
                    }
                }
            })
			
            .state('layout.publicExps', {
                url: '/public-exps',
                views: { 
                    'content@layout': {
                        templateUrl: 'app/components/pp/publicExps.html',
                        controller: 'PublicExpsController',
                        controllerAs: 'vm',
                        resolve: {
                            islogged: function($state, auth) {
                                if (!auth.isAuth()) {
                                    return auth.logout();
                                }
                            },
                            loadPubExps: function(publicExpSrv, $q, $state, auth) {
                                var defer = $q.defer(); 
								//console.log("load PUB Experiments");
								publicExpSrv.loadPubExperiments(function() {
									defer.resolve({ success: true });
								}, function() {
									defer.resolve({ success: false });
								});
								return defer.promise;
                            },
                            loadSelExps: function(selectedExpSrv, $q, $state, auth) {
                                var defer = $q.defer(); 
								//console.log("load SEL Experiments");
								selectedExpSrv.loadExperiments(function() {
									defer.resolve({ success: true });
								}, function() {
									defer.resolve({ success: false });
								});
								return defer.promise;
                            }
                        }
                    }
                }
            });

        /* Default state */
        $urlRouterProvider.otherwise('/welcome');
        $locationProvider.html5Mode({ enabled: true, requireBase: false }).hashPrefix('!');
        RestangularProvider.setBaseUrl(ConfigProvider.$get().getBaseUrl());
    }
})();
