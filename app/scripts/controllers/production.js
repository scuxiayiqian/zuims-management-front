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
    .controller('productionCtrl', function ($scope, $http, $cookies) {

        $scope.token = $cookies.get('token');

        $scope.rowCollection = [];

        //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
        $scope.displayedCollection = [].concat($scope.rowCollection);

        $scope.productionToDelete = {};
        $scope.productionToUpdate = {};

        $scope.setProductionToDelete = function(row) {
            $scope.productionToDelete = row;
        }

        $scope.setProductionToUpdate = function(row) {
            $scope.productionToUpdate = row;
        }

        //remove to the real data holder
        $scope.deleteProduction = function() {

            $http({
                method: 'DELETE',
                url: 'http://localhost:8080/productions/' + $scope.productionToDelete.id,
                headers: {
                    'x-auth-token': $scope.token
                },
                crossDomain: true
            }).success(function(data) {
                var index = $scope.rowCollection.indexOf($scope.productionToDelete);
                if (index !== -1) {
                    $scope.rowCollection.splice(index, 1);
                }
            }).error(function () {
                console.log("production delete failed");
            });
        }

        $scope.updateProduction = function () {

            $http({
                method: 'PUT',
                url: 'http://localhost:8080/productions/' + $scope.productionToUpdate.id,
                headers: {
                    'x-auth-token': $scope.token
                },
                data: $scope.productionToUpdate,
                crossDomain: true
            }).success(function(data) {
                $scope.getProductionList();
                console.log("update production successed");
            }).error(function () {
                console.log("update production failed");
            });
        }

        $scope.createProduction = function () {

            $http({
                method: 'POST',
                url: 'http://localhost:8080/productions',
                headers: {
                    'x-auth-token': $scope.token
                },
                data: $scope.productionToUpdate,
                crossDomain: true
            }).success(function(data) {
                console.log("production create successed");
                $scope.getProductionList()
            }).error(function () {
                console.log("production create failed");
            });
        }

        $scope.getProductionList = function() {
            // get restaurant list request
            $http({
                method: 'GET',
                url: 'http://localhost:8080/productions',
                headers: {
                    //'Content-Type': 'application/json',
                    'x-auth-token': $scope.token
                },
                crossDomain: true
            }).success(function (productionArr) {
                console.log("getProductionList successed");
                $scope.rowCollection = productionArr;
                $scope.displayedCollection = $scope.rowCollection;
            }).error(function () {
                console.log("getProductionList failed");
            });
        };

        $scope.getProductionList();
    });
