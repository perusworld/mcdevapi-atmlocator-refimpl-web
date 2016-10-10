angular.module('mcdapiloc.controllers', [])

    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {

        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //$scope.$on('$ionicView.enter', function(e) {
        //});

    })

    .controller('MapsCtrl', ['$scope', '$stateParams', 'Session', 'ATMService', 'NgMap',
        function ($scope, $stateParams, Session, ATMService, NgMap) {
            $scope.atms = [];
            var center = {
                lat: 0,
                lng: 0
            };
            $scope.map = {
                center: center,
                zoom: 12
            };
            var vm = this;

            NgMap.getMap().then(function (map) {
                vm.mapObj = map;
                Session.getCurrentPosition(onSuccess);
            });
            Session.onEvent("ATMS", function (atms) {
                $scope.map.center.lat = atms[0].pos[0];
                $scope.map.center.lng = atms[0].pos[1];
                $scope.atms = atms;
            });

            var onSuccess = function (position) {
                if (null == position) {
                    alert('Unable to current location info');
                } else if (position.coords) {
                    vm.mapObj.setCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
                    Session.fireEvent("GEO", position);
                }

            };

            $scope.showAtm = function (marker) {
            };

        }
    ])


    .controller('AtmsCtrl', ['$scope', '$stateParams', 'Session', 'ATMService',
        function ($scope, $stateParams, Session, ATMService) {
            $scope.atms = [];
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
                Session.fireEvent("ATMS", [atm]);
            };

            $scope.showAtms = function () {
                $scope.currentState.showAtm = false;
                $scope.currentState.showAtms = true;
                Session.fireEvent("ATMS", $scope.atms);
            };

            $scope.placeChanged = function () {
                var place = this.getPlace();
                var pos = {
                    coords: {
                        latitude: this.getPlace().geometry.location.lat(),
                        longitude: this.getPlace().geometry.location.lng()
                    }
                };
                Session.fireEvent("GEO", pos);
            };

            Session.onEvent("GEO", function (position) {
                if (position) {
                    ATMService.nearby(position, function (atms) {
                        atms.forEach(ATMService.prepGmaps, ATMService);
                        $scope.atms = atms;
                        Session.fireEvent("ATMS", atms);
                        $scope.currentState.showAddress = true;
                    });
                }
            });

        }]);
