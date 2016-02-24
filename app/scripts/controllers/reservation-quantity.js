/**
 * Created by xiayiqian on 1/4/16.
 */

'use strict';

angular.module('sbAdminApp')
    .controller('reservationQuantityController', function ($scope, $http, $cookies, $filter) {
        $scope.token = $cookies.get('token');

        $scope.restaurantToSearch = {};

        $scope.today = function() {
            $scope.restaurantToSearch.endDate = new Date();
        };
        $scope.today();

        $scope.clear = function () {
            $scope.endDate = null;
        };

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
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
            labels: ['', '', '', '', '', ''],
            series: ['预订数量'],
            data: [
                [0, 0, 0, 0, 0, 0, 0]
            ],
            onClick: function (points, evt) {
                console.log(points, evt);
            }
        };

        $scope.searchReservationQuantity = function(restaurant) {
            $http({
                method: 'GET',
                url: 'http://202.120.40.175:21104/order/orderCountInfo',
                params: {
                    restaurantId: restaurant.restaurantId,
                    date: $filter('date')($scope.restaurantToSearch.endDate, 'yyyy-MM-dd')
                },
                crossDomain: true
            }).success(function(data) {
                console.log(data);
                $scope.getDatasFromSearchingResult(data);
            }).error(function () {
                console.log("user delete failed");
            });
        };

        function sortSearchingResult(a, b) {
            return a.dorderDate > b.dorderDate;
        }

        $scope.getDatasFromSearchingResult = function(data) {
            var makeNums = [];
            var labels = [];

            $scope.reverse = false;

            var orderBy = $filter('orderBy');

            $scope.order = function(predicate) {
                $scope.predicate = predicate;
                data = orderBy(data, predicate, $scope.reverse);

                console.log(data);
            };
            $scope.order('dorderDate', true);

            for (var i = 0; i < data.length; i++) {
                //console.log(sortedData[i].dorderMakeNum);
                makeNums.push(data[i].dorderMakeNum);
                labels.push(data[i].dorderDate);
            }

            $scope.line.data = [makeNums];
            $scope.line.labels = labels;
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
    });
