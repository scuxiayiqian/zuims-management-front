'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('ProfileController', function($scope, $http, $state, $cookies, $cookieStore, API) {
        $scope.userInfo = {
            name: "",
            fullname: "",
            email: "",
            mobile: "",
            qq: "",
            wx: "",
            id: "",
            roles:[]
        };

        $scope.updatePsw = function() {
            var data = {
                "oldPassword": $scope.oldpw,
                "newPassword": $scope.pw1
            };

            $http({
                method: 'PUT',
                url: API.OPERATION + '/users/' + $cookieStore.get('user').id + '/pwd',
                headers: {
                    'x-auth-token': $cookies.get('token'),
                    'Content-Type': 'application/json'
                },
                data: data,
                crossDomain: true
            }).success(function(data) {
                if (data) {
                    alert("密码修改成功,请重新登录");
                    $scope.logout();
                }
                else {
                    alert("密码修改失败");
                }
            }).error(function () {
                console.log("update psw failed");
            });
        };

        $scope.logout = function() {

            var token = $cookies.get('token');

            if (token != null) {

                $http({
                    method: 'DELETE',
                    url: API.OPERATION + '/token',
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

        $scope.getUserInfo = function() {

            //$scope.userInfo.name = $cookieStore.get('user').name;
            //$scope.userInfo.fullname = $cookieStore.get('user').fullname;
            //$scope.userInfo.email = $cookieStore.get('user').email;
            //$scope.userInfo.mobile = $cookieStore.get('user').mobile;
            //$scope.userInfo.wx = $cookieStore.get('user').wx;
            //$scope.userInfo.qq = $cookieStore.get('user').qq;

            $scope.userInfo = $cookieStore.get('user');
            console.log($scope.userInfo);
        };

        $scope.updateUserInfo = function() {

            $http({
                method: 'PUT',
                url: API.OPERATION + '/users/' + $cookieStore.get('user').id,
                headers: {
                    'x-auth-token': $cookies.get('token'),
                    'Content-Type': 'application/json'
                },
                data: $scope.userInfo,
                crossDomain: true
            }).success(function() {
                console.log("update profile successed");
                $cookieStore.put('user', $scope.userInfo);
                alert("更新成功");
                $state.go("dashboard.home");
            }).error(function () {
                console.log("update profile failed");
            });
        };

        $scope.getUserInfo();
    });