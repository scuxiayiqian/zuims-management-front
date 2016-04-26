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
            controller:function($scope, $state, $cookieStore){
                $scope.selectedMenu = 'dashboard';
                $scope.collapseVar = 0;
                $scope.multiCollapseVar = 0;

                $scope.isVisible = function(item) {

                    var user = $cookieStore.get('user');

                    if(user == null) {
                        $state.go('login');
                    }

                    var flag = false;

                    var userRoles = user.roles;

                    for (var i = 0; i < userRoles.length; i++) {
                        for (var j = 0; j < userRoles[i].rights.length; j++) {
                            if(userRoles[i].rights[j].name == item) {
                              flag = true;
                                break;
                            }
                        }

                        if(flag) {
                            break;
                        }
                    }

                    if(!flag) {
                        //console.log(item);
                    }
                    return flag;
                };

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
