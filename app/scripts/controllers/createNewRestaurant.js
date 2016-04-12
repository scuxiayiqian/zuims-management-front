/**
 * Created by xiayiqian on 1/4/16.
 */

'use strict';

angular.module('sbAdminApp')
    .controller('CreateNewRestaurantCtrl', function ($scope, $http, $cookies, $state, $cookieStore, API) {

        $scope.token = $cookies.get('token');
        $cookies.remove('restID');
        $scope.hotelToSearch = {};
        $scope.hotelToSearch.city = '上海市';
        $scope.searchResultIsShow = false;
        $scope.newRestaurantIsShow = false;
        $scope.notFoundHotel = false;
        $scope.cities = [];
        $scope.stars = ['四星','五星'];
        $scope.restaurantToCreate = {};
        $scope.restaurantLL = {};
        $scope.marketingUsers = [];
        $scope.cityToSearch = "";
        $scope.starToSearch = 0;
        $scope.hotelIdToSearch = -1;
        $scope.rowCollection = [];
        $scope.displayedCollection = [].concat($scope.rowCollection);
        $scope.hotelCollection = [];


        $scope.steps = [
            '基本信息-知道我',
            '基本信息-了解我',
            '基本信息-找到我',
            '餐厅图片',
            '餐厅联系人'
        ];
        $scope.selection = $scope.steps[0];

        $scope.getCurrentStepIndex = function(){
            // Get the index of the current step given selection
            return _.indexOf($scope.steps, $scope.selection);
        };

        // Go to a defined step index
        $scope.goToStep = function(index) {
            if ( !_.isUndefined($scope.steps[index]) )
            {
                $scope.selection = $scope.steps[index];
            }
        };

        $scope.hasNextStep = function(){
            var stepIndex = $scope.getCurrentStepIndex();
            var nextStep = stepIndex + 1;
            // Return true if there is a next step, false if not
            return !_.isUndefined($scope.steps[nextStep]);
        };

        $scope.hasPreviousStep = function(){
            var stepIndex = $scope.getCurrentStepIndex();
            var previousStep = stepIndex - 1;
            // Return true if there is a next step, false if not
            return !_.isUndefined($scope.steps[previousStep]);
        };

        $scope.saveBasicInfo = function() {
            console.log($scope.restaurantToCreate);

            var geolocation = $scope.restaurantLL.lalong;
            var geolocationArr = geolocation.split(',');

            $scope.restaurantToCreate.longitude = geolocationArr[0];
            $scope.restaurantToCreate.latitude = geolocationArr[1];
            //$scope.longitudeNLatitude = $scope.restaurantLL.lalong;
            $scope.restaurantToCreate.smoke = "否";
            $scope.restaurantToCreate.introduction = "无";
            $scope.restaurantToCreate.memo = "无";
            $scope.restaurantToCreate.hotelId = $scope.hotelIdToSearch.toString();

            $http({
                method: 'POST',
                url: API.MERCHANT + '/restaurant/add',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: $scope.restaurantToCreate,
                crossDomain: true
            }).success(function(data) {
                //alert("创建餐厅成功");

                $cookies.remove('hotelId');
                $cookies.remove('hotelName');
                $cookies.remove('longitude');
                $cookies.remove('latitude');

                $cookies.put('restID', data);
            }).error(function (error) {

                console.log(error);
                alert("创建餐厅失败");
                //$cookies.put('restID', error);
                alert(error.message);
                $cookies.remove('hotelId');
                $cookies.remove('hotelName');
                $cookies.remove('longitude');
                $cookies.remove('latitude');
            });
        };

        $scope.incrementStep = function() {
            if ( $scope.hasNextStep() )
            {
                var stepIndex = $scope.getCurrentStepIndex();

                // restaurant basic info finished
                // send a post to server
                console.log(stepIndex);
                if (stepIndex == 2) {
                    console.log($scope.restaurantToCreate);

                    var geolocation = $scope.restaurantLL.lalong;
                    var geolocationArr = geolocation.split(',');

                    $scope.restaurantToCreate.longitude = geolocationArr[0];
                    $scope.restaurantToCreate.latitude = geolocationArr[1];
                    //$scope.longitudeNLatitude = $scope.restaurantLL.lalong;
                    $scope.restaurantToCreate.smoke = "否";
                    $scope.restaurantToCreate.introduction = "无";
                    $scope.restaurantToCreate.memo = "无";
                    $scope.restaurantToCreate.hotelId = $scope.hotelIdToSearch.toString();

                    $http({
                        method: 'POST',
                        url: API.MERCHANT + '/restaurant/add',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: $scope.restaurantToCreate,
                        crossDomain: true
                    }).success(function(data) {

                        $cookies.remove('hotelId');
                        $cookies.remove('hotelName');
                        $cookies.remove('longitude');
                        $cookies.remove('latitude');

                        $cookies.put('restID', data);

                        var nextStep = stepIndex + 1;
                        $scope.selection = $scope.steps[nextStep];
                    }).error(function (error) {

                        console.log(error);
                        alert("创建餐厅失败");
                        //$cookies.put('restID', error);
                        alert(error.message);
                        $cookies.remove('hotelId');
                        $cookies.remove('hotelName');
                        $cookies.remove('longitude');
                        $cookies.remove('latitude');
                    });
                }
                else {
                    var nextStep = stepIndex + 1;
                    $scope.selection = $scope.steps[nextStep];
                }
            }
        };

        $scope.decrementStep = function() {
            if ( $scope.hasPreviousStep() )
            {
                var stepIndex = $scope.getCurrentStepIndex();
                var previousStep = stepIndex - 1;
                $scope.selection = $scope.steps[previousStep];
            }
        };

        function setCities(cityArray) {
            for (var i = 0; i < cityArray.length; i++) {
                $scope.cities.push(cityArray[i]);
            }
        }

        $scope.getCities = function() {
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

        $scope.getProductions = function() {
            $http({
                method: 'GET',
                url: API.OPERATION + '/productions',
                headers: {
                    'x-auth-token': $scope.token
                },
                crossDomain: true
            }).success(function (productionArr) {
                $scope.productions = productionArr;
            }).error(function () {
                console.log("getProductionList failed");
            });
        };

        $scope.getMarketingUsers = function() {
            $http({
                method: 'GET',
                url: API.OPERATION + '/roles/marketing/users',
                headers: {
                    'x-auth-token': $scope.token
                },
                crossDomain: true
            }).success(function(data) {
                for (var i = 0; i < data.length; i++) {
                    $scope.marketingUsers.push(data[i]);
                }
            }).error(function (error) {

                alert(error.message);
                $cookies.remove('hotelId');
                $cookies.remove('hotelName');
                $cookies.remove('longitude');
                $cookies.remove('latitude');

                $state.go("dashboard.hotel");
            });
        };

        $scope.citySelected = function() {
            $scope.notFoundHotel = true;

            if ($scope.starToSearch != 0) {
                $http({
                    method: 'GET',
                    url: API.DATA + '/restaurant/hotel/citystar',
                    params: {
                        city: $scope.cityToSearch,
                        star: $scope.starToSearch
                    },
                    crossDomain: true
                }).success(function(data) {
                    //$scope.rowCollection = data;
                    //$scope.displayedCollection = data;
                    $scope.hotelCollection = data;
                }).error(function (error) {
                    alert("failed from cityselected function");
                });
            }
            else {
                $http({
                    method: 'GET',
                    url: API.DATA + '/restaurant/hotel/citystar',
                    params: {
                        city: $scope.cityToSearch
                    },
                    crossDomain: true
                }).success(function(data) {
                //    $scope.rowCollection = data;
                //    $scope.displayedCollection = data;
                    $scope.hotelCollection = data;
                }).error(function (error) {
                    alert("failed from cityselected function");
                });
            }
        };

        $scope.starSelected = function() {

        };

        $scope.addNewRestaurant = function() {
            // 预设定酒店名和城市
            $scope.restaurantToCreate.hotelName = $scope.rowCollection[0].hotelName;
            $scope.restaurantToCreate.city = $scope.cityToSearch;
            $scope.restaurantToCreate.persistTable = 10;
            $scope.restaurantToCreate.persistTime = 3;

            $scope.newRestaurantIsShow = true;
        };

        $scope.hotelSelected = function() {
            $http({
                method: 'GET',
                url: API.DATA + '/restaurant/info/hotel2restaurant',
                params: {
                    hotelId: $scope.hotelIdToSearch
                },
                crossDomain: true
            }).success(function(data) {
                $scope.rowCollection = data;
                $scope.displayedCollection = data;
                $scope.searchResultIsShow = true;
            }).error(function (error) {
                alert("failed from cityselected function");
            });
        };

        $scope.isMarketing = function() {

            var user = $cookieStore.get('user');

            if(user == null) {
                $state.go('login');
            }

            var flag = false;

            var userRoles = user.roles;

            for (var i = 0; i < userRoles.length; i++) {
                if (userRoles[i].name == 'marketing') {
                    flag = true;

                    // set basicInfo.sellerId to loggin user's id
                    $scope.restaurantToCreate.sellerId = parseInt($cookieStore.get('user').id, 10);
                }

                if(flag) {
                    break;
                }
            }

            if(!flag) {
                console.log('not marketing');
            }
            //return flag;
        };

        $scope.goHotel = function () {
            $state.go('dashboard.hotel');
        };

        $scope.getCities();
        $scope.getProductions();
        $scope.getMarketingUsers();
        $scope.isMarketing();
    });