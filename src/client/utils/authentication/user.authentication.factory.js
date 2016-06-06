angular.module('ices.authentication.user.authentication', ['ices.authentication.authentication'])
    .factory('UserAuthentication', function ($window, $location, $http, Authentication) {
        return {
            login: function (username, password) {
                return $http.post('/api/login', {
                    username: username,
                    password: password
                });
            },
            password: function (token, password) {
                return $http.post('/api/password', {
                    token: token,
                    password: password
                });
            },
            reset: function (username) {
                return $http.post('/api/reset', {
                    username: username
                });
            },
            logout: function () {
                if (Authentication.isLoggedIn) {
                    Authentication.isLoggedIn = false;
                    delete Authentication.user;
                    delete Authentication.userRole;

                    delete $window.sessionStorage.token;
                    delete $window.sessionStorage.user;
                    delete $window.sessionStorage.userRole;

                    $location.path('/login');
                }
            }
        };
    }
)
;
