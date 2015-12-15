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
                            'x-auth-token': data.token
                        },
                        crossDomain: true,
                        data: JSON.stringify($scope.signupData)
                    }).success(function() {
                        alert("signup successed");
                        $http({
                            method: 'PUT',
                            url: 'http://localhost:8080/users/logout',
                            headers: {
                                'x-auth-token': data.token
                            },
                            crossDomain: true
                        }).success(function() {
                            alert("logout successed");
                            $http({
                                method: 'GET',
                                url: 'http://localhost:8080/token',
                                headers: {
                                    authorization: "Basic " + btoa($scope.signup.username + ":" + $scope.signup.password)
                                },
                                crossDomain: true    
                            }).success(function(token) {
                                alert($scope.signup.username + ":" + token.token);
                                $state.go("dashboard.home");
                            }).error(function() {
                                alert("failed");
                            })
                        }).error(function() {
                            alert('logout failed');
                        })
                    }).error(function() {
                        alert('failed');
                    });
                }).error(function() {
                    alert('failed');
                });
            }
        };
    });