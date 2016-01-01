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
    .factory('right', ['$resource', function($resource) {
        return $resource(
            'http://localhost:8080/rights/:name',
            {
                name: '@name'
            },
            {
                'update': {method: 'PUT'}
            }
        );
    }])
    .controller('rightCtrl', function ($scope, $http, right, utilService) {

        utilService.getCurrentToken();

        $scope.rowCollection = [];

        //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
        $scope.displayedCollection = [].concat($scope.rowCollection);

        $scope.rightToDelete = {};
        $scope.rightToUpdate = {};

        $scope.setRightToDelete = function(row) {
            $scope.rightToDelete = row;
        };

        $scope.setRightToUpdate = function(row) {
            $scope.rightToUpdate = row;
        };

        //remove to the real data holder
        $scope.deleteRight = function() {

            right.delete(
                {
                    name: $scope.rightToDelete.name
                },
                function() {
                    $scope.getRightList();
                },
                function() {
                    console.log("right delete failed");
                }

            );
        };

        $scope.updateRight = function () {

            right.update(
                {
                    name: $scope.rightToUpdate.name
                },
                $scope.rightToUpdate,
                function() {
                    $scope.getRightList();
                },
                function() {
                    console.log("update right failed");
                }
            );
        };

        $scope.createRight = function () {

            right.save(
                $scope.rightToUpdate,
                function() {
                    $scope.getRightList();
                },
                function() {
                    console.log('right created failed');
                }
            )
        };

        $scope.getRightList = function() {

            right.query(
                function(users){
                    $scope.rowCollection = users;
                    $scope.displayedCollection = $scope.rowCollection;
            },  function(){
                    console.log('get rights failed using $resource');
            });
        };

        $scope.getRightList();
    });

