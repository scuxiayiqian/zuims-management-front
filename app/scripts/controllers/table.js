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
    .controller('safeCtrl', function ($rootScope, $scope, $http) {

        $scope.cities = [];
        $scope.selectedCity = "";

        $scope.rowCollection = [];

        function setCities(cityArray) {
            for (var i = 0; i < cityArray.length; i++) {
                $scope.cities.push(cityArray[i]);
            }
        }

        //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
        $scope.displayedCollection = [].concat($scope.rowCollection);

        //add to the real data holder
        $scope.addRandomItem = function addRandomItem() {
            $scope.rowCollection.push(getItem(id));
            id++;

            //$scope.getRestaurantList();
            console.log("#51");
        };

        $scope.restaurantToDelete = {};

        $scope.setRestaurantToDelete = function(row) {
            $scope.restaurantToDelete = row;
        }

        //remove to the real data holder
        $scope.deleteRestaurant = function() {

            alert($rootScope.token);

            $http({
                method: 'DELETE',
                url: 'http://localhost:8080/restaurants/' + $scope.restaurantToDelete.name,
                headers: {
                    'x-auth-token': $rootScope.token
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

        $scope.updatePromotedRestaurantsByCity = function() {
            var promotedRestaurant = [];

            console.log($scope.rowCollection.length);

            for (var i = 0; i < $scope.rowCollection.length; i++) {

                if ($scope.rowCollection[i].isPromoted) {

                    promotedRestaurant.push($scope.rowCollection[i]);
                }
            }

            $http({
                method: 'PUT',
                url: 'http://localhost:8080/cities/' + $scope.selectedCity.name + '/restaurants/promoted',
                headers: {
                    'x-auth-token': $rootScope.token
                },
                data: promotedRestaurant,
                crossDomain: true
            }).success(function() {

                alert("updated");
            }).error(function () {
                alert("update failed");
            });
        }

        $scope.getRestaurantList = function() {
            // get restaurant list request
            console.log($rootScope.token);
            $http({
                method: 'GET',
                url: 'http://localhost:8080/cities/' + $scope.selectedCity.name + '/restaurants',
                headers: {
                    //'Content-Type': 'application/json',
                    'x-auth-token': $rootScope.token
                },
                crossDomain: true
            }).success(function (restaurantArr) {
                $scope.rowCollection = restaurantArr;
                $scope.displayedCollection = $scope.rowCollection;
            }).error(function () {
                alert("failed2");
            });
        };

        $scope.getCites = function() {
            $http({
                method: 'GET',
                url: 'http://localhost:8080/cities',
                headers: {
                    //'Content-Type': 'application/json',
                    'x-auth-token': $rootScope.token
                },
                crossDomain: true
            }).success(function (cityArray) {
                setCities(cityArray);
            }).error(function () {
                alert("failed2");
            });
        }

        $scope.changeCity = function() {

            if($scope.selectedCity != 'Choose a city') {
                $scope.getRestaurantList()
            }
        }

        $scope.checked = function(row) {
            //alert($scope.rowCollection[$scope.displayedCollection.indexOf(row)].isPromoted);
        }

        $scope.getCites();
    });