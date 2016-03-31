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
    .controller('userCtrl', function ($scope, $http, $cookies, API) {

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
                console.log("laaa");
            }

        };

        //remove to the real data holder
        $scope.deleteUser = function(phoneid) {

            console.log(phoneid);
            $http({
                method: 'GET',
                url: API.USER + '/users/delete',
                params: {phoneId: phoneid},
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
                method: 'POST',
                url: API.USER + '/users/update',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: $scope.userToUpdate,
                crossDomain: true
            }).success(function(data) {
                console.log("user update successed");
                $scope.getUserList();
            }).error(function (error) {
                console.log(error);
                console.log("user update failed");
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
                url: API.USER + '/users/add',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: $scope.userToCreate,
                crossDomain: true
            }).success(function(data) {
                console.log("user create successed");
                $scope.getUserList();
            }).error(function (error) {
                console.log(error);
                console.log("user create failed");
            });
        }

        $scope.getUserList = function() {
            // get restaurant list request
            $http({
                method: 'GET',
                url: API.USER + '/users/all',
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
