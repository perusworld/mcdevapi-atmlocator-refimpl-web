angular.module('mcdapiloc.routes', [])

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('atms', {
                url: '/atms',
                templateUrl: 'templates/atms.html',
                controller: 'AtmsCtrl'
            }).state('atm', {
                url: '/atms/atm/:locId',
                templateUrl: 'templates/atm.html',
                controller: 'AtmCtrl'
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/atms');
    });