angular.module('mcdapiloc.controllers', [])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

    })

    .controller('MapsCtrl', ['$scope', '$stateParams', 'Session', 'ATMService', 'uiGmapGoogleMapApi',
        function ($scope, $stateParams, Session, ATMService, uiGmapGoogleMapApi) {
            $scope.atms = [];
            $scope.googleMap = {};
            $scope.googleMapMarkers = {};
            $scope.maps = {};

            var prevMarker = null;

            var center = {
                latitude: 0,
                longitude: 0
            };
            $scope.map = {
                center: center,
                zoom: 12
            };

            Session.onEvent("ATMS", function (atms) {
                var center = {
                    latitude: atms[0].latitude,
                    longitude: atms[0].longitude
                };
                $scope.map = {
                    center: center,
                    zoom: 12
                };
                $scope.googleMap.refresh(center);
                $scope.atms = atms;
            });

            var onSuccess = function (position) {
                if (null == position) {
                    alert('Unable to current location info');
                } else {
                    checkMaps(position);
                }
            };

            $scope.onClick = function (marker, eventName, model) {
            };

            var checkMaps = function (position) {
                if (position.coords && $scope.maps.version) {
                    var center = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    $scope.map = {
                        center: center,
                        zoom: 12
                    };
                    $scope.googleMap.refresh(center);
                    Session.fireEvent("GEO", position);
                }
            };


            uiGmapGoogleMapApi.then(function (maps) {
                $scope.maps = maps;
                Session.getCurrentPosition(onSuccess);
            });
        }
    ])


    .controller('AtmsCtrl', ['$scope', '$stateParams', 'Session', 'ATMService',
        function ($scope, $stateParams, Session, ATMService) {
            $scope.atms = [];
            $scope.currentState = {
                showAtms: true,
                showAtm: false,
                atm: {}
            }

            $scope.showAtm = function (atm) {
                $scope.currentState.atm = atm;
                $scope.currentState.showAtms = false;
                $scope.currentState.showAtm = true;
                Session.fireEvent("ATMS", [atm]);
            };

            $scope.showAtms = function () {
                $scope.currentState.showAtm = false;
                $scope.currentState.showAtms = true;
                Session.fireEvent("ATMS", $scope.atms);
            };

            Session.onEvent("GEO", function (position) {
                loadAtms(position);
            });

            var loadAtms = function (position) {
                if (position) {
                    ATMService.nearby(position, function (atms) {
                        atms.forEach(ATMService.prepGmaps, ATMService);
                        $scope.atms = atms;
                        Session.fireEvent("ATMS", atms);
                    });
                }
            };

        }]);
