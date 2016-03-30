/**
 * Created by xiayiqian on 1/4/16.
 */
/**
 * Created by xiayiqian on 1/4/16.
 */
/**
 * Created by xiayiqian on 1/4/16.
 */

/**
 * Created by xiayiqian on 12/18/15.
 */
'use strict';

angular.module('sbAdminApp')
    .controller('repastQuantityController', function ($scope, $http, $cookies, $filter, utilService) {
        $scope.token = $cookies.get('token');

        $scope.restaurantToSearch = null;

        $scope.getStartDate = function (num) {
            var startDate = new Date(); //获取今天日期
            startDate.setDate(startDate.getDate() - num);
            return startDate;
        };

        $scope.myStart = $scope.getStartDate(7);
        $scope.myEnd = $scope.getStartDate(1);

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
            dateDisabled: $scope.disabled,
            formatYear: 'yy',
            minDate: $scope.minDate,
            maxDate: $scope.maxDate,
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
        $scope.getCites();

        $scope.line = {
            labels: ['', '', '', '', '', '', ''],
            series: ['就餐数量'],
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
                url: 'http://202.120.40.175:21104/restaurant/search/namecity',
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

        $scope.defaultSearchWay = "searchByCity";

        $scope.queryOrder = function (num) {

            $scope.myStart = $scope.getStartDate(num);
            $scope.myEnd = $scope.getStartDate(1);

            if ($scope.defaultSearchWay == "searchByCity") {
                $scope.getDataByCity();
            } else {
                $scope.searchRepastQuantityFromSelectedStartAndEnd();
            }
        };

        $scope.searchFSTE = function() {

            if ($scope.defaultSearchWay == "searchByCity") {
                $scope.getDataByCity();
            } else {
                $scope.searchRepastQuantityFromSelectedStartAndEnd();
            }
        }
        $scope.searchRepastQuantityFromSelectedStartAndEnd = function (restaurant) {

            if (restaurant != null) {
                $scope.restaurantToSearch.Id = restaurant.restaurantId;
            }

            if ($scope.restaurantToSearch == null) {
                return;
            }

            $scope.defaultSearchWay = "searchByRestaurant";

            var startdate = $filter('date')($scope.myStart, 'yyyy-MM-dd');
            var enddate = $filter('date')($scope.myEnd, 'yyyy-MM-dd');

            console.log('search: ' + startdate + ' to ' + enddate);

            utilService.getOrderCountInfo($scope.restaurantToSearch.Id, startdate, enddate)
                .success(function(data) {

                    var formatdata = utilService.formatOrderCountInfo(data, "dorderFinishNum");
                    $scope.line.data = formatdata[0];
                    $scope.line.labels = formatdata[1];
                })
                .error(function() {
                    console.log("get order count info failed");
                });
        };

        $scope.getDataByCity = function() {

            var city = null;

            $scope.defaultSearchWay = "searchByCity";
            
            var startdate = $filter('date')($scope.myStart, 'yyyy-MM-dd');
            var enddate = $filter('date')($scope.myEnd, 'yyyy-MM-dd');

            $scope.rowCollection = null;
            $scope.displayedCollection = null;

            if ($scope.restaurantToSearch != null) {

                city = $scope.restaurantToSearch.city;
                $scope.restaurantToSearch.name = "";
            }
            
            utilService.getOrderCountInfoByCity(city, startdate, enddate)
                .success(function(data) {

                    var formatdata = utilService.formatOrderCountInfo(data, "dorderFinishNum");
                    $scope.line.data = formatdata[0];
                    $scope.line.labels = formatdata[1];

                }).error(function () {
                    console.log("user delete failed");
                });
        }

        $scope.getDataByCity();
    });
