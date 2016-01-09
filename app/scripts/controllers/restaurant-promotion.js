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
    .controller('restaurantPromotionCtrl', function ($scope, $http, $cookies) {

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
        }

        $scope.setRestaurantToUpdate = function(row) {
            $scope.restaurantToUpdate = row;
        }

        $scope.updatePromotedRestaurant = function() {
            var promotedRestaurant = [];

            for (var i = 0; i < $scope.rowCollection.length; i++) {

                promotedRestaurant.push($scope.rowCollection[i]);
                console.log($scope.rowCollection[i].recommendLevel);

                $http({
                    method: 'POST',
                    url: 'http://202.120.40.175:21104/restaurant/update',
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
        }

        $scope.getRestaurantList = function() {
            // get restaurant list request
            $http({
                method: 'GET',
                url: 'http://localhost:8080/cities/' + $scope.selectedCity + '/restaurants',
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
            $http({
                method: 'GET',
                url: 'http://localhost:8080/cities',
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
        }

        $scope.getUsers = function() {
            $http({
                method: 'GET',
                url: 'http://localhost:8080/roles/marketing/users',
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
        }

        $scope.changeCity = function() {

            if ($scope.selectedCity != 'Choose a city') {
                $scope.getRestaurantList()
            }
        };

        $scope.searchBtnClicked = function() {
            //console.log($scope.restaurantToSearch.city + $scope.restaurantToSearch.name);
            $http({
                method: 'GET',
                url: 'http://202.120.40.175:21104/restaurant/search/namecity',
                params: {
                    restaurantName: $scope.restaurantToSearch.name,
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