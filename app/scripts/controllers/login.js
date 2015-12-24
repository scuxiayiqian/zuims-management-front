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