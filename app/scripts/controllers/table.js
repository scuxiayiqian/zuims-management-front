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
    .controller('safeCtrl', function ($scope, $http) {

        var restaurantnames = [];
        var ispromoted = [];

        function getItem(id) {
            return {
                name: restaurantnames[id],
                isPromoted: ispromoted[id]
            }
        }

        function restaurantInfos(restaurantArr) {
            //console.log(restaurantArr);
            var log = [];
            angular.forEach(restaurantArr, function(value, key) {
                console.log(key + ': ' + value.name + ': ' + value.isPromoted);
                restaurantnames.push(value.name);
                ispromoted.push(value.isPromoted);
            }, log);
            //expect(log).toEqual(['name: misko', 'gender: male']);

            for (var id = 0; id < restaurantnames.length ; id++) {
                $scope.rowCollection.push(getItem(id));
            }
            $scope.displayedCollection = [].concat($scope.rowCollection);
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

        //remove to the real data holder
        $scope.removeItem = function removeItem(row) {
            var index = $scope.rowCollection.indexOf(row);
            if (index !== -1) {
                $scope.rowCollection.splice(index, 1);
                //$scope.displayedCollection = [].concat($scope.rowCollection);
            }
        }

        $scope.getRestaurantList = function() {
            // get restaurant list request
            console.log("#66");
            //alert("ha");

            var authHeader = {
                authorization : "Basic " + btoa("Admin" + ":" + "incongruous")
            };

            $http({
                method: 'GET',
                url: 'http://localhost:8080/token',
                headers: authHeader,
                crossDomain: true
            }).success(function(data) {
                //alert(data.token);
                console.log(data.token);
                $http({
                    method: 'GET',
                    url: 'http://localhost:8080/restaurants',
                    headers: {
                        //'Content-Type': 'application/json',
                        'x-auth-token': data.token
                    },
                    crossDomain: true
                }).success(function (restaurantArr) {
                    restaurantInfos(restaurantArr);
                }).error(function () {
                    alert("failed2");
                });
            }).error(function () {
                alert("failed1");
            });
        };

        $scope.rowCollection = [];
        $scope.getRestaurantList();

    });