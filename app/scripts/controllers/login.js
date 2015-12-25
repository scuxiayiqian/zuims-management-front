'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('LoginController', function($rootScope, $scope, $http, $state) {

        $rootScope.isVisible = function(item) {

            console.log(item);

            var flag = false;

            switch(item) {
                case 'userManagement':
                    for(var i = 0; i< $scope.user.roles.length; i++){

                        console.log($scope.user.roles[i]);
                        if($scope.user.roles[i] == 'manager') {
                            flag = true;
                        }
                    }
                    return flag;
                case 'restaurantManagement':
                    for(var i = 0; i< $scope.user.roles.length; i++){

                        console.log($scope.user.roles[i]);
                        if($scope.user.roles[i] == 'manager' || $scope.user.roles[i] == 'marketing') {
                            flag = true;
                        }
                    }

                    return flag;
                case 'restaurantPromotion':
                    for(var i = 0; i< $scope.user.roles.length; i++) {

                        console.log($scope.user.roles[i]);
                        if ($scope.user.roles[i] == 'manager') {
                            flag = true;
                        }
                    }

                    return flag;
                case 'systemManagement':
                    for(var i = 0; i< $scope.user.roles.length; i++) {

                        console.log($scope.user.roles[i]);
                        if ($scope.user.roles[i] == 'admin') {
                            flag = true;
                        }
                    }

                    return flag;
                default:
                    return flag;
            }
        }

        $scope.login = {
            username: "",
            password: "",
            logon: function() {
                var headers = {
                    authorization : "Basic " + btoa($scope.login.username + ":" + $scope.login.password)
                };

                $http({
                    method: 'GET',
                    url: 'http://localhost:8080/token',
                    headers: headers
                }).success(function(data) {
                    $rootScope.token = data.token;

                    $rootScope.user = {
                        name: '',
                        roles: []
                    }

                    $rootScope.user.name = data.user.name;

                    for (var i = 0; i < data.user.roles.length; i++) {
                        console.log(data.user.roles[i].name);
                        $rootScope.user.roles.push(data.user.roles[i].name);
                    }

                    $state.go("dashboard.home");
                }).error(function() {
                    alert('failed');
                });
            }
        };

        $scope.logout = function() {
            if ($rootScope.token != null) {

                alert($rootScope.token);

                $http({
                    method: 'DELETE',
                    url: 'http://localhost:8080/token',
                    headers: {
                        'x-auth-token': $rootScope.token
                    },
                    crossDomain: true
                }).success(function() {
                    $rootScope.token = null;
                    $state.go("login");
                }).error(function() {
                    alert('logout failed');
                });

            }
        }
    });