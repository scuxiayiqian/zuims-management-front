/**
 * Created by xiayiqian on 1/4/16.
 */

'use strict';

angular.module('sbAdminApp')
    .controller('CreateRestaurantController', function ($scope, $http, $cookies, $state) {

        $scope.basicInfo = {};
        $scope.basicInfo.hotelId = $cookies.get('hotelId');
        $scope.basicInfo.hotelName = $cookies.get('hotelName');
        $scope.basicInfo.longitude = $cookies.get('longitude');
        $scope.basicInfo.latitude = $cookies.get('latitude');

        console.log($scope.basicInfo);

        $scope.createRestaurant = function() {
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
    });