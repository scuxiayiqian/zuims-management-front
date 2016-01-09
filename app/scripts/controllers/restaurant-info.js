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
    .controller('restaurantInfoCtrl', function ($scope, $http, $cookies, $state) {

        $scope.token = $cookies.get('token');

        $scope.cities = [];
        $scope.users = [];
        $scope.productions = [];

        $scope.productionsOfRestaurant = [];

        $scope.selectedCity = "";

        $scope.rowCollection = [];

        $scope.restaurantToSearch = {};

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

        $scope.setRestaurantToUpdate = function(row) {
            $scope.restaurantToUpdate = row;

            $scope.productionsOfRestaurant = [];

            var flag = false;
            for (var i = 0; i < $scope.productions.length; i ++) {
                flag = false;
                for (var j = 0; j < row.productions.length; j++) {
                    if(row.productions[j].name == $scope.productions[i].name) {
                        flag = true;
                        break;
                    }
                }
                $scope.productionsOfRestaurant.push({
                    production: $scope.productions[i],
                    isProvided: flag
                })
            }

            $scope.displayedProductionsOfRestaurant = [].concat($scope.productionsOfRestaurant);
        };

        $scope.setRestaurantToCreate = function() {

            $scope.restaurantToCreate = {
                name: '',
                city: '',
                marketingName: '',
                productions:[],
                isPromoted: false
            }

            for (var i = 0; i < $scope.productions.length; i ++) {
                $scope.productionsOfRestaurant.push({
                    production: $scope.productions[i],
                    isProvided: false
                })
            }

            $scope.displayedProductionsOfRestaurant = [].concat($scope.productionsOfRestaurant);
        };
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
        };

        $scope.updateRestaurant = function () {

            $scope.restaurantToUpdate.productions = [];

            for(var i = 0; i < $scope.productionsOfRestaurant.length; i++) {
                if($scope.productionsOfRestaurant[i].isProvided) {

                    $scope.restaurantToUpdate.productions.push($scope.productionsOfRestaurant[i].production);
                }
            }

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
        };

        $scope.createRestaurant = function () {

            $scope.restaurantToCreate.productions = [];

            $scope.selectedCity = $scope.restaurantToCreate.city;

            for(var i = 0; i < $scope.productionsOfRestaurant.length; i++) {
                if($scope.productionsOfRestaurant[i].isProvided) {

                    $scope.restaurantToCreate.productions.push($scope.productionsOfRestaurant[i].production);
                }
            }

            $http({
                method: 'POST',
                url: 'http://localhost:8080/restaurants',
                headers: {
                    'x-auth-token': $scope.token
                },
                data: $scope.restaurantToCreate,
                crossDomain: true
            }).success(function(data) {
                $scope.getRestaurantList()
            }).error(function () {
                alert("delete failed");
            });
        };

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
        };

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
        };

        $scope.getProductions = function() {
            $http({
                method: 'GET',
                url: 'http://localhost:8080/productions',
                headers: {
                    //'Content-Type': 'application/json',
                    'x-auth-token': $scope.token
                },
                crossDomain: true
            }).success(function (productionArray) {
                $scope.productions = productionArray;
            }).error(function () {
                console.log("getProductions failed");
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

        $scope.editRestaurant = function(restaurant) {
            console.log(restaurant.restaurantId);
            $cookies.put('restID', restaurant.restaurantId);

            $state.go("dashboard.restaurant-detail");
        };

        $scope.createRestaurant = function() {
            $state.go("dashboard.restaurant-create");
        };

        $scope.getCites();
        $scope.getUsers();
        $scope.getProductions();
    });