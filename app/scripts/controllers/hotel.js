/**
 * Created by xiayiqian on 1/9/16.
 */
/**
 * Created by xiayiqian on 12/18/15.
 */
'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */

angular.module('sbAdminApp')
    .controller('hotelCtrl', function ($scope, $http, $cookies, $state) {

        $scope.token = $cookies.get('token');
        $scope.cities = [];

        $scope.rowCollection = [];

        //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
        $scope.displayedCollection = [].concat($scope.rowCollection);

        $scope.hotelToCreate = {};

        $scope.setHotelToDelete = function(row) {
            $scope.hotelToDelete = row;
        }

        $scope.setHotelToUpdate = function(row) {
            $scope.hotelToUpdate = row;

            $scope.hotelToUpdate.longitudeNLatitude = row.longitude + "," + row.latitude;
        }

        //remove to the real data holder
        $scope.deleteHotel = function() {

            $http({
                method: 'GET',
                url: 'http://115.159.87.129:8004/restaurant/hotel/delete?hotelId=' + $scope.hotelToDelete.hotelId,
                headers: {
                    'Content-Type': 'application/json'
                },
                crossDomain: true
            }).success(function(data) {
                var index = $scope.rowCollection.indexOf($scope.hotelToDelete);
                if (index !== -1) {
                    $scope.rowCollection.splice(index, 1);
                }
            }).error(function () {
                console.log("hotel delete failed");
            });
        }

        $scope.updateHotel = function () {

            console.log($scope.hotelToUpdate);

            var geolocation = $scope.hotelToUpdate.longitudeNLatitude;
            var geolocationArr = geolocation.split(',');

            $scope.hotelToUpdate.longitude = geolocationArr[0];
            $scope.hotelToUpdate.latitude = geolocationArr[1];

            $http({
                method: 'POST',
                url: 'http://115.159.87.129:8004/restaurant/hotel/update',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: $scope.hotelToUpdate,
                crossDomain: true
            }).success(function(data) {
                $scope.getHotelList();
                console.log("update hotel successed");
            }).error(function () {
                console.log("update hotel failed");
            });
        }

        $scope.createHotel = function () {

            console.log($scope.hotelToCreate);

            var geolocation = $scope.hotelToCreate.longitudeNLatitude;
            var geolocationArr = geolocation.split(',');

            $scope.hotelToCreate.longitude = geolocationArr[0];
            $scope.hotelToCreate.latitude = geolocationArr[1];

            $scope.hotelToCreate.contractStat = parseInt( $scope.hotelToCreate.contractStat );
            $scope.hotelToCreate.memo = "";
            $http({
                method: 'POST',
                url: 'http://115.159.87.129:8004/restaurant/hotel/add',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: $scope.hotelToCreate,
                crossDomain: true
            }).success(function(data) {
                console.log("hotel create successed");
                $scope.getHotelList();
            }).error(function () {
                console.log("city create failed");
                alert("fail");
            });
        };

        $scope.getHotelList = function() {
            // get restaurant list request
            $http({
                method: 'GET',
                url: 'http://115.159.87.129:8004/restaurant/hotel/all',
                crossDomain: true
            }).success(function (hotelArr) {
                console.log("get hotel list successed");
                $scope.rowCollection = hotelArr;
                $scope.displayedCollection = $scope.rowCollection;
            }).error(function () {
                console.log("getCityList failed");
            });
        };

        $scope.createRestaurantClicked = function(row) {

            $cookies.put('hotelId', row.hotelId);
            $cookies.put('hotelName', row.hotelName);
            $cookies.put('longitude', row.longitude);
            $cookies.put('latitude', row.latitude);
            $cookies.put('city', row.city);
            $cookies.put('hotelAddress', row.hotelAddress);

            $state.go("dashboard.restaurant-create");

        };

        $scope.getCites = function() {
            $http({
                method: 'GET',
                url: 'http://115.159.87.129:8008/cities',
                headers: {
                    //'Content-Type': 'application/json',
                    'x-auth-token': $scope.token
                },
                crossDomain: true
            }).success(function (cityArray) {
                setCities(cityArray);
            }).error(function () {
                console.log("getCites failed");
            });
        };

        function setCities(cityArray) {
            for (var i = 0; i < cityArray.length; i++) {
                $scope.cities.push(cityArray[i]);
            }
        };

        $scope.getHotelList();
        $scope.getCites();
    });
