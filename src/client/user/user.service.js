angular.module('ices.user.service', [])

    .factory('UserService', function ($http) {

        function go(method, url, config) {
            return method(url, config)
                .then(function (response) {
                    return response.data;
                })
                .catch(function (response) {
                    console.log('error in patients : ' + response.status);
                }
            );
        }

        return {
            save: function (user) {
                return go($http.post, '/api/user/user/', { user: user });
            },

            user: function (userId) {
                return go($http.get, '/api/user/user/', { params: { userId: userId } });
            },

            users: function () {
                return go($http.get, '/api/user/users/');
            }
        };
    }
)
;
