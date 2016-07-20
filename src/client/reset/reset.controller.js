angular.module('ccdb.reset', ['ccdb.authentication.authentication', 'ccdb.authentication.user.authentication', 'ui.bootstrap'])

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
                    $scope.message = 'Your password reset email has been sent if this email/username exists';
                }).error(function(status) {
                    $scope.message = 'Unable to send password reset message. Please try again.';
                });
            }
        };
   }
)
;
