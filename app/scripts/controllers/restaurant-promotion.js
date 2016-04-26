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
    .controller('restaurantPromotionCtrl', function ($scope, $http, $cookies, API) {

        $scope.token = $cookies.get('token');

        $scope.cities = [];
        $scope.users = [];

        $scope.selectedCity = "";

        $scope.rowCollection = [];

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

        $scope.setRestaurantToDelete = function(row) {
            $scope.restaurantToDelete = row;
        };

        $scope.setRestaurantToUpdate = function(row) {
            $scope.restaurantToUpdate = row;
        };

        $scope.updatePromotedRestaurant = function() {
            var promotedRestaurant = [];
            var url = API.DATA + '/restaurant/update';

            for (var i = 0; i < $scope.rowCollection.length; i++) {

                promotedRestaurant.push($scope.rowCollection[i]);
                console.log($scope.rowCollection[i].recommendLevel);

                $http({
                    method: 'POST',
                    url: url,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: $scope.rowCollection[i],
                    crossDomain: true
                }).success(function() {
                    console.log("success" + i);
                }).error(function () {
                });

            }

            alert("更新成功");
        };

        $scope.getRestaurantList = function() {
            // get restaurant list request
            var url = API.OPERATION + '/cities/' + $scope.selectedCity + '/restaurants';

            $http({
                method: 'GET',
                url: url,
                headers: {
                    //'Content-Type': 'application/json',
                    'x-auth-token': $scope.token
                },
                crossDomain: true
            }).success(function (restaurantArr) {
                $scope.rowCollection = restaurantArr;
                $scope.displayedCollection = $scope.rowCollection;
            }).error(function () {
                console.log("getRestaurantList failed");
            });
        };

        $scope.getCites = function() {

            var url = API.OPERATION + '/cities';
            $http({
                method: 'GET',
                url: url,
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

        $scope.getUsers = function() {

            var url = API.OPERATION + '/roles/marketing/users';
            $http({
                method: 'GET',
                url: url,
                headers: {
                    //'Content-Type': 'application/json',
                    'x-auth-token': $scope.token
                },
                crossDomain: true
            }).success(function (cityArray) {
                setUsers(cityArray);
            }).error(function () {
                console.log("getCites failed");
            });
        };

        $scope.changeCity = function() {

            if ($scope.selectedCity != 'Choose a city') {
                $scope.getRestaurantList()
            }
        };

        $scope.searchBtnClicked = function() {
            //console.log($scope.restaurantToSearch.city + $scope.restaurantToSearch.name);
            var url = API.DATA + '/restaurant/search/hotelnamecity';

            $http({
                method: 'GET',
                url: url,
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

        $scope.getCites();
        $scope.getUsers();
    });