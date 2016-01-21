'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('ProfileController', function($scope, $http, $state, $cookies, $cookieStore) {
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
                url: 'http://localhost:8080/users/' + $cookieStore.get('user').id,
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