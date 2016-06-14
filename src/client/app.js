angular.module('ccdb',
    [
        'ngRoute',
        'angularCombine',
        'ccdb.authentication.authentication',
        'ccdb.authentication.token.interceptor',
        'ccdb.cache.localStorage.interceptor',
        'ccdb.authentication.user.authentication',
        'ccdb.dashboard',
        'ccdb.date.range.directive',
        'ccdb.date.range.service',
        'ccdb.login',
        'ccdb.navigation',
        'ccdb.password',
        'ccdb.patient',
        'ccdb.patient.list.directive',
        'ccdb.patient.count.directive',
        'ccdb.search',
        'ccdb.score.directive',
        'ccdb.scores.directive',
        'ccdb.reset',
        'ccdb.user',
        'ccdb.utils.age.filter',
        'ccdb.utils.localStorage.factory',
        'ui.bootstrap'
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