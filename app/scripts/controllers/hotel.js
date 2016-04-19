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
    .directive('convertToNumber', function() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel) {
                ngModel.$parsers.push(function(val) {
                    //saves integer to model null as null
                    return val == null ? null : parseInt(val, 10);
                });
                ngModel.$formatters.push(function(val) {
                    //return string for formatter and null as null
                    return val == null ? null : '' + val ;
                });
            }
        };
    })

    .controller('hotelCtrl', function ($scope, $http, $cookies, $state, API) {

        $scope.token = $cookies.get('token');
        $scope.cities = [];
        $scope.stars = ['四星','五星'];
        $scope.hotelToSearch = {};
        $scope.hotelToSearch.city = '上海市';
        $scope.cityToSearch = "上海市";
        $scope.starToSearch = 5;
        $scope.hotelToCreate = {};
        $scope.rowCollection = [];

        //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
        $scope.displayedCollection = [].concat($scope.rowCollection);

        $scope.setHotelToDelete = function(row) {
            $scope.hotelToDelete = row;
        };

        $scope.setHotelToCreate = function() {
            $scope.hotelToCreate.city = $scope.cityToSearch;
            $scope.hotelToCreate.star = "5";
        };

        $scope.setHotelToUpdate = function(row) {
            $scope.hotelToUpdate = row;

            $scope.hotelToUpdate.longitudeNLatitude = row.longitude + "," + row.latitude;
        };

        //remove to the real data holder
        $scope.deleteHotel = function() {

            $http({
                method: 'GET',
                url: API.MERCHANT + '/restaurant/hotel/delete?hotelId=' + $scope.hotelToDelete.hotelId,
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
        };

        $scope.updateHotel = function () {

            console.log($scope.hotelToUpdate);

            var geolocation = $scope.hotelToUpdate.longitudeNLatitude;
            var geolocationArr = geolocation.split(',');

            $scope.hotelToUpdate.longitude = geolocationArr[0];
            $scope.hotelToUpdate.latitude = geolocationArr[1];

            $http({
                method: 'POST',
                url: API.MERCHANT + '/restaurant/hotel/update',
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
        };

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
                url: API.MERCHANT + '/restaurant/hotel/add',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: $scope.hotelToCreate,
                crossDomain: true
            }).success(function(data) {
                console.log("hotel create successed");
                $scope.citySelected();
            }).error(function () {
                console.log("city create failed");
                alert("fail");
            });
        };

        $scope.getHotelList = function() {
            // get restaurant list request
            $http({
                method: 'GET',
                url: API.MERCHANT + '/restaurant/hotel/all',
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

            // $cookies.put('hotelId', row.hotelId);
            // $cookies.put('hotelName', row.hotelName);
            // $cookies.put('longitude', row.longitude);
            // $cookies.put('latitude', row.latitude);
            // $cookies.put('city', row.city);
            // $cookies.put('hotelAddress', row.hotelAddress);

            console.log(row);

            $cookies.put('hotelIdOfNewRestaurant', row.hotelId);
            $cookies.put('starOfNewRestaurant', row.latitude);
            $cookies.put('cityOfNewRestaurant', row.city);

            $state.go("dashboard.createNewRestaurant");

        };

        $scope.getCites = function() {
            $http({
                method: 'GET',
                url: API.OPERATION + '/cities',
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
        }

        $scope.citySelected = function() {
            $scope.notFoundHotel = true;

            if ($scope.starToSearch != 0) {
                $http({
                    method: 'GET',
                    url: API.DATA + '/restaurant/hotel/citystar',
                    params: {
                        city: $scope.cityToSearch,
                        star: $scope.starToSearch
                    },
                    crossDomain: true
                }).success(function(data) {
                    console.log(data);
                    $scope.rowCollection = data;
                    $scope.displayedCollection = $scope.rowCollection;
                }).error(function (error) {
                    alert("failed from cityselected function");
                });
            }
            else {
                $http({
                    method: 'GET',
                    url: API.DATA + '/restaurant/hotel/citystar',
                    params: {
                        city: $scope.cityToSearch
                    },
                    crossDomain: true
                }).success(function(data) {
                    console.log(data);
                    $scope.rowCollection = data;
                    $scope.displayedCollection = data;
                }).error(function (error) {
                    alert("failed from cityselected function");
                });
            }
        };

        $scope.getCites();
        $scope.citySelected();
    });
