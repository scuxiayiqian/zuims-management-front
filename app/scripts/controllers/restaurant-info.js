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
    .controller('restaurantInfoCtrl', function ($scope, $http, $cookies) {

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

        //remove to the real data holder
        $scope.deleteRestaurant = function() {

            $http({
                method: 'DELETE',
                url: 'http://localhost:8080/restaurants/' + $scope.restaurantToDelete.name,
                headers: {
                    'x-auth-token': $scope.token
                },
                crossDomain: true
            }).success(function(data) {
                alert(data.name + "deleted");
                var index = $scope.rowCollection.indexOf($scope.restaurantToDelete);
                if (index !== -1) {
                    $scope.rowCollection.splice(index, 1);
                }
            }).error(function () {
                alert("delete failed");
            });
        }

        $scope.updateRestaurant = function () {

            $http({
                method: 'PUT',
                url: 'http://localhost:8080/restaurants/' + $scope.restaurantToUpdate.name,
                headers: {
                    'x-auth-token': $scope.token
                },
                data: $scope.restaurantToUpdate,
                crossDomain: true
            }).success(function(data) {
                $scope.getRestaurantList();
                alert("success");
            }).error(function () {
                alert("delete failed");
            });
        }

        $scope.createRestaurant = function () {

            $http({
                method: 'POST',
                url: 'http://localhost:8080/restaurants',
                headers: {
                    'x-auth-token': $scope.token
                },
                data: $scope.restaurantToUpdate,
                crossDomain: true
            }).success(function(data) {
                $scope.getRestaurantList()
            }).error(function () {
                alert("delete failed");
            });
        }

        $scope.updatePromotedRestaurantsByCity = function() {
            var promotedRestaurant = [];


            for (var i = 0; i < $scope.rowCollection.length; i++) {

                if ($scope.rowCollection[i].isPromoted) {

                    promotedRestaurant.push($scope.rowCollection[i]);
                }
            }

            $http({
                method: 'PUT',
                url: 'http://localhost:8080/cities/' + $scope.selectedCity + '/restaurants/promoted',
                headers: {
                    'x-auth-token': $scope.token
                },
                data: promotedRestaurant,
                crossDomain: true
            }).success(function() {
                alert("success");
            }).error(function () {
            });
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

            if($scope.selectedCity != 'Choose a city') {
                $scope.getRestaurantList()
            }
        }

        $scope.getCites();
        $scope.getUsers();
    });