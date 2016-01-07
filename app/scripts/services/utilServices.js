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

        this.getOrderCountInfo = function(restid, enddate) {
            return $http({
                method: 'GET',
                url: 'http://202.120.40.175:21104/order/orderCountInfo',
                params: {
                    restaurantId: restid,
                    date: $filter('date')(enddate, 'yyyy-MM-dd')
                },
                crossDomain: true
            });
        };

        this.formatOrderCountInfo = function(data, whichDataToFormat) {
            var makeNums = [];
            var labels = [];

            if (whichDataToFormat == "dorderFinishNum") {
                for (var i = 0; i < data.length; i++) {
                    makeNums.push(data[i].dorderFinishNum);
                    labels.push(i+1);
                }
            }
            else if (whichDataToFormat == "dorderConfirmNum") {
                for (var i = 0; i < data.length; i++) {
                    makeNums.push(data[i].dorderConfirmNum);
                    labels.push(i+1);
                }
            }
            else if (whichDataToFormat == "dorderMakeNum") {
                for (var i = 0; i < data.length; i++) {
                    makeNums.push(data[i].dorderMakeNum);
                    labels.push(i+1);
                }
            }
            else if (whichDataToFormat == "orderRate") {
                for (var i = 0; i < data.length; i++) {
                    makeNums.push(data[i].dorderConfirmNum / data[i].dorderMakeNum);
                    labels.push(i+1);
                }
            }
            else if (whichDataToFormat == "repastRate") {
                for (var i = 0; i < data.length; i++) {
                    makeNums.push(data[i].dorderFinishNum / data[i].dorderMakeNum);
                    labels.push(i+1);
                }
            }

            return [[makeNums], labels];
        };

    });


