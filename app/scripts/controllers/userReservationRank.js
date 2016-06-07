/**
 * Created by xiayiqian on 6/7/16.
 */
/**
 * Created by xiayiqian on 6/7/16.
 */
/**
 * Created by xiayiqian on 1/4/16.
 */

'use strict';

angular.module('sbAdminApp')
    .controller('userReservationRankController', function ($scope, $http, $cookies, $filter, API) {
        $scope.token = $cookies.get('token');
        $scope.sortSearch = {
            city: "",
            orderLabel: ""
        };

        $scope.getStartDate = function (num) {
            var startDate = new Date(); //获取今天日期
            startDate.setDate(startDate.getDate() - num);
            return startDate;
        };

        $scope.myStart = $scope.getStartDate(7);
        $scope.myEnd = $scope.getStartDate(1);

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

        $scope.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

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


        $scope.searchRank = function() {
            var startdate = $filter('date')($scope.myStart, 'yyyy-MM-dd');
            var enddate = $filter('date')($scope.myEnd, 'yyyy-MM-dd');
            console.log(startdate + "~" + enddate + "..." + $scope.sortSearch.city + $scope.sortSearch.orderLabel);

            $http({
                method: 'GET',
                url: API.MERCHANT + '/order/ordernumSort',
                params: {
                    date1: startdate,
                    date2: enddate
                },
                crossDomain: true
            }).success(function(data) {
                console.log(data);
                $scope.rowCollection = data;
                $scope.displayedCollection = $scope.rowCollection;
            }).error(function () {
                console.log("user delete failed");
            });
        };

        $scope.searchRank();
    });
