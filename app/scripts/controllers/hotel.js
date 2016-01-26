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

        $scope.setCityToDelete = function(row) {
            $scope.cityToDelete = row;
        }

        $scope.setCityToUpdate = function(row) {
            $scope.cityToUpdate = row;
        }

        //remove to the real data holder
        $scope.deleteCity = function() {

            $http({
                method: 'DELETE',
                url: 'http://202.120.40.175:21108/cities/' + $scope.cityToDelete.name,
                headers: {
                    'x-auth-token': $scope.token
                },
                crossDomain: true
            }).success(function(data) {
                var index = $scope.rowCollection.indexOf($scope.cityToDelete);
                if (index !== -1) {
                    $scope.rowCollection.splice(index, 1);
                }
            }).error(function () {
                console.log("city delete failed");
            });
        }

        $scope.updateCity = function () {

            $http({
                method: 'PUT',
                url: 'http://202.120.40.175:21108/cities/' + $scope.cityToUpdate.name,
                headers: {
                    'x-auth-token': $scope.token
                },
                data: $scope.cityToUpdate,
                crossDomain: true
            }).success(function(data) {
                $scope.getCityList();
                console.log("update city successed");
            }).error(function () {
                console.log("update city failed");
            });
        }

        $scope.createHotel = function () {

            console.log($scope.hotelToCreate);

            $scope.hotelToCreate.contractStat = parseInt( $scope.hotelToCreate.contractStat );
            $scope.hotelToCreate.memo = "";
            $http({
                method: 'POST',
                url: 'http://202.120.40.175:21104/restaurant/hotel/add',
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
                url: 'http://202.120.40.175:21104/restaurant/hotel/all',
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
            $state.go("dashboard.restaurant-create");

        };

        $scope.getCites = function() {
            $http({
                method: 'GET',
                url: 'http://202.120.40.175:21108/cities',
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
