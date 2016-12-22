


angular.module('sbAdminApp')
    .controller('finishedOrderCtrl', function ($scope, ngDialog, $http, $cookies, $state, $interval, API) {

        $scope.token = $cookies.get('token');

        $scope.rowCollection = [];

        //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
        $scope.displayedCollection = [].concat($scope.rowCollection);

        function getOrderList() {
            // get restaurant list request
            $http({
                method: 'GET',
                url: API.MERCHANT + '/order/finishedorder',
                crossDomain: true
            }).success(function (orderArr) {
              for(var i = 0;i < orderArr.length;i++) {
                (function(i){
                  return $http({
                      method: 'GET',
                      url: API.MERCHANT + "/order/ddstatusByorderid?orderId=" + orderArr[i].orderId,
                  }).success(function(status){
                    if(status.didi == "didi") {
                      orderArr[i].source = "滴滴";
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

        $scope.dataToExcel = function(tableid) {//整个表格拷贝到EXCEL中
          var curTbl = document.getElementById(tableid);
          var oXL;
          try {
            oXL = GetObject("", "Excel.Application");
          }
          catch (E) {
            oXL = new ActiveXObject("Excel.Application");
          }
          //创建AX对象excel
          var oWB = oXL.Workbooks.Add();
          //获取workbook对象
          var oSheet = oWB.ActiveSheet;
          //激活当前sheet
          var sel = document.body.createTextRange();
          sel.moveToElementText(curTbl);
          //把表格中的内容移到TextRange中
          sel.select();
          //全选TextRange中内容
          sel.execCommand("Copy");
          //复制TextRange中内容
          oSheet.Paste();
          //粘贴到活动的EXCEL中
          oXL.Visible = true;
          //设置excel可见属性
        }

        getOrderList();

    });
