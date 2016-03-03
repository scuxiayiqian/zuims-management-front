'use strict';

angular.module('sbAdminApp')

    .service('utilService', function($http, $state, $cookies, $filter) {

        this.getCurrentToken = function() {

            var token = $cookies.get('token');

            if (token == null) {
                $state.go('login');
            }
            else {

                $http.defaults.headers.common['x-auth-token'] = token;
            }
        };

        this.getOrderCountInfo = function(restid, startdate, enddate) {

            return $http({
                method: 'GET',
                url: 'http://202.120.40.175:21104/order/periodcount?restaurantId=' + restid + '&date1=' + startdate + '&date2=' + enddate,
                crossDomain: true
            });
        };

        this.formatOrderCountInfo = function(data, whichDataToFormat) {
            var makeNums = [];
            var labels = [];

            var reverse = false;
            var orderBy = $filter('orderBy');

            function order(predicate) {
                var predicate = predicate;
                data = orderBy(data, predicate, reverse);

                console.log(data);
            }

            order('dorderDate', true);
            if (whichDataToFormat == "dorderFinishNum") {

                for (var i = 0; i < data.length; i++) {
                    makeNums.push(data[i].dorderFinishNum);
                    labels.push(data[i].dorderDate);
                }
            }
            else if (whichDataToFormat == "dorderConfirmNum") {
                //$scope.order('dorderDate', true);
                for (var i = 0; i < data.length; i++) {
                    makeNums.push(data[i].dorderConfirmNum);
                    labels.push(data[i].dorderDate);
                }
            }
            else if (whichDataToFormat == "dorderMakeNum") {
                //$scope.order('dorderDate', true);
                for (var i = 0; i < data.length; i++) {
                    makeNums.push(data[i].dorderMakeNum);
                    labels.push(data[i].dorderDate);
                }
            }
            else if (whichDataToFormat == "orderRate") {
                //$scope.order('dorderDate', true);
                for (var i = 0; i < data.length; i++) {

                    if (data[i].dorderMakeNum == 0) {
                        makeNums.push(0);
                    } else {
                        makeNums.push(data[i].dorderConfirmNum / data[i].dorderMakeNum);
                    }
                    labels.push(data[i].dorderDate);
                }
            }
            else if (whichDataToFormat == "repastRate") {
                //$scope.order('dorderDate', true);
                for (var i = 0; i < data.length; i++) {
                    if (data[i].dorderMakeNum == 0) {
                        makeNums.push(0);
                    } else {
                        makeNums.push(data[i].dorderFinishNum / data[i].dorderMakeNum);
                    }
                    labels.push(data[i].dorderDate);
                }
            }

            if (data.length > 0) {
                return [[makeNums], labels];
            } else {
                return [[[0, 0, 0, 0, 0, 0, 0]], ['', '', '', '', '', '', '']];
            }
        };

    });


