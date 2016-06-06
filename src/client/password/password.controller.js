angular.module('ices.password', ['ices.authentication.authentication', 'ices.authentication.user.authentication'])

    .config(function ($routeProvider) {
        $routeProvider.when(
            '/password/:token',
            {
                templateUrl: 'password/password.html',
                controller: 'PasswordController',
                access: {
                    requiredLogin: false
                }
            }
        );
    })

    .controller('PasswordController', function($scope, $window, $location, $routeParams, UserAuthentication, Authentication) {

        $scope.token = $routeParams.token;

        $scope.checkPasswords = function () {
            $scope.passwordError = $scope.user.password !== $scope.user.password2;
        };

        $scope.password = function() {

            var token = $scope.token;
            var password = $scope.user.password;

            if (token !== undefined && password !== undefined) {
                UserAuthentication.password(token, password).success(function(data) {

                    Authentication.isLoggedIn = true;
                    Authentication.user = data.user.username;
                    Authentication.userRole = data.user.role;

                    $window.sessionStorage.token = data.token;
                    $window.sessionStorage.user = data.user.username;
                    $window.sessionStorage.userRole = data.user.role;

                    $location.path('/');
                }).error(function(status) {
                    alert('Error');
                });
            } else {
                alert('Invalid credentials');
            }
        };
   }
)
;
