/**
 * Created by xiayiqian on 1/4/16.
 */

'use strict';

angular.module('sbAdminApp')
    .controller('CreateRestaurantController', function ($scope, $http, $cookies, $state) {

        $scope.token = $cookies.get('token');
        $scope.marketingUsers = [];
        $scope.basicInfo = {};
        $scope.basicInfo.restaurantType = "";
        $scope.basicInfo.city = "";
        $scope.basicInfo.hotelId = $cookies.get('hotelId');
        $scope.basicInfo.hotelName = $cookies.get('hotelName');
        $scope.basicInfo.longitude = $cookies.get('longitude');
        $scope.basicInfo.latitude = $cookies.get('latitude');
        $scope.basicInfo.longitudeNLatitude = $scope.basicInfo.longitude + "," + $scope.basicInfo.latitude;

        console.log($scope.basicInfo);

        $scope.getProductions = function() {
            $http({
                method: 'GET',
                url: 'http://202.120.40.175:21108/productions',
                headers: {
                    'x-auth-token': $scope.token
                },
                crossDomain: true
            }).success(function (productionArr) {
                $scope.productions = productionArr;
            }).error(function () {
                console.log("getProductionList failed");
            });
        };

        $scope.getCities = function() {
            $http({
                method: 'GET',
                url: 'http://202.120.40.175:21108/cities',
                headers: {
                    'x-auth-token': $scope.token
                },
                crossDomain: true
            }).success(function (cityArray) {
                $scope.cities = cityArray;
            }).error(function () {
                console.log("getCites failed");
            });
        };
        $scope.createRestaurant = function() {
            console.log($scope.basicInfo);

            var geolocation = $scope.basicInfo.longitudeNLatitude;
            var geolocationArr = geolocation.split(',');

            $scope.basicInfo.longitude = geolocationArr[0];
            $scope.basicInfo.latitude = geolocationArr[1];

            $http({
                method: 'POST',
                url: 'http://202.120.40.175:21104/restaurant/add',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: $scope.basicInfo,
                crossDomain: true
            }).success(function(data) {
                alert("创建餐厅成功");

                $cookies.remove('hotelId');
                $cookies.remove('hotelName');
                $cookies.remove('longitude');
                $cookies.remove('latitude');

                $state.go("dashboard.restaurant-info");
            }).error(function (error) {

                alert(error.message);
                $cookies.remove('hotelId');
                $cookies.remove('hotelName');
                $cookies.remove('longitude');
                $cookies.remove('latitude');

                $state.go("dashboard.hotel");
            });
        };

        $scope.getMarketingUsers = function() {
            $http({
                method: 'GET',
                url: 'http://202.120.40.175:21108/roles/marketing/users',
                headers: {
                    'x-auth-token': $scope.token
                },
                crossDomain: true
            }).success(function(data) {
                for (var i = 0; i < data.length; i++) {
                    $scope.marketingUsers.push(data[i]);
                }
            }).error(function (error) {

                alert(error.message);
                $cookies.remove('hotelId');
                $cookies.remove('hotelName');
                $cookies.remove('longitude');
                $cookies.remove('latitude');

                $state.go("dashboard.hotel");
            });
        }

        $scope.getMarketingUsers();
        $scope.getCities();
        $scope.getProductions();
    });