//var localStorageFeature = true;
//
//angular.module('ccdb.utils.localStorage.factory', ['ngStorage'])
//    .factory('StorageService', function ($localStorage, $log) {
//        var store = function (namespace, data, markAsDirty) {
//            if (_.isUndefined(namespace)) {
//                $log.debug('not traced url', url);
//                return;
//            }
//            var storage = $localStorage[namespace] || {};
//            if (_.isArray(data)) {
//                _.each(data, function (one) {
//                    if (one._id) {
//                        storage[one._id] = one;
//                        $log.debug('storage update', namespace, one._id);
//                    } else {
//                        $log.error('item in array without _id', one);
//                    }
//                });
//                $localStorage[namespace] = storage;
//            } else if (_.isObject(data) && (data._id || markAsDirty)) {
//                if (markAsDirty) {
//                    data._id = data._id || newId();
//                    data._dirty = true;
//                }
//                storage[data._id] = data;
//                $log.debug('storage update', namespace, data._id);
//                $localStorage[namespace] = storage;
//            } else {
//                $log.debug('non-obj type', typeof data, data);
//            }
//        };
//
//        var newId = function () {
//            return 'NEW_xxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
//                return v.toString(16);
//            });
//        };
//
//
//        return !localStorageFeature ? {} : {
//            store: store,
//            load: function (namespace, id) {
//                return $localStorage[namespace][id];
//            },
//            list: function (namespace, dirtyOnly) {
//                var all = $localStorage[namespace];
//                if (dirtyOnly) {
//                    all = _.filter(all, {_dirty: true});
//                }
//                return _.map(all, function (val) {
//                    return val;
//                });
//            },
//            destroy: function (namespace, id) {
//                if (!_.has($localStorage[namespace], id)) {
//                    throw new Error('Unable to drop something is gone');
//                }
//                delete $localStorage[namespace][id];
//                return _.startsWith(id, 'NEW_');
//            }
//        };
//    })
//    .factory('LocalStorage', function ($q, $log, PatientRule, UserRule) {
//        var rules = [PatientRule, UserRule];
//        var findRuleObject = function (url) {
//            for (var index in rules) {
//                var rule = rules[index];
//                if (rule.isBelonging(url)) {
//                    return rule;
//                }
//            }
//            $log.warn('No rule was set', url);
//            return null;
//        };
//        return !localStorageFeature ? {} : {
//            refresh: function (url, method, params, response) {
//                findRuleObject(url).refresh(response.data);
//                return $q.when(response);
//            },
//            read: function (url, params) {
//                return findRuleObject(url).load(url, params);
//            },
//            write: function (url, data) {
//                return findRuleObject(url).save(data);
//            },
//            /*
//             *  Return:
//             *       True -> Local object
//             *       False -> Remote object
//             */
//            drop: function (url, id) {
//                return findRuleObject(url).drop(id);
//            }
//        };
//    })
//    .factory('PatientRule', function (StorageService, $log) {
//        var namespace = 'patient';
//        var matchProperty = function (entity, propName, query) {
//            return entity[propName] && entity[propName].indexOf(query) >= 0;
//        };
//        var queryPatient = function (patient, query) {
//            return matchProperty(patient, 'firstName', query) ||
//                matchProperty(patient, 'lastName', query) ||
//                matchProperty(patient, 'reference', query);
//        };
//        return {
//            isBelonging: function (url) {
//                return /\/api\/patient\/.*/.test(url);
//            },
//            refresh: function (data) {
//                return StorageService.store(namespace, data);
//            },
//            load: function (url, params) {
//                if (params.patientId) {
//                    return StorageService.load(namespace, params.patientId);
//                } else if (/\/api\/patient\/search/.test(url)) {
//                    var list = StorageService.list(namespace);
//                    if (params.query) {
//                        return _.filter(list, function (patient) {
//                            return queryPatient(patient, params.query);
//                        });
//                    } else {
//                        return list;
//                    }
//                }
//                $log.warn('Nothing was found', url, params);
//                return null;
//            },
//            save: function (data) {
//                return StorageService.store(namespace, data, true);
//            },
//            drop: function (id) {
//                return StorageService.destroy(namespace, id);
//            },
//            listDirty: function () {
//                return StorageService.list(namespace, true);
//            }
//        };
//    })
//    .factory('UserRule', function (StorageService, $log) {
//        var namespace = 'user';
//        return {
//            isBelonging: function (url) {
//                return /\/api\/user\/.*/.test(url);
//            },
//            refresh: function (data) {
//                return StorageService.store(namespace, data);
//            }
//        };
//    });
//
