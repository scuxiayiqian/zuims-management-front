'use strict';

angular.module('sbAdminApp')
    .controller('repastRateController', function ($scope, $http, $cookies, $filter, utilService) {
        $scope.token = $cookies.get('token');

        $scope.restaurantToSearch = null;

        $scope.getStartDate = function (num) {
            var startDate = new Date(); //获取今天日期
            startDate.setDate(startDate.getDate() - num);
            return startDate;
        };

        $scope.startDate = $filter('date')($scope.getStartDate(7), 'yyyy-MM-dd');
        $scope.endDate = $filter('date')($scope.getStartDate(1), 'yyyy-MM-dd');
        $scope.myStart = $scope.startDate;
        $scope.myEnd = $scope.endDate;

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return false;
        };

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };

        //禁用此函数,让用户可以选择当日之前的日期
        //$scope.toggleMin();
        $scope.maxDate = new Date(2020, 5, 22);

        $scope.open = function($event) {
            $scope.status.opened = true;
        };

        $scope.setDate = function(year, month, day) {
            $scope.endDate = new Date(year, month, day);
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[1];

        $scope.status = {
            opened: false
        };

        $scope.endDateStatus = {
            opened: false
        };

        $scope.openEndDate = function($event) {
            $scope.endDateStatus.opened = true;
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 2);
        $scope.events =
            [
                {
                    date: tomorrow,
                    status: 'full'
                },
                {
                    date: afterTomorrow,
                    status: 'partially'
                }
            ];

        $scope.getDayClass = function(date, mode) {
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0,0,0,0);

                for (var i=0;i<$scope.events.length;i++){
                    var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        };

        function setCities(cityArray) {
            for (var i = 0; i < cityArray.length; i++) {
                $scope.cities.push(cityArray[i]);
            }
        }

        $scope.cities = [];
        $scope.getCites = function() {
            $http({
                method: 'GET',
                url: 'http://115.159.87.129:8008/cities',
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
        $scope.getCites();

        $scope.line = {
            labels: ['', '', '', '', '', '', ''],
            series: ['有效订单率'],
            data: [
                [0, 0, 0, 0, 0, 0, 0]
            ],
            onClick: function (points, evt) {
                console.log(points, evt);
            }
        };

        $scope.searchBtnClicked = function() {
            $http({
                method: 'GET',
                url: 'http://115.159.87.129:8004/restaurant/search/namecity',
                params: {
                    restaurantName: $scope.restaurantToSearch.name,
                    city: $scope.restaurantToSearch.city
                },
                crossDomain: true
            }).success(function(data) {
                $scope.rowCollection = data;
                $scope.displayedCollection = data;
            }).error(function () {
                console.log("user delete failed");
            });
        };

        $scope.queryOrder = function (num) {

            $scope.startDate = $filter('date')($scope.getStartDate(num), 'yyyy-MM-dd');
            $scope.endDate = $filter('date')($scope.getStartDate(1), 'yyyy-MM-dd');
            $scope.myStart = $scope.startDate;
            $scope.myEnd = $scope.endDate;

            //$("#start").val($scope.myStart);
            //$("#end").val($scope.myEnd);
            $scope.searchRepastRateFromSelectedStartAndEnd();
        };

        $scope.searchRepastRateFromSelectedStartAndEnd = function (restaurant) {

            if (restaurant != null) {
                $scope.restuarantIdToSearch = restaurant.restaurantId;
            }

            if ($scope.restaurantToSearch == null) {
                return;
            }

            var startdate = $filter('date')($scope.myStart, 'yyyy-MM-dd');
            var enddate = $filter('date')($scope.myEnd, 'yyyy-MM-dd');

            console.log('search: ' + startdate + ' to ' + enddate);

            utilService.getOrderCountInfo($scope.restuarantIdToSearch, startdate, enddate)
                .success(function(data) {

                    var formatdata = utilService.formatOrderCountInfo(data, "repastRate");
                    $scope.line.data = formatdata[0];
                    $scope.line.labels = formatdata[1];
                })
                .error(function() {
                    console.log("get order count info failed");
                });
        };
    });
