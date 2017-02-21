


angular.module('sbAdminApp')
    .controller('vipCtrl', function ($scope, ngDialog, $http, $cookies, $state, $interval, API) {

        $scope.token = $cookies.get('token');

        $scope.rowCollection = [];
        //$scope.isChosen = [];
        $scope.allChosen = false;

        //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
        $scope.displayedCollection = [].concat($scope.rowCollection);

        $scope.vipToHandle = {};
        $scope.appointedVip = {phoneid: [],viplevel: "",end_date: ""};

        $scope.setAll = function () {
            if($scope.allChosen == true) {
                for(var i = 0;i < $scope.rowCollection.length;i++) {
                    $scope.rowCollection[i].isChosen = true;
                }
            }
            else {
                for(var i = 0;i< $scope.rowCollection.length;i++) {
                    $scope.rowCollection[i].isChosen = false;
                }
            }
        };

        $scope.setVIP = function(row) {
            $scope.vipToHandle.phoneid = row.phone;
            $scope.vipToHandle.vipLevel = row.vipLevel;
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

        $scope.updateQueryVIP = function () {

            for(var i = 0;i < $scope.rowCollection.length;i++) {
                if($scope.rowCollection[i].isChosen == true) {
                    $scope.appointedVip.phoneid.push($scope.rowCollection[i].phone);
                }
            }

            $http({
                method: 'POST',
                url: API.USER + '/internal/users/editappointedvip',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: $scope.appointedVip,
                crossDomain: true
            }).success(function(data) {
                console.log("vip query update successed");
                getVIPList();
            }).error(function (error) {
                console.log(error);
                console.log("vip query update failed");
            });

            $scope.appointedVip.phoneid = [];
            $scope.appointedVip.viplevel = "";
            $scope.appointedVip.end_date = "";

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

                /*for(var i = 0;i < vipArr.length;i++) {
                    var vip = {
                        "lastname" : vipArr[i].lastname,
                        "phone" : vipArr[i].phone,
                        "vipLevel" :vipArr[i].vipLevel,
                        "enddate": vipArr[i].enddate,
                        "isChosen": false
                    };
                    $scope.rowCollection.push(vip);
                }*/

                $scope.displayedCollection = $scope.rowCollection;
            }).error(function () {
                console.log("get vip list failed");
            });
        };

        getVIPList();

    });
