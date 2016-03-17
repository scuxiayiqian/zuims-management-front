


angular.module('sbAdminApp')
    .controller('unfinishedOrderCtrl', function ($scope, $http, $cookies, $state) {

        $scope.token = $cookies.get('token');
        $scope.cities = [];

        $scope.rowCollection = [];

        //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
        $scope.displayedCollection = [].concat($scope.rowCollection);

        $scope.hotelToCreate = {};

        $scope.orderToHandle = {};


        $scope.confirmOrder = function(row) {

            $http({
                method: 'GET',
                url: 'http://202.120.40.175:21104/order/confirmOrder',
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
                url: 'http://202.120.40.175:21104/order/confirmOrder',
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

        $scope.getOrderList = function() {
            // get restaurant list request
            $http({
                method: 'GET',
                url: 'http://202.120.40.175:21104/order/unconfirmedorder',
                crossDomain: true
            }).success(function (orderArr) {
                console.log("get all order list successed");
                $scope.rowCollection = orderArr;
                $scope.displayedCollection = $scope.rowCollection;
            }).error(function () {
                console.log("get order list failed");
            });


            //202.120.40.175:21104/order/unconfirmedorder
        };

        $scope.createRestaurantClicked = function(row) {

            $cookies.put('hotelId', row.hotelId);
            $cookies.put('hotelName', row.hotelName);
            $cookies.put('longitude', row.longitude);
            $cookies.put('latitude', row.latitude);
            $cookies.put('city', row.city);
            $cookies.put('hotelAddress', row.hotelAddress);

            $state.go("dashboard.restaurant-create");

        };

        $scope.getCites = function() {
            $http({
                method: 'GET',
                url: 'http://202.120.40.175:21108/cities',
                headers: {
                    //'Content-Type': 'application/json',
                    'x-auth-token': $scope.token
                },
                crossDomain: true
            }).success(function (cityArray) {
                setCities(cityArray);
            }).error(function () {
                console.log("getCites failed");
            });
        };

        function setCities(cityArray) {
            for (var i = 0; i < cityArray.length; i++) {
                $scope.cities.push(cityArray[i]);
            }
        };

        $scope.getOrderList();
        $scope.getCites();
    });
