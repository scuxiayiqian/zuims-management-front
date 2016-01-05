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
    .controller('roleCtrl', function ($scope, $http, $cookies) {

        $scope.token = $cookies.get('token');

        $scope.rowCollection = [];
        $scope.rights = [];
        $scope.rightsOfRole = [];

        //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
        $scope.displayedCollection = [].concat($scope.rowCollection);
        $scope.displayedRightsOfRole = [].concat($scope.rightsOfRole);

        $scope.roleToDelete = {};
        $scope.roleToUpdate = {};
        $scope.roleToCreate = {name: '',
            rights: []
        };

        $scope.setRoleToDelete = function(row) {
            $scope.roleToDelete = row;
        }

        $scope.setRoleToCreate = function(row) {

            $scope.rightsOfRole = [];
            $scope.roleToCreate = {
                name: '',
                rights: []
            };

            for (var i = 0; i < $scope.rights.length; i ++) {
                $scope.rightsOfRole.push({
                    right: $scope.rights[i],
                    isGranted: false
                })
            }

            $scope.displayedRightsOfRole = [].concat($scope.rightsOfRole);
        }

        $scope.setRoleToUpdate = function(row) {
            $scope.roleToUpdate = row;

            $scope.rightsOfRole = [];

            var flag = false;
            for (var i = 0; i < $scope.rights.length; i ++) {
                flag = false;
                for (var j = 0; j < row.rights.length; j++) {
                    if(row.rights[j].name == $scope.rights[i].name) {
                        flag = true;
                        break;
                    }
                }
                $scope.rightsOfRole.push({
                    right: $scope.rights[i],
                    isGranted: flag
                })
            }

            $scope.displayedRightsOfRole = [].concat($scope.rightsOfRole);
        }
        //remove to the real data holder
        $scope.deleteRole = function() {

            $http({
                method: 'DELETE',
                url: 'http://localhost:8080/roles/' + $scope.roleToDelete.name,
                headers: {
                    'x-auth-token': $scope.token
                },
                crossDomain: true
            }).success(function(data) {
                var index = $scope.rowCollection.indexOf($scope.roleToDelete);
                if (index !== -1) {
                    $scope.rowCollection.splice(index, 1);
                }
            }).error(function () {
                console.log("role delete failed");
            });
        }

        $scope.updateRole = function () {

            $scope.roleToUpdate.rights = [];

            for(var i = 0; i < $scope.rightsOfRole.length; i++) {
                if($scope.rightsOfRole[i].isGranted) {

                    console.log($scope.rightsOfRole[i].right.name);
                    $scope.roleToUpdate.rights.push($scope.rightsOfRole[i].right);
                }
            }

            $http({
                method: 'PUT',
                url: 'http://localhost:8080/roles/' + $scope.roleToUpdate.name,
                headers: {
                    'x-auth-token': $scope.token
                },
                data: $scope.roleToUpdate,
                crossDomain: true
            }).success(function(data) {
                $scope.getRoleList();
                console.log("update role successed");
            }).error(function () {
                console.log("update role failed");
            });
        }

        $scope.createRole = function () {

            $scope.roleToCreate.rights = [];

            for(var i = 0; i < $scope.rightsOfRole.length; i++) {
                if($scope.rightsOfRole[i].isGranted) {

                    console.log($scope.rightsOfRole[i].right.name);
                    $scope.roleToCreate.rights.push($scope.rightsOfRole[i].right);
                }
            }

            $http({
                method: 'POST',
                url: 'http://localhost:8080/roles/' + $scope.roleToCreate.name,
                headers: {
                    'x-auth-token': $scope.token
                },
                data: $scope.roleToCreate,
                crossDomain: true
            }).success(function(data) {
                console.log("role create successed");
                $scope.getRoleList()
            }).error(function () {
                console.log("role create failed");
            });
        }

        $scope.getRoleList = function() {
            // get role list request
            $http({
                method: 'GET',
                url: 'http://localhost:8080/roles',
                headers: {
                    //'Content-Type': 'application/json',
                    'x-auth-token': $scope.token
                },
                crossDomain: true
            }).success(function (roleArr) {
                console.log("getRoleList successed");
                $scope.rowCollection = roleArr;
                $scope.displayedCollection = $scope.rowCollection;
            }).error(function () {
                console.log("getRoleList failed");
            });
        };

        $scope.getRights = function() {

            // get right list request
            $http({
                method: 'GET',
                url: 'http://localhost:8080/rights',
                headers: {
                    //'Content-Type': 'application/json',
                    'x-auth-token': $scope.token
                },
                crossDomain: true
            }).success(function (rightArr) {
                console.log("getRights successed");
                $scope.rights = rightArr;

            }).error(function () {
                console.log("getRights failed");
            });

        }

        $scope.getRoleList();
        $scope.getRights();
    });

