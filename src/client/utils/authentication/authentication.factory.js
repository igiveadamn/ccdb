angular.module('ccdb.authentication.authentication', [])
    .factory('Authentication', function ($window) {
        return {
            isLoggedIn: false,


            check: function () {
                if ($window.sessionStorage.token && $window.sessionStorage.user) {
                    this.isLoggedIn = true;
                } else {
                    this.isLoggedIn = false;
                    delete this.user;
                }
            }
        };
    }
)
;


