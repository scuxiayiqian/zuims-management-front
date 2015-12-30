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
    .controller('accountCtrl', function ($rootScope, $scope, $http, $cookies, utilService) {

        // get token of current user
        utilService.getCurrentToken();

        $scope.rowCollection = [];
        $scope.roles = [];
        $scope.rolesOfAccount = [];

        //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
        $scope.displayedCollection = [].concat($scope.rowCollection);
        $scope.displayedRolesOfUser = [].concat($scope.rolesOfAccount);

        $scope.accountToDelete = {};
        $scope.accountToUpdate = {};
        $scope.accountoCreate = {
            name: '',
            password: '',
            roles: []
        };

        $scope.setAccountToDelete = function(row) {
            $scope.accountToDelete = row;
        }

        $scope.setAccountToCreate = function(row) {

            $scope.rolesOfAccount = [];
            $scope.accountToCreate = {
                name: '',
                password: '',
                roles: []
            };

            for (var i = 0; i < $scope.roles.length; i ++) {
                $scope.rolesOfAccount.push({
                    role: $scope.roles[i],
                    isGranted: false
                })
            }

            $scope.displayedRolesOfAccount = [].concat($scope.rolesOfAccount);
        }

        $scope.setAccountToUpdate = function(row) {
            $scope.accountToUpdate = row;

            $scope.rolesOfAccount = [];

            var flag = false;
            for (var i = 0; i < $scope.roles.length; i ++) {
                flag = false;
                for (var j = 0; j < row.roles.length; j++) {
                    if(row.roles[j].name == $scope.roles[i].name) {
                        flag = true;
                        break;
                    }
                }
                $scope.rolesOfAccount.push({
                    role: $scope.roles[i],
                    isGranted: flag
                })
            }

            $scope.displayedRolesOfAccount = [].concat($scope.rolesOfAccount);
        }
        //remove to the real data holder
        $scope.deleteAccount = function() {

            $http({
                method: 'DELETE',
                url: 'http://localhost:8080/users/' + $scope.accountToDelete.name,
                headers: {
                    'x-auth-token': $rootScope.token
                },
                crossDomain: true
            }).success(function(data) {
                var index = $scope.rowCollection.indexOf($scope.accountToDelete);
                if (index !== -1) {
                    $scope.rowCollection.splice(index, 1);
                }
            }).error(function () {
                console.log("account delete failed");
            });
        }

        $scope.updateAccount = function () {

            $scope.accountToUpdate.roles = [];

            for(var i = 0; i < $scope.rolesOfAccount.length; i++) {
                if($scope.rolesOfAccount[i].isGranted) {

                    console.log($scope.rolesOfAccount[i].role.name);
                    $scope.accountToUpdate.roles.push($scope.rolesOfAccount[i].role);
                }
            }

            $http({
                method: 'PUT',
                url: 'http://localhost:8080/users/' + $scope.accountToUpdate.name,
                headers: {
                    'x-auth-token': $rootScope.token
                },
                data: $scope.accountToUpdate,
                crossDomain: true
            }).success(function(data) {
                $scope.getAccountList();
                console.log("update account successed");
            }).error(function () {
                console.log("update account failed");
            });
        }

        $scope.createAccount = function () {

            $scope.accountToCreate.rights = [];

            for(var i = 0; i < $scope.rolesOfAccount.length; i++) {
                if($scope.rolesOfAccount[i].isGranted) {

                    console.log($scope.rolesOfAccount[i].role.name);
                    $scope.accountToCreate.roles.push($scope.rolesOfAccount[i].role);
                }
            }

            $http({
                method: 'POST',
                url: 'http://localhost:8080/users',
                headers: {
                    'x-auth-token': $rootScope.token
                },
                data: $scope.accountToCreate,
                crossDomain: true
            }).success(function(data) {
                console.log("role create successed");
                $scope.getAccountList()
            }).error(function () {
                console.log("role create failed");
            });
        }

        $scope.getAccountList = function() {
            // get role list request
            console.log($rootScope.token);
            $http({
                method: 'GET',
                url: 'http://localhost:8080/users',
                headers: {
                    //'Content-Type': 'application/json',
                    'x-auth-token': $rootScope.token
                },
                crossDomain: true
            }).success(function (roleArr) {
                console.log("getAccountList successed");
                $scope.rowCollection = roleArr;
                $scope.displayedCollection = $scope.rowCollection;
            }).error(function () {
                console.log("getAccountList failed");
            });
        };

        $scope.getRoles = function() {

            // get right list request
            console.log($rootScope.token);
            $http({
                method: 'GET',
                url: 'http://localhost:8080/roles',
                headers: {
                    //'Content-Type': 'application/json',
                    'x-auth-token': $rootScope.token
                },
                crossDomain: true
            }).success(function (roleArr) {
                console.log("getRoles successed");
                $scope.roles = roleArr;
            }).error(function () {
                console.log("getRoles failed");
            });

        }

        $scope.getAccountList();
        $scope.getRoles();
    });

