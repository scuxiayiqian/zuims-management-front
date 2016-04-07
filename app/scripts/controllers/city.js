/**
 * Created by xiayiqian on 12/18/15.
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
    .controller('cityCtrl', function ($scope, $http, $cookies, $location, API) {

        $scope.steps = [
            'Step 1: Team Info',
            'Step 2: Campaign Info',
            'Step 3: Campaign Media'
        ];
        $scope.selection = $scope.steps[0];

        $scope.getCurrentStepIndex = function(){
            // Get the index of the current step given selection
            return _.indexOf($scope.steps, $scope.selection);
        };

        // Go to a defined step index
        $scope.goToStep = function(index) {
            if ( !_.isUndefined($scope.steps[index]) )
            {
                $scope.selection = $scope.steps[index];
            }
        };

        $scope.hasNextStep = function(){
            var stepIndex = $scope.getCurrentStepIndex();
            var nextStep = stepIndex + 1;
            // Return true if there is a next step, false if not
            return !_.isUndefined($scope.steps[nextStep]);
        };

        $scope.hasPreviousStep = function(){
            var stepIndex = $scope.getCurrentStepIndex();
            var previousStep = stepIndex - 1;
            // Return true if there is a next step, false if not
            return !_.isUndefined($scope.steps[previousStep]);
        };

        $scope.incrementStep = function() {
            if ( $scope.hasNextStep() )
            {
                var stepIndex = $scope.getCurrentStepIndex();
                var nextStep = stepIndex + 1;
                $scope.selection = $scope.steps[nextStep];
            }
        };

        $scope.decrementStep = function() {
            if ( $scope.hasPreviousStep() )
            {
                var stepIndex = $scope.getCurrentStepIndex();
                var previousStep = stepIndex - 1;
                $scope.selection = $scope.steps[previousStep];
            }
        };

        $scope.token = $cookies.get('token');

        $scope.rowCollection = [];

        //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
        $scope.displayedCollection = [].concat($scope.rowCollection);

        $scope.cityToDelete = {};
        $scope.cityToUpdate = {};

        $scope.setCityToDelete = function(row) {
            $scope.cityToDelete = row;
        }

        $scope.setCityToUpdate = function(row) {
            $scope.cityToUpdate = row;
        }

        //remove to the real data holder
        $scope.deleteCity = function() {

            $http({
                method: 'DELETE',
                url: API.OPERATION + '/cities/' + $scope.cityToDelete.name,
                headers: {
                    'x-auth-token': $scope.token
                },
                crossDomain: true
            }).success(function(data) {
                var index = $scope.rowCollection.indexOf($scope.cityToDelete);
                if (index !== -1) {
                    $scope.rowCollection.splice(index, 1);
                }
            }).error(function () {
                console.log("city delete failed");
            });
        }

        $scope.updateCity = function () {

            $http({
                method: 'PUT',
                url: API.OPERATION + '/cities/' + $scope.cityToUpdate.name,
                headers: {
                    'x-auth-token': $scope.token
                },
                data: $scope.cityToUpdate,
                crossDomain: true
            }).success(function(data) {
                $scope.getCityList();
                console.log("update city successed");
            }).error(function () {
                console.log("update city failed");
            });
        }

        $scope.createCity = function () {

            $http({
                method: 'POST',
                url: API.OPERATION + '/cities',
                headers: {
                    'x-auth-token': $scope.token
                },
                data: $scope.cityToUpdate,
                crossDomain: true
            }).success(function(data) {
                console.log("city create successed");
                $scope.getCityList()
            }).error(function () {
                console.log("city create failed");
            });
        }

        $scope.getCityList = function() {
            // get restaurant list request
            $http({
                method: 'GET',
                url: API.OPERATION + '/cities',
                headers: {
                    //'Content-Type': 'application/json',
                    'x-auth-token': $scope.token
                },
                crossDomain: true
            }).success(function (cityArr) {
                console.log("getCityList successed");
                $scope.rowCollection = cityArr;
                $scope.displayedCollection = $scope.rowCollection;
            }).error(function () {
                console.log("getCityList failed");
            });
        };

        $scope.getCityList();
    });
