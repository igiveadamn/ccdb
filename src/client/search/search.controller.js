angular.module('ccdb.search', ['ngRoute', 'ccdb.authentication.user.authentication'])

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

    .controller('SearchController', function ($scope, $location) {
        $scope.dashboard = function () {
            return $location.path('/dashboard');
        };
    }
);
