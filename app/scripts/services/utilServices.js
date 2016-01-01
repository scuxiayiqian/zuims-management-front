'use strict';

angular.module('sbAdminApp')

    .service('utilService', function($http, $state, $cookies) {

        this.getCurrentToken = function() {

            var token = $cookies.get('token');

            if (token == null) {
                $state.go('login');
            }
            else {

                $http.defaults.headers.common['x-auth-token'] = token;
            }
        };

    });


