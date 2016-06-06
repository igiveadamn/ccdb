angular.module('ices',
    [
        'ngRoute',
        'mm.foundation',
        'angularCombine',
        'ices.authentication.authentication',
        'ices.authentication.token.interceptor',
        'ices.cache.localStorage.interceptor',
        'ices.authentication.user.authentication',
        'ices.dashboard',
        'ices.history.directive',
        'ices.date.range.directive',
        'ices.date.range.service',
        'ices.login',
        'ices.navigation',
        'ices.password',
        'ices.patient',
        'ices.patient.list.directive',
        'ices.patient.count.directive',
        'ices.search',
        'ices.score.directive',
        'ices.scores.directive',
        'ices.reset',
        'ices.user',
        'ices.utils.age.filter',
        'ices.utils.localStorage.factory'
    ])
    .config(function ($routeProvider, $httpProvider, angularCombineConfigProvider) {
        $routeProvider.otherwise(
            {
                redirectTo: '/dashboard'
            }
        );

        angularCombineConfigProvider.addConf(/.*/, '/all.html');

        $httpProvider.interceptors.push('TokenInterceptor');
        $httpProvider.interceptors.push('LocalStorageInterceptor');
    })

    .run(function ($rootScope, $window, $location, $timeout, $log, Authentication, PatientRule, PatientService) {
        Authentication.check();

        $rootScope.$on('$routeChangeStart', function (event, nextRoute, currentRoute) {
            if ((nextRoute.access && nextRoute.access.requiredLogin) && !Authentication.isLoggedIn) {
                $location.path('/login');
            } else {
                if (!Authentication.user) {
                    Authentication.user = $window.sessionStorage.user;
                }
                if (!Authentication.userRole) {
                    Authentication.userRole = $window.sessionStorage.userRole;
                }
            }
        });

        $rootScope.$on('$routeChangeSuccess', function (event, nextRoute, currentRoute) {
            $rootScope.showMenu = Authentication.isLoggedIn;
            $rootScope.role = Authentication.userRole;
            if (Authentication.isLoggedIn && $location.path() === '/login') {
                $location.path('/');
            }
        });

        $rootScope.online = navigator.onLine;
        $window.addEventListener("offline", function () {
            $log.debug("offline0");
            $rootScope.$apply(function () {
                $rootScope.online = false;
            });
        }, false);

        $window.addEventListener("online", function () {
            $log.debug("online0");
            $rootScope.$apply(function () {
                $rootScope.online = true;
            });
        }, false);

        var sync = function () {
            var top = PatientRule.listDirty().pop();
            $log.debug('storage dirty top', top);
            if (!top) {
                $rootScope.sync = false;
                $log.info('refresh after sync');
                $location.path('/search');
                return;
            }
            $rootScope.sync = true;
            $log.debug('sync', top._id);
            return PatientService.save(top);
        };

        var recursiveSync = function () {
            $log.debug('recursive');
            var lastResponse = sync();
            if (lastResponse) {
                lastResponse.then(recursiveSync).catch(function (responseError) {
                    $log.error('Failed to sync', responseError);
                });
            }
        };

        $rootScope.$watch('online', function (newValue) {
            if (!newValue) {
                $log.debug('offline1');
                return;
            }
            $log.debug('online1');
            recursiveSync();
        });

        $rootScope.$watch('sync', function (newValue, oldValue) {
            $log.debug('sync...', newValue, '->', oldValue);
        });
    });