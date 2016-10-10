angular.module('mcdapiloc.routes', [])

    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('atms', {
                url: '/atms',
                templateUrl: 'templates/atms.html',
                controller: 'AtmsCtrl'
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/atms');
    });