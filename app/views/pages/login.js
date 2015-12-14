'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('LoginController', function($scope, $http, $state) {

        $scope.login = {
            username: "",
            password: "",
            logon: function() {
                alert($scope.login.username + ":" + $scope.login.password);

                var headers = {
                    authorization : "Basic " + btoa($scope.login.username + ":" + $scope.login.password)
                };

                $http({
                    method: 'GET',
                    url: 'http://localhost:8080/token',
                    headers: headers,
                    crossDomain: true
                }).success(function(data) {
                    alert(data.token);
                    $state.go("dashboard.home");
                }).error(function() {
                    alert('failed');
                });
            }
        };
    })
    .controller('SignupController', function($scope, $http, $state) {

        $scope.signup = {
            username: "",
            password: "",
            role: "",
            signup: function() {
                alert($scope.signup.username + ":" + $scope.signup.password + ":" + $scope.signup.role);

                var authHeader = {
                    authorization : "Basic " + btoa("Admin" + ":" + "incongruous"),
                };

                $http({
                    method: 'GET',
                    url: 'http://localhost:8080/token',
                    headers: authHeader,
                    crossDomain: true
                }).success(function(data) {
                    alert(data.token);
                    $scope.signupData = {
                        name: $scope.signup.username,
                        password: $scope.signup.password,
                        role: $scope.signup.role
                    };
                    $http({
                        method: 'POST',
                        url: 'http://localhost:8080/users',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Auth-Token': data.token
                        },
                        crossDomain: true,
                        data: JSON.stringify($scope.signupData)
                    }).success(function(data) {
                        alert("ergar")
                        alert(data.name);
                        //$state.go("dashboard.home");
                    }).error(function() {
                        alert('failed');
                    });
                }).error(function() {
                    alert('failed');
                });
            }
        };
    });