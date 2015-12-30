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

                $scope.isVisible = function(item) {

                    var flag = false;

                    for (var i = 0; i < $rootScope.user.roles.length; i++) {
                        for (var j = 0; j < $rootScope.user.roles[i].rights.length; j++) {
                            if($rootScope.user.roles[i].rights[j].name == item) {
                              flag = true;
                              break;
                            }
                        }

                        if(flag) {
                            break;
                        }
                    }

                    return flag;
                }

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
        }
    }
  }]);
