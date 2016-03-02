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

        $scope.clickEnterToLogin = function () {
            console.log("click enter to login");
            $scope.login.logon();
        };

        $scope.login = {
            username: "",
            password: "",
            logon: function() {

                var req = {
                    method: 'GET',
                    url: 'http://202.120.40.175:21108/token',
                    headers: {
                        authorization : "Basic " + btoa($scope.login.username + ":" + $scope.login.password)
                    }
                };

                $http(req).then(function(response) {
                    $cookies.put('token', response.data.token);
                    $cookieStore.put('user', response.data.user);

                    $http.defaults.headers.common['x-auth-token'] = response.data.token;

                    $state.go("dashboard.reservation-quantity");
                }, function(response) {
                    alert('密码错误');
                    console.log(response.data.error);
                });
            }
        };

        $scope.logout = function() {

            var token = $cookies.get('token');

            if (token != null) {

                $http({
                    method: 'DELETE',
                    url: 'http://202.120.40.175:21108/token',
                    headers: {
                        'x-auth-token': token
                    },
                    crossDomain: true
                }).success(function() {
                    $cookies.remove('token');
                    $cookieStore.remove('user');

                    $http.defaults.headers.common = [];

                    $state.go("login");
                }).error(function() {
                    alert('logout failed');
                });
            }
        };
    });