


angular.module('sbAdminApp')
    .controller('confirmedOrderCtrl', function ($scope, ngDialog, $http, $cookies, $state, $interval, API) {

        $scope.token = $cookies.get('token');

        $scope.rowCollection = [];

        //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
        $scope.displayedCollection = [].concat($scope.rowCollection);

        $scope.completeOrder = function(row) {
          console.log(getRestaurantId(row));

            $http({
                method: 'GET',
                url: API.MERCHANT + '/order/finishOrder',
                params: {
                    orderId: row
                },
                crossDomain: true
            }).success(function(data) {
                alert("订单已完成");

                getOrderList();
            }).error(function () {
                console.log("user delete failed");
            });
        };

        $scope.completeDidiOrder = function(row) {
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
                  $http({
                      method: 'GET',
                      url: API.MERCHANT + '/order/finishOrder',
                      params: {
                          orderId: row
                      },
                      crossDomain: true
                  }).success(function(data) {
                      alert("核销成功！");

                      getOrderList();
                  }).error(function () {
                      console.log("user delete failed");
                  });
                }
                else {
                  alert("核销失败！");
                }
              })

            });
            newScope.$destroy();
          }
        }

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
                url: API.MERCHANT + '/order/confirmedorder',
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

                $scope.rowCollection = orderArr;
                $scope.displayedCollection = $scope.rowCollection;
            }).error(function () {
                console.log("get order list failed");
            });
        };

        getOrderList();

    });
