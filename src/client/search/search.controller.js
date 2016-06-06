angular.module('ices.search', ['ngRoute', 'ices.authentication.user.authentication'])

    .config(function ($routeProvider) {
        $routeProvider.when(
            '/search',
            {
                templateUrl: 'search/search.html',
                controller: 'SearchController',
                access: {
                    requiredLogin: true
                }
            }
        );
    })

    .controller('SearchController', function ($scope, $location, UserAuthentication) {
        $scope.dashboard = function () {
            return $location.path('/dashboard');
        };

        $scope.search = function () {
            console.log('in search ' + $scope.query);
            $scope.filter = $scope.query;
        };
    }
);
