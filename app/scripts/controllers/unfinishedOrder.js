


angular.module('sbAdminApp')
    .controller('unfinishedOrderCtrl', function ($scope, ngDialog, $http, $cookies, $state, $interval, API) {

        $scope.token = $cookies.get('token');
        $scope.cities = [];

        $scope.rowCollection = [];

        //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
        $scope.displayedCollection = [].concat($scope.rowCollection);


        $scope.orderToHandle = {};


        $scope.confirmOrder = function(row) {
          console.log(getRestaurantId(row));

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

                getOrderList();
            }).error(function () {
                console.log("user delete failed");
            });
        };

        $scope.confirmDidiOrder = function(row) {
          var newScope = $scope.$new(true);
          console.log(getRestaurantId(row));

          ngDialog.open({
              templateUrl: 'complete_didi_order.html',
              scope: newScope
          });

          newScope.confirm = function () {
            $http({
                method: 'GET',
                url: API.MERCHANT + "/didi/getShopId?restaurantId=" + getRestaurantId(row),
            }).success(function(orderInfo) {
              var cavInfo = {orderId:"",appId:"",token:"",logId:"",couponCode:"",shopId:"",merchantId:"",cavUserName:""};
              cavInfo.orderId = row.orderId;
              cavInfo.couponCode = document.getElementById("couponCode").value;
              cavInfo.shopId = orderInfo.shopId + "";
              cavInfo.merchantId = orderInfo.merchantId + "";
              cavInfo.cavUserName = "最美食";

              $http({
                method:'POST',
                url:API.MERCHANT + "/order/ddConfirm",
                data:JSON.stringify(cavInfo),
                headers: {'Content-Type': 'application/json;charset=UTF-8'},
                crossDomain:true
              }).success(function(data){

              //OrderService.didiConfirm(cavInfo).success(function(data) {
                if(data == true ) {
                  alert("核销成功！");
                  $scope.getOrderList();
                }
                else {
                  alert("核销失败！");
                }
              })

            });
            newScope.$destroy();
          }
        }

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

        var getRestaurantId = function(orderId) {
          for(var i = 0;i < $scope.rowCollection.length;i++) {
            if(orderId == $scope.rowCollection[i].orderId) {
              return $scope.rowCollection[i].restaurantId;
            }
          }
        };

        function getOrderList() {
            // get restaurant list request
            $http({
                method: 'GET',
                url: API.MERCHANT + '/order/unconfirmedorder',
                crossDomain: true
            }).success(function (orderArr) {
                for(var i = 0;i < orderArr.length;i++) {
                  (function(i){
                    return $http({
                        method: 'GET',
                        url: API.MERCHANT + "/order/ddstatusByorderid?orderId=" + orderArr[i].orderId,
                    }).success(function(status){
                      if(status.didi == "didi") {
                        orderArr[i].source = "滴滴"
                        orderArr[i].isDidi = true;
                      }
                      else {
                        orderArr[i].isDidi = false;
                      }
                    });
                  })(i)
                }

                console.log("get all order list successed");

                var lengthOfRow = $scope.rowCollection.length;
                var lengthOfOrder = orderArr.length;
                if(lengthOfRow > 0) {
                  if($scope.rowCollection[lengthOfRow - 1].orderId < orderArr[lengthOfOrder - 1].orderId) {
                    alert("有新的订单");
                  }
                }

                $scope.rowCollection = orderArr;
                $scope.displayedCollection = $scope.rowCollection;
            }).error(function () {
                console.log("get order list failed");
            });
        };

        getOrderList();

        var promise;

        // starts the interval
        $scope.start = function() {

            // store the interval promise
            promise = $interval(getOrderList, 30000);
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
