


angular.module('sbAdminApp')
    .controller('vipCtrl', function ($scope, ngDialog, $http, $cookies, $state, $interval, API) {

        $scope.token = $cookies.get('token');

        $scope.rowCollection = [];

        //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
        $scope.displayedCollection = [].concat($scope.rowCollection);


        $scope.vipToHandle = {};

        $scope.setVIP = function(row) {
            $scope.vipToHandle.phoneid = row.phone;
            $scope.vipToHandle.viplevel = row.vipLevel;
            $scope.vipToHandle.end_date = row.enddate;
        };

        $scope.updateVIP = function () {

            $http({
                method: 'POST',
                url: API.USER + '/internal/users/editvip',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: $scope.vipToHandle,
                crossDomain: true
            }).success(function(data) {
                console.log("vip update successed");
                getVIPList();
            }).error(function (error) {
                console.log(error);
                console.log("vip update failed");
            });
        }

        function getVIPList() {
            // get restaurant list request
            $http({
                method: 'GET',
                url: API.USER + '/internal/users/getallvipinfo',
                crossDomain: true
            }).success(function (vipArr) {
                console.log("get all vip list successed");

                $scope.rowCollection = vipArr;
                $scope.displayedCollection = $scope.rowCollection;
            }).error(function () {
                console.log("get vip list failed");
            });
        };

        getVIPList();

    });
