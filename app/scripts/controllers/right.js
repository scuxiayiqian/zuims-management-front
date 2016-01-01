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
    .controller('rightCtrl', function ($scope, $http, utilService) {

        $scope.token = utilService.getCurrentToken();

        $scope.rowCollection = [];

        //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
        $scope.displayedCollection = [].concat($scope.rowCollection);

        $scope.rightToDelete = {};
        $scope.rightToUpdate = {};

        $scope.setRightToDelete = function(row) {
            $scope.rightToDelete = row;
        }

        $scope.setRightToUpdate = function(row) {
            $scope.rightToUpdate = row;
        }

        //remove to the real data holder
        $scope.deleteRight = function() {

            $http({
                method: 'DELETE',
                url: 'http://localhost:8080/rights/' + $scope.rightToDelete.name
            }).success(function(data) {
                var index = $scope.rowCollection.indexOf($scope.rightToDelete);
                if (index !== -1) {
                    $scope.rowCollection.splice(index, 1);
                }
            }).error(function () {
                console.log("right delete failed");
            });
        }

        $scope.updateRight = function () {

            $http({
                method: 'PUT',
                url: 'http://localhost:8080/rights/' + $scope.rightToUpdate.name,
                data: $scope.rightToUpdate
            }).success(function(data) {
                $scope.getRightList();
                console.log("update right successed");
            }).error(function () {
                console.log("update right failed");
            });
        }

        $scope.createRight = function () {

            $http({
                method: 'POST',
                url: 'http://localhost:8080/rights',
                data: $scope.rightToUpdate
            }).success(function(data) {
                console.log("right create successed");
                $scope.getRightList()
            }).error(function () {
                console.log("right create failed");
            });
        }

        $scope.getRightList = function() {
            // get restaurant list request
            $http({
                method: 'GET',
                url: 'http://localhost:8080/rights'
            }).success(function (rightArr) {
                console.log("getRightList successed");
                $scope.rowCollection = rightArr;
                $scope.displayedCollection = $scope.rowCollection;
            }).error(function () {
                console.log("getRightList failed");
            });
        };

        $scope.getRightList();
    });

