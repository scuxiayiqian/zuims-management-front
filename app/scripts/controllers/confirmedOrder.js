


angular.module('sbAdminApp')
    .controller('confirmedOrderCtrl', function ($scope, ngDialog, $http, $cookies, $state, $interval, API) {

        $scope.token = $cookies.get('token');

        $scope.rowCollection = [];

        //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
        $scope.displayedCollection = [].concat($scope.rowCollection);

        function getOrderList() {
            // get restaurant list request
            $http({
                method: 'GET',
                url: API.MERCHANT + '/order/confirmedorder',
                crossDomain: true
            }).success(function (orderArr) {
                console.log("get all order list successed");

                $scope.rowCollection = orderArr;
                $scope.displayedCollection = $scope.rowCollection;
            }).error(function () {
                console.log("get order list failed");
            });
        };

        getOrderList();

    });
