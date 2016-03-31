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
    .controller('restaurantInfoCtrl', function ($scope, $http, $cookies, $state, API) {

        $scope.token = $cookies.get('token');

        $scope.cities = [];

        $scope.selectedCity = "";

        $scope.rowCollection = [];

        $scope.restaurantToSearch = {};

        // 城市默认选择上海
        $scope.restaurantToSearch.city = '上海市';

        function setCities(cityArray) {
            for (var i = 0; i < cityArray.length; i++) {
                $scope.cities.push(cityArray[i]);
            }
        }

        function setUsers(userArray) {
            for (var i = 0; i < userArray.length; i++) {
                $scope.users.push(userArray[i]);
            }
        }

        //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
        $scope.displayedCollection = [].concat($scope.rowCollection);

        $scope.restaurantToDelete = {};
        $scope.restaurantToUpdate = {};
        $scope.restaurantToCreate = {};

        $scope.setRestaurantToDelete = function(row) {
            $scope.restaurantToDelete = row;
        };

        //remove to the real data holder
        $scope.deleteRestaurant = function() {


            $http({
                method: 'GET',
                url: API.MERCHANT + '/restaurant/delete?restaurantId=' + $scope.restaurantToDelete.restaurantId,
                headers: {
                    'Content-Type': 'application/json'
                },
                crossDomain: true
            }).success(function(data) {
                alert("删除成功");
                var index = $scope.displayedCollection.indexOf($scope.restaurantToDelete);
                console.log(index);
                console.log($scope.displayedCollection);
                if (index !== -1) {
                    $scope.displayedCollection.splice(index, 1);
                    console.log($scope.displayedCollection);
                }
                console.log($scope.displayedCollection);
            }).error(function () {
                console.log("hotel delete failed");
            });
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

        $scope.changeCity = function() {

            if($scope.selectedCity != 'Choose a city') {
                $scope.getRestaurantList()
            }
        };

        $scope.searchBtnClicked = function() {
            //console.log($scope.restaurantToSearch.city + $scope.restaurantToSearch.name);
            $http({
                method: 'GET',
                url: API.MERCHANT + '/restaurant/search/hotelnamecity',
                params: {
                    hotelName: $scope.restaurantToSearch.hotelName,
                    city: $scope.restaurantToSearch.city
                },
                crossDomain: true
            }).success(function(data) {
                console.log(data);
                $scope.rowCollection = data;
                $scope.displayedCollection = data;
            }).error(function () {
                console.log("user delete failed");
            });
        };

        $scope.editRestaurant = function(restaurant) {
            console.log(restaurant.restaurantId);
            $cookies.put('restID', restaurant.restaurantId);

            $state.go("dashboard.restaurant-detail");
        };

        $scope.createRestaurant = function() {
            $state.go("dashboard.restaurant-create");
        };

        $scope.citySelected = function() {

            $scope.restaurantToSearch.hotelName = '';

            $http({
                method: 'GET',
                url: API.MERCHANT + '/restaurant/search/hotelnamecity',
                params: {
                    hotelName: "",
                    city: $scope.restaurantToSearch.city
                },
                crossDomain: true
            }).success(function(data) {
                console.log(data);
                $scope.rowCollection = data;
                $scope.displayedCollection = data;
            }).error(function () {
                console.log("user delete failed");
            });

            console.log($scope.rowCollection);
        };

        $scope.getCites();
        $scope.citySelected();
    });