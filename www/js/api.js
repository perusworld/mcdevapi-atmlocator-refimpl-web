angular.module('mcdapiloc.api', [])


    .service('LocApi', ['$http', function ($http) {
        return {
            getAtms: function (position, callback) {
                var data = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                }
                $http.post('/atmsNearby', data).then(function successCallback(response) {
                    callback(response.data)
                }, function errorCallback(response) {
                    $http.get('/data/dummy-response.json').then(function successCallback(response) {
                        callback(response.data)
                    }, function errorCallback(response) {
                    });
                });
            }
        };

    }]);

