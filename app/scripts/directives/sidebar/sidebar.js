'use strict';

/**
 * @ngdoc directive
 * @name izzyposWebApp.directive:adminPosHeader
 * @description
 * # adminPosHeader
 */

angular.module('sbAdminApp')
  .directive('sidebar',['$location',function() {
    return {
      templateUrl:'scripts/directives/sidebar/sidebar.html',
      restrict: 'E',
      replace: true,
      scope: {
      },
      controller:function($rootScope, $scope){
        $scope.selectedMenu = 'dashboard';
        $scope.collapseVar = 0;
        $scope.multiCollapseVar = 0;
        
        $scope.check = function(x){
          
          if(x==$scope.collapseVar)
            $scope.collapseVar = 0;
          else
            $scope.collapseVar = x;
        };
        
        $scope.multiCheck = function(y){
          
          if(y==$scope.multiCollapseVar)
            $scope.multiCollapseVar = 0;
          else
            $scope.multiCollapseVar = y;
        };

        $scope.setMenusVisibility = function() {

            $scope.showUserManagement = $rootScope.isVisible('userManagement');
            $scope.showRestaurantManagement = $rootScope.isVisible('restaurantManagement');
            $scope.showRestaurantPromotion = $rootScope.isVisible('restaurantPromotion');
            $scope.showSystemManagement = $rootScope.isVisible('systemManagement');

        }

          $scope.setMenusVisibility();
      }
    }
  }]);
