/**
 * Created by shiyunfeng on 9/30/16.
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
     .controller('merchantCtrl', function ($scope, $http, $cookies, API) {
         //var restaurantBaseUrl = "http://202.120.40.175:21104";

         $scope.token = $cookies.get('token');

         /*$scope.rowCollection = [];

         //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
         $scope.displayedCollection = [].concat($scope.rowCollection);

         $scope.userToDelete = {};
         $scope.userToUpdate = {};
         $scope.userToCreate = {};*/
         $scope.hotelNum = -1;
         $scope.restaurantNum = -1;
         $scope.discountRestaurantNum = -1;

         $scope.getNum = function() {
           $http({
               method: 'GET',
               url: API.MERCHANT + '/restaurant/num',
               //url:restaurantBaseUrl + '/restaurant/num',
               crossDomain: true
           }).success(function (data) {
               console.log("getNum successed");
               $scope.hotelNum = data.hotelNum;
               $scope.restaurantNum = data.restaurantNum;
               $scope.discountRestaurantNum = data.discountRestaurantNum;
           }).error(function () {
               console.log("getNum failed");
           });
       };

       $scope.getNum();
     });
