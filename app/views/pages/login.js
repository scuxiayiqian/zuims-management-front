/**
 * Created by xiayiqian on 12/14/15.
 */

angular.module('sbAdminApp')
    .controller('LoginCtrl', function($scope) {
        $scope.username = {
            line: "init@qq.com",
            list: function () {
                alert($scope.username.line);
            }
        };
    });
