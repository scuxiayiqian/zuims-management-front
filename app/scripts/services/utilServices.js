'use strict';

angular.module('sbAdminApp')

    .service('utilService', function($state, $cookies) {

        this.getCurrentToken = function() {

            var token = $cookies.get('token');

            if (token == null) {
                $state.go('login');
            }

            return token;
        };

    });


