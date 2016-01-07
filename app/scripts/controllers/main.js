'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('MainCtrl', function($scope,$uibPosition, $window) {

    $scope.redirecttoVM = function() {
      $window.open('http://202.120.40.175:11180/ui');
    };

    $scope.redirecttoContainers = function() {
      $window.open('http://202.120.40.175:11180/api/v1/proxy/namespaces/kube-system/services/monitoring-grafana/');
    }
  });
