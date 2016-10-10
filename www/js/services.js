angular.module('mcdapiloc.services', [])

    .factory('Session',['$rootScope', '$http', function ($rootScope, $http) {
        var Session = {
            data: {},
            set: function (key, value) {
                Session.data[key] = value;
            },
            get: function (key) {
                return Session.data[key];
            },
            getCurrentPosition: function (callback) {
                var ret = Session.data['CurrentPosition'];
                if (null == ret) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        Session.data['CurrentPosition'] = position;
                        callback(position);
                    }, function (error) {
                        Session.data['CurrentPosition'] = null;
                        callback(null);
                    });
                } else {
                    callback(ret);
                };
            },
            fireEvent: function(msgId, args) {
                $rootScope.$broadcast(msgId, args);
            },
            onEvent: function(msgId, handler) {
                $rootScope.$on(msgId, function(event, args) {
                    handler(args);
                });
            }
        };
        return Session;
    }])

    .factory('BlankFactory', [function () {

    }])

    .service('ATMService', ['LocApi', function (LocApi) {
        var ret = {
            services: function (atm) {
                var ret = {};
                var valid = ['HandicapAccessible', 'Camera', 'AccessFees', 'SharedDeposit', 'SurchargeFreeAlliance', 'SupportEMV', 'InternationalMaestroAccepted'];
                valid.forEach(function (key) {
                    ret[key] = atm[key] != 'NO' && atm[key] != 'UNKNOWN' && atm[key] != 'DOES_NOT_PARTICIPATE_IN_SFA' && atm[key] != '0';
                });
                return ret;
            },
            nearby: function (position, callback) {
                LocApi.getAtms(position, function (atmResp) {
                    ret.current = atmResp.Atms.Atm.map(function (item, index) {
                        item.id = index;
                        item.pos = [item.Location.Point.Latitude, item.Location.Point.Longitude];
                        item.services = ret.services(item);
                        return item;
                    });
                    callback(ret.current)
                });
            },
            get: function (locId, position, callback) {
                ret.nearby(position, function (atms) {
                    callback(ret.current.find(function (atm) { return atm.id == locId }));
                })
            },
            prepGmaps: function (atm, index) {
                var idx = (null == index) ? "." : (index + 1)
                atm.options = {
                    title: atm.Location.Name,
                    icon: 'http://chart.apis.google.com/chart?chst=d_map_spin&chld=.5|0|fd9827|10|b|' + idx
                };
            }
        };
        return ret;

    }]);