'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('LoginController', function($scope, $http, $state, $cookies, $cookieStore) {

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
                    $cookies.put('token', data.token);
                    $cookieStore.put('user', data.user);

                    $state.go("dashboard.home");
                }).error(function(data) {
                    //alert('failed');
                    alert(data.error);
                });
            }
        };

        $scope.logout = function() {

            var token = $cookies.get('token');

            if (token != null) {

                $http({
                    method: 'DELETE',
                    url: 'http://localhost:8080/token',
                    headers: {
                        'x-auth-token': token
                    },
                    crossDomain: true
                }).success(function() {
                    $cookies.remove('token');
                    $cookieStore.remove('user');

                    $state.go("login");
                }).error(function() {
                    alert('logout failed');
                });
            }
        }
    });