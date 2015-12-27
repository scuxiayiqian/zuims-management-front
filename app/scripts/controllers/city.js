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
    .controller('cityCtrl', function ($rootScope, $scope, $http) {

        $scope.rowCollection = [];

        //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
        $scope.displayedCollection = [].concat($scope.rowCollection);

        $scope.cityToDelete = {};
        $scope.cityToUpdate = {};

        $scope.setCityToDelete = function(row) {
            $scope.cityToDelete = row;
        }

        $scope.setCityToUpdate = function(row) {
            $scope.cityToUpdate = row;
        }

        //remove to the real data holder
        $scope.deleteCity = function() {

            $http({
                method: 'DELETE',
                url: 'http://localhost:8080/cities/' + $scope.cityToDelete.name,
                headers: {
                    'x-auth-token': $rootScope.token
                },
                crossDomain: true
            }).success(function(data) {
                var index = $scope.rowCollection.indexOf($scope.cityToDelete);
                if (index !== -1) {
                    $scope.rowCollection.splice(index, 1);
                }
            }).error(function () {
                console.log("city delete failed");
            });
        }

        $scope.updateCity = function () {

            $http({
                method: 'PUT',
                url: 'http://localhost:8080/cities/' + $scope.cityToUpdate.name,
                headers: {
                    'x-auth-token': $rootScope.token
                },
                data: $scope.cityToUpdate,
                crossDomain: true
            }).success(function(data) {
                $scope.getCityList();
                console.log("update city successed");
            }).error(function () {
                console.log("update city failed");
            });
        }

        $scope.createCity = function () {

            $http({
                method: 'POST',
                url: 'http://localhost:8080/cities',
                headers: {
                    'x-auth-token': $rootScope.token
                },
                data: $scope.cityToUpdate,
                crossDomain: true
            }).success(function(data) {
                console.log("city create successed");
                $scope.getCityList()
            }).error(function () {
                console.log("city create failed");
            });
        }

        $scope.getCityList = function() {
            // get restaurant list request
            console.log($rootScope.token);
            $http({
                method: 'GET',
                url: 'http://localhost:8080/cities',
                headers: {
                    //'Content-Type': 'application/json',
                    'x-auth-token': $rootScope.token
                },
                crossDomain: true
            }).success(function (cityArr) {
                console.log("getCityList successed");
                $scope.rowCollection = cityArr;
                $scope.displayedCollection = $scope.rowCollection;
            }).error(function () {
                console.log("getCityList failed");
            });
        };

        $scope.getCityList();
    });
