


angular.module('sbAdminApp')
    .controller('unfinishedOrderCtrl', function ($scope, $http, $cookies, $state, $interval, API) {

        $scope.token = $cookies.get('token');
        $scope.cities = [];

        $scope.rowCollection = [];

        //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
        $scope.displayedCollection = [].concat($scope.rowCollection);


        $scope.orderToHandle = {};


        $scope.confirmOrder = function(row) {

            $http({
                method: 'GET',
                url: API.MERCHANT + '/order/confirmOrder',
                params: {
                    orderId: row,
                    opt: 1
                },
                crossDomain: true
            }).success(function(data) {
                alert("订单已确认");

                $scope.getOrderList();
            }).error(function () {
                console.log("user delete failed");
            });
        };

        $scope.cancelOrder = function(row) {
            $http({
                method: 'GET',
                url: API.MERCHANT + '/order/confirmOrder',
                params: {
                    orderId: row,
                    opt: 0
                },
                crossDomain: true
            }).success(function(data) {
                alert("订单已取消");
                $scope.getOrderList();
            }).error(function () {
                console.log("user delete failed");
            });
        };

        $scope.setOrderToHandle = function(row) {
            $scope.orderToHandle = row;
        };

        function getOrderList() {
            // get restaurant list request
            $http({
                method: 'GET',
                url: API.MERCHANT + '/order/unconfirmedorder',
                crossDomain: true
            }).success(function (orderArr) {
                console.log("get all order list successed");
                $scope.rowCollection = orderArr;
                $scope.displayedCollection = $scope.rowCollection;
            }).error(function () {
                console.log("get order list failed");
            });
        }

        getOrderList();

        var promise;

        // starts the interval
        $scope.start = function() {
 
            // store the interval promise
            promise = $interval(getOrderList, 60000);
            console.log("start");
        };

        // stops the interval
        $scope.stop = function() {
            $interval.cancel(promise);
            console.log("cancel");
        };

        // starting the interval by default
        $scope.start();

        $scope.$on('$destroy', function() {
            $scope.stop();
        });

    });
