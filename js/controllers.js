angular.module('mcdapiloc.controllers', [])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

    })

    .controller('AtmsCtrl', ['$scope', '$stateParams', 'Session', 'ATMService', 'NgMap',
        function ($scope, $stateParams, Session, ATMService, NgMap) {
            $scope.map = {
                center: {
                    lat: 0,
                    lng: 0
                },
                atms: [],
                zoom: 12
            };
            $scope.atms = [];
            $scope.allAtms = [];
            $scope.currentState = {
                showAtms: true,
                showAtm: false,
                atm: {},
                types: "['address']",
                address: null,
                showAddress: false
            }

            $scope.showAtm = function (atm) {
                $scope.currentState.atm = atm;
                $scope.currentState.showAtms = false;
                $scope.currentState.showAtm = true;
                $scope.initAtms([atm]);
            };

            $scope.showAtms = function () {
                $scope.currentState.showAtm = false;
                $scope.currentState.showAtms = true;
                $scope.initAtms($scope.allAtms);
            };

            $scope.placeChanged = function () {
                var place = this.getPlace();
                var pos = {
                    coords: {
                        latitude: this.getPlace().geometry.location.lat(),
                        longitude: this.getPlace().geometry.location.lng()
                    }
                };
                $scope.onSuccess(pos);
            };

            $scope.initAtms = function (atms) {
                $scope.map.center.lat = atms[0].pos[0];
                $scope.map.center.lng = atms[0].pos[1];
                $scope.atms = atms;
                $scope.mapObj.setCenter({ lat: $scope.map.center.lat, lng: $scope.map.center.lng });
            }

            $scope.loadAtms = function (position) {
                if (position) {
                    ATMService.nearby(position, function (atms) {
                        atms.forEach(ATMService.prepGmaps, ATMService);
                        $scope.allAtms = atms;
                        $scope.initAtms(atms);
                        $scope.currentState.showAddress = true;
                    });
                }
            };

            $scope.onSuccess = function (position) {
                if (null == position) {
                    alert('Unable to current location info');
                } else if (position.coords) {
                    $scope.loadAtms(position);
                }

            };

            NgMap.getMap().then(function (map) {
                $scope.mapObj = map;
                Session.getCurrentPosition($scope.onSuccess);
            });
        }]);
