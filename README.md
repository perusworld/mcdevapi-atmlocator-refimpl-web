# Mastercard Developer API - ATM Locations - Reference Implementation - Angular/Express #

## [Demo](https://perusworld.github.io/mcdevapi-atmlocator-refimpl-web/) ##

## Setup ##

1.Checkout the code
```bash
git clone https://github.com/perusworld/mcdevapi-atmlocator-refimpl-web.git
```
2.Run bower install
```bash
bower install
```
3.Run npm install
```bash
npm install
```

## Running using dummy data ##
1.Start the app
```bash
node index.js
```
2.Open browser and goto [http://localhost:3000](http://localhost:3000)

## Running using MasterCard API ##
Make sure you have registered and obtained the API keys and p12 files from [https://developer.mastercard.com/](https://developer.mastercard.com/)

1.Start the app
```bash
export KEY_FILE=<your p12 file location>
export API_KEY=<your api key>
node index.js
```
2.Open browser and goto [http://localhost:3000](http://localhost:3000)

#### Some of the other options ####
```bash
export KEY_FILE_PWD=<p12 key password defaults to keystorepassword>
export KEY_FILE_ALIAS=<p12 key alias defaults to keyalias>
export SANDBOX=<sandbox or not defaults to true>
```
## Code ##
### Backend API Initialization ###
```javascript
var locations = require('mastercard-locations');
var MasterCardAPI = locations.MasterCardAPI;
var config = {
    p12file: process.env.KEY_FILE || null,
    p12pwd: process.env.KEY_FILE_PWD || 'keystorepassword',
    p12alias: process.env.KEY_FILE_ALIAS || 'keyalias',
    apiKey: process.env.API_KEY || null,
    sandbox: process.env.SANDBOX || 'true',
}
 var authentication = new MasterCardAPI.OAuth(config.apiKey, config.p12file, config.p12alias, config.p12pwd);
    MasterCardAPI.init({
        sandbox: 'true' === config.sandbox,
        authentication: authentication
    });
```
### Backend API Call (using latitude,longitude sent as part of JSON post) ###
```javascript
app.post('/atmsNearby', function (req, res) {
  var requestData = {
      "PageLength": "5",
      "PageOffset": "0",
      "Latitude": req.body.latitude,
      "Longitude": req.body.longitude
  };

  locations.ATMLocations.query(requestData, function (error, data) {
      if (error) {
          console.error("An error occurred");
          console.dir(error, { depth: null });
          res.json({
              Atms: {
                  PageOffset: "0",
                  TotalCount: 0,
                  Atm: []
              }
          });
      }
      else {
          res.json(data);
      }
  });

});

```
### Angular Service to get ATMs at a location ###
```javascript
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
                });
            }
        };

    }])
        .service('ATMService', ['LocApi', function (LocApi) {
        var ret = {
            nearby: function (position, callback) {
                LocApi.getAtms(position, function (atmResp) {
                    ret.current = atmResp.Atms.Atm.map(function (item, index) {
                        item.id = index;
                        item.pos = [item.Location.Point.Latitude, item.Location.Point.Longitude];
                        return item;
                    });
                    callback(ret.current)
                });
            },
        };
        return ret;

    }]);
```
### Angular Controller to get ATMs at a location ###
```javascript
.controller('AtmsCtrl', ['$scope', '$stateParams', 'ATMService',
    function ($scope, $stateParams, ATMService) {
        $scope.atms = [];
        navigator.geolocation.getCurrentPosition(function (position) {
            ATMService.nearby(position, function (atms) {
                $scope.atms = atms;
            });
        }, function (error) {
        });
    }]);
```
### Angular Template list the ATMs ###
```html
    <div class="nav-list-item" href="" ng-click="showAtm(atm)" ng-repeat="atm in atms">
        <div class="details-holder">
            <h1>{{atm.Location.Name}}</h1>
            <h2>{{atm.Location.Address.Line1}}, {{atm.Location.Address.City}}</h2>
        </div>
        <div class="distance-holder">
            <h2 class="access">{{atm.Location.Distance | number : 2}} miles</h2><img class="carot" src="images/carot.svg">
        </div>
    </div>
```
