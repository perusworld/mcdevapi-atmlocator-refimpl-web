angular.module('mcdapiloc', ['ionic', 'mcdapiloc.controllers', 'mcdapiloc.routes', 'mcdapiloc.services', 'mcdapiloc.api', 'uiGmapgoogle-maps'])

  .config(
  ['uiGmapGoogleMapApiProvider', function (GoogleMapApiProviders) {
    GoogleMapApiProviders.configure({
      v: '3',
      libraries: 'weather,geometry,visualization'
    });
  }]
  )

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
    });
  });
