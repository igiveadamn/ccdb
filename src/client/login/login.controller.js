angular.module('ccdb.login', ['ccdb.authentication.authentication', 'ccdb.authentication.user.authentication', 'ui.bootstrap'])

    .config(function ($routeProvider) {
        $routeProvider.when(
            '/login',
            {
                templateUrl: 'login/login.html',
                controller: 'LoginController',
                access: {
                    requiredLogin: false
                }
            }
        );
    })

    .controller('LoginController', function($scope, $window, $location, $timeout, UserAuthentication, Authentication) {

        $scope.errorHandler = {};

        $scope.reset = function () {
            $location.path('/reset');
        };

        $scope.login = function() {

            var username = $scope.user.username,
                password = $scope.user.password;

            if (username !== undefined && password !== undefined) {
                UserAuthentication.login(username, password).success(function(data) {

                    if (data.status === 401) {
                      alert('Invalid credentials');
                      return null;
                    }

                    Authentication.isLoggedIn = true;
                    Authentication.user = data.user.username;
                    Authentication.userRole = data.user.role;

                    $window.sessionStorage.token = data.token;
                    $window.sessionStorage.user = data.user.username;
                    $window.sessionStorage.userRole = data.user.role;

                    $scope.$emit('login-success');
                }).error(function(error) {
                    $scope.errorHandler.message = (error) ? error.message : 'An error occurred';
                });
            } else {
                alert('Invalid credentials');
            }
        };
   }
);
