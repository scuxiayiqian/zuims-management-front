'use strict';

angular.module('sbAdminApp')

    .service('utilService', function($cookies, $rootScope) {

        this.getCurrentToken = function() {

            if ($rootScope.token == null) {
                $rootScope.token = $cookies.get('token');
                alert("get token from cookie");
            }
            else {
                return;
            }

        };

    });


