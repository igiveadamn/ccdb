angular.module('ices.reset', ['ices.authentication.authentication', 'ices.authentication.user.authentication', 'ui.bootstrap'])

    .config(function ($routeProvider) {
        $routeProvider.when(
            '/reset',
            {
                templateUrl: 'reset/reset.html',
                controller: 'ResetController',
                access: {
                    requiredLogin: false
                }
            }
        );
    })

    .controller('ResetController', function($scope, $window, $location, UserAuthentication, Authentication) {

        $scope.reset = function() {

            var username = $scope.user.username;

            if (username !== undefined) {
                UserAuthentication.reset(username).success(function(user) {
                    $scope.message = 'reset password message sent to ' + user.name + ' at ' + user.hospital;
                }).error(function(status) {
                    $scope.message = 'unable to send password to ' + username + '. please try again.';
                });
            }
        };
   }
)
;
