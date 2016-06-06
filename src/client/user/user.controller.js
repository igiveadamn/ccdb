angular.module('ices.user.controller', ['ngRoute', 'ices.user.service', 'ices.utils.form'])

    .config(function ($routeProvider) {
        $routeProvider.when(
            '/users',
            {
                templateUrl: 'user/user.list.html',
                controller: 'UserController',
                access: {
                    requiredLogin: true
                }
            }
        );
        $routeProvider.when(
            '/editUser/:userId',
            {
                templateUrl: 'user/user.form.html',
                controller: 'UserController',
                access: {
                    requiredLogin: true
                }
            }
        );
    })

    .controller('UserController', function ($scope, $location, $routeParams, $filter, $anchorScroll, $timeout, UserService) {

        UserService.users()
            .then(function (users) {
                $scope.users = users;
            })
            .catch(function (error) {
                    console.log('error'.error);
                }
            );
        var userId = $routeParams.userId;

        if (userId === 'new') {
            $scope.user = {};
        } else if (userId) {
            UserService.user(userId)
                .then(function (user) {
                    $scope.user = user;
                })
                .catch(function (error) {
                        console.log('error'.error);
                    }
                );
        }

        $scope.edit = function () {
            return $location.path('/editUser/' + $scope.user._id);
        };

        $scope.save = function () {
            UserService.save($scope.user)
                .then(function (user) {
                    $location.path('/dashboard');
                })
                .catch(function (error) {
                        console.log('error'.error);
                    }
                );
        };

        $scope.hospitals = [
            'Baragwanath',
            'Edendale',
            'Groote Schuur'
        ];

        $scope.roles = [
            'admin'
        ];
    })
;
