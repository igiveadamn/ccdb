angular.module('ices.cache.localStorage.interceptor', ['ices.utils.localStorage.factory'])
    .factory('LocalStorageInterceptor', function ($q, LocalStorage, $rootScope, $log) {
        function isPatientCall(config) {
            return _.startsWith(config.url, '/api/patient/') && config.url.indexOf('/api/patient/suggestions') < 0;
        }

        function isPatientUpdate(config) {
            return isPatientCall(config) && config.method === 'POST';
        }

        return !localStorageFeature ? {} : {
            request: function (config) {
                if (isPatientUpdate(config)) {
                    var patient = config.data.patient;
                    if (LocalStorage.drop(config.url, patient._id)) {
                        patient._id = null;
                    }
                    $log.debug('req', config);
                }
                return config;
            },

            response: function (response) {
                var config = response.config;
                if (isPatientCall(config)) {
                    $log.debug('res', response);
                    $rootScope.status = response.status;
                    var originalOnlineStatus = $rootScope.online;
                    $rootScope.online = true;
                    if (originalOnlineStatus) {
                        LocalStorage.refresh(config.url, config.method, config.params, response);
                    }
                }
                return response;
            },

            responseError: function (response) {
                $rootScope.status = response.status;
                $rootScope.online = false;
                var config = response.config;

                if (isPatientUpdate(config)) {
                    LocalStorage.write(config.url, config.data.patient);
                    $log.debug('write cache', config, response);
                }

                if (response.status === 0 && config.method === 'GET') {
                    response.data = LocalStorage.read(config.url, config.params);
                    $log.debug('read cache', config.url, response.data);
                }
                return response;
            }
        };
    });
