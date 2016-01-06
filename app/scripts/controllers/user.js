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
    .controller('userCtrl', function ($scope, $http, $cookies) {

        $scope.token = $cookies.get('token');

        $scope.rowCollection = [];

        //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
        $scope.displayedCollection = [].concat($scope.rowCollection);

        $scope.userToDelete = {};
        $scope.userToUpdate = {};
        $scope.userToCreate = {};

        $scope.setUserToDelete = function(row) {
            $scope.userToDelete = row;
        };

        $scope.setUserToUpdate = function(row) {
            if(row == null) {
                $scope.userToUpdate = {
                    name: '',
                    password: '',
                    mobile: '',
                    gender: false
                }
            }
            else {
                $scope.userToUpdate = row;

            }

        };

        //remove to the real data holder
        $scope.deleteUser = function() {

            $http({
                method: 'DELETE',
                url: 'http://localhost:8080/guests/' + $scope.userToDelete.name,
                headers: {
                    'x-auth-token': $scope.token
                },
                crossDomain: true
            }).success(function(data) {
                var index = $scope.rowCollection.indexOf($scope.userToDelete);
                if (index !== -1) {
                    $scope.rowCollection.splice(index, 1);
                }
            }).error(function () {
                console.log("user delete failed");
            });
        }

        $scope.updateUser = function () {

            $http({
                method: 'PUT',
                url: 'http://202.120.40.175:21101/users/add',
                headers: {
                    'x-auth-token': $scope.token
                },
                data: $scope.userToCreate,
                crossDomain: true
            }).success(function(data) {
                $scope.getUserList();
                console.log("update user successed");
            }).error(function () {
                console.log("update user failed");
            });
        }

        $scope.createUser = function () {

            $scope.userToCreate.email = "";
            $scope.userToCreate.memo = "";
            $scope.userToCreate.city = "";
            $scope.userToCreate.marriage = "";
            $scope.userToCreate.birth = "";
            $scope.userToCreate.education = "";
            $scope.userToCreate.graduate = "";

            $scope.userToCreate.qq = "";
            $scope.userToCreate.wechat = "";
            $scope.userToCreate.tel = "";
            $scope.userToCreate.company = "";
            $scope.userToCreate.position = "";
            $scope.userToCreate.industry = "";
            $scope.userToCreate.income = "";
            $scope.userToCreate.prefer_cooking = "";
            $scope.userToCreate.prefer_price = "";
            $scope.userToCreate.prefer_restaurant = "";
            $scope.userToCreate.prefer_city = "";
            $scope.userToCreate.prefer_district = "";
            $scope.userToCreate.dinning_purpose = "";
            $scope.userToCreate.other_interests = "";

            console.log($scope.userToCreate);


            $http({
                method: 'POST',
                url: 'http://202.120.40.175:21101/users/add',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: $scope.userToCreate,
                crossDomain: true
            }).success(function(data) {
                console.log("user create successed");
                //$scope.getUserList();
            }).error(function (error) {
                console.log(error);
                console.log("user create failed");
            });
        }

        $scope.getUserList = function() {
            // get restaurant list request
            $http({
                method: 'GET',
                url: 'http://localhost:8080/guests',
                headers: {
                    //'Content-Type': 'application/json',
                    'x-auth-token': $scope.token
                },
                crossDomain: true
            }).success(function (userArr) {
                console.log("getUserList successed");
                $scope.rowCollection = userArr;
                $scope.displayedCollection = $scope.rowCollection;
            }).error(function () {
                console.log("getUserList failed");
            });
        };

        $scope.getUserList();
    });
