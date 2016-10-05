angular.module('mcdapiloc', ['ionic', 'mcdapiloc.controllers', 'mcdapiloc.routes', 'mcdapiloc.services', 'mcdapiloc.api', 'uiGmapgoogle-maps'])

  .config(
  ['uiGmapGoogleMapApiProvider', function (GoogleMapApiProviders) {
    GoogleMapApiProviders.configure({
      key: 'AIzaSyB1yvLCa8MOl9au4T13gA0T4XK_NP4MQ_w',
      v: '3',
      libraries: 'weather,geometry,visualization'
    });
  }]
  )

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
    });
  });
