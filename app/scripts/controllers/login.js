'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('LoginController', function($rootScope, $scope, $http, $state, $cookies) {

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
                    $cookies.put('token', data.token);
                    console.log($cookies.get('toke'));

                    $rootScope.user = {
                        name: '',
                        roles: []
                    }

                    $rootScope.user.name = data.user.name;

                    for (var i = 0; i < data.user.roles.length; i++) {
                        $rootScope.user.roles.push(data.user.roles[i]);

                    }

                    $state.go("dashboard.home");
                }).error(function(data) {
                    //alert('failed');
                    alert(data.error);
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