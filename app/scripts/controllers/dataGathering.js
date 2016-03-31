/**
 * Created by xiayiqian on 12/18/15.
 */
'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */

angular.module('sbAdminApp')
    .controller('dataGatheringCtrl', function ($scope, $http, $cookies, $filter, API) {

        $scope.token = $cookies.get('token');

        $scope.getStartDate = function (num) {
            var startDate = new Date(); //获取今天日期
            startDate.setDate(startDate.getDate() - num);
            return startDate;
        };

        $scope.myStart = $scope.getStartDate(7);
        $scope.myEnd = $scope.getStartDate(1);
        $scope.startDate = $filter('date')($scope.myStart, 'yyyy-MM-dd');
        $scope.endDate = $filter('date')($scope.myEnd, 'yyyy-MM-dd');

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

        $scope.status = {
            opened: false
        };

        $scope.endDateStatus = {
            opened: false
        };

        $scope.formats = ['yyyy-MM-dd', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];

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

        $scope.cities = [];
        $scope.selectedCity = "";

        $scope.rowCollection = [];

        $scope.cityToSearch = null;


        function setCities(cityArray) {
            for (var i = 0; i < cityArray.length; i++) {
                $scope.cities.push(cityArray[i]);
            }
        }

        //copy the references (you could clone ie angular.copy but then have to go through a dirty checking for the matches)
        $scope.displayedCollection = [].concat($scope.rowCollection);

        $scope.getCites = function() {
            $http({
                method: 'GET',
                url: API.OPERATION + '/cities',
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

        $scope.filename = "data";

        $scope.getHeader = function () {return ["时间", "预订数量", "订单数量", "就餐数量", "有效订单率", "有效就餐率"]};
        
        $scope.queryOrder = function (num) {

            $scope.myStart = $scope.getStartDate(num);
            $scope.myEnd = $scope.getStartDate(1);
            $scope.startDate = $filter('date')($scope.myStart, 'yyyy-MM-dd');
            $scope.endDate = $filter('date')($scope.myEnd, 'yyyy-MM-dd');

            $scope.citySelected();
        };

        $scope.citySelected = function() {

            var url = API.DATA + '/order/periodcount/city?';

            var startdate = $filter('date')($scope.myStart, 'yyyy-MM-dd');
            var enddate = $filter('date')($scope.myEnd, 'yyyy-MM-dd');

            if ($scope.cityToSearch == null) {

                url = url + 'date1=' + startdate + '&date2=' + enddate;
            } else {
                url = url + 'city=' + $scope.cityToSearch + '&date1=' + startdate + '&date2=' + enddate;
            }
            
            $http({
                method: 'GET',
                url: url,
                crossDomain: true
            }).success(function(data) {
                console.log(data);
                $scope.rowCollection = data;
                $scope.displayedCollection = data;
                $scope.prepareCSVData(data);
            }).error(function () {
                console.log("user delete failed");
            });

            console.log($scope.rowCollection);
        };

        $scope.csvData = [];

        $scope.prepareCSVData = function(data) {

            $scope.csvData = [];
            for(var i = 0; i < data.length; i++) {
                $scope.csvData.push({date: data[i].dorderDate, reservation: data[i].dorderMakeNum,
                    order: data[i].dorderConfirmNum, repast: data[i].dorderFinishNum,
                    orderRate: data[i].dorderConfirmNum/data[i].dorderMakeNum,
                    repastRate: data[i].dorderFinishNum/data[i].dorderMakeNum
                });
            }
        };

        $scope.getCites();
        $scope.citySelected();
    });