angular.module('mcdapiloc.controllers', [])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

    })

    .controller('AtmsCtrl', ['$scope', '$stateParams', 'Session', 'ATMService', 'uiGmapGoogleMapApi',
        function ($scope, $stateParams, Session, ATMService, uiGmapGoogleMapApi) {
            $scope.atms = [];
            $scope.googleMap = {};
            $scope.googleMapMarkers = {};
            $scope.position = {};
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
            var onSuccess = function (position) {
                if (null == position) {
                    alert('Unable to current location info');
                } else {
                    $scope.position = position;
                    checkMaps();
                }
            };

            $scope.onClick = function (marker, eventName, model) {
            };

            var checkMaps = function () {
                if ($scope.position.coords && $scope.maps.version) {
                    ATMService.nearby($scope.position, function (atms) {
                        var center = {
                            latitude: atms[0].latitude,
                            longitude: atms[0].longitude
                        };
                        atms.forEach(ATMService.prepGmaps, ATMService);
                        $scope.googleMap.refresh(center);
                        $scope.map = {
                            center: center,
                            zoom: 12
                        };
                        $scope.atms = atms;
                    });
                }
            };

            Session.getCurrentPosition(onSuccess);

            uiGmapGoogleMapApi.then(function (maps) {
                $scope.maps = maps;
                checkMaps();
            });

        }])

    .controller('AtmCtrl', ['$scope', '$stateParams', 'Session', 'ATMService', 'uiGmapGoogleMapApi',
        function ($scope, $stateParams, Session, ATMService, uiGmapGoogleMapApi) {
            $scope.googleMap = {};
            $scope.atm = {
                id: $stateParams.locId,
                latitude: 0,
                longitude: 0
            };
            var center = {
                latitude: 0,
                longitude: 0
            };
            $scope.map = {
                center: center,
                zoom: 12
            };
            var onSuccess = function (position) {
                if (null == position) {
                    alert('Unable to current location info');
                } else {
                    ATMService.get($stateParams.locId, position, function (atm) {
                        ATMService.prepGmaps(atm);
                        var center = {
                            latitude: atm.latitude,
                            longitude: atm.longitude
                        };
                        $scope.googleMap.refresh(center);
                        $scope.atm = atm;
                    });
                }
            };

            Session.getCurrentPosition(onSuccess);
        }]);
