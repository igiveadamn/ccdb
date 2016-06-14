var localStorageFeature = true;

describe('Local storage', function () {
    'use strict';

    beforeEach(module('ccdb.utils.localStorage.factory'));
    var localStorage, nativeLocalStorage, patientRule;

    beforeEach(inject(function (LocalStorage, $localStorage, PatientRule) {
        localStorage = LocalStorage;
        nativeLocalStorage = $localStorage;
        nativeLocalStorage.$reset();
        patientRule = PatientRule;
    }));

    describe('refresh', function () {
        it('should save patient into hash with _id as key', function () {
            localStorage.refresh('/api/patient/something', 'GET', {}, {
                data: {
                    _id: 'this is id',
                    value: 'some values'
                }
            });

            expect(nativeLocalStorage.patient).toEqual({
                'this is id': {
                    _id: 'this is id',
                    value: 'some values'
                }
            });
        });

        it('should replace exist patient with the save _id', function () {
            nativeLocalStorage.patient = {
                'this is id': {'some': 'thing'},
                'this is another id': {'some': 'thing else'}
            };
            localStorage.refresh('/api/patient/something', 'GET', {}, {
                data: {
                    _id: 'this is id',
                    value: 'some values'
                }
            });

            expect(nativeLocalStorage.patient).toEqual({
                'this is id': {_id: 'this is id', value: 'some values'},
                'this is another id': {'some': 'thing else'}
            });
        });

        it('should save patient list into hash one by one with _id as key', function () {
            localStorage.refresh('/api/patient/something', 'GET', {}, {
                data: [
                    {
                        _id: 'this is id',
                        value: 'some values'
                    }, {
                        _id: 'this is another id',
                        value: 'some values'
                    }, {
                        _id: 'this is the third id',
                        value: 'some values'
                    }
                ]
            });

            expect(nativeLocalStorage.patient).toEqual({
                'this is id': {
                    _id: 'this is id',
                    value: 'some values'
                }, 'this is another id': {
                    _id: 'this is another id',
                    value: 'some values'
                }, 'this is the third id': {
                    _id: 'this is the third id',
                    value: 'some values'
                }
            });
        });
    });

    describe('read', function () {
        beforeEach(function () {
            nativeLocalStorage.patient = {
                'some id': 'some value',
                'mislead': 'invalid one'
            };
        });
        it('should read single patient when query with id', function () {
            var patient = localStorage.read('/api/patient/patient/', {patientId: "some id"});
            expect(patient).toEqual('some value');
        });

        it('should list patients when search for all', function () {
            var list = localStorage.read('/api/patient/search/', {});
            expect(list).toEqual(['some value', 'invalid one']);
        });

        it('should return null when nothing was found', function () {
            var nothing = localStorage.read('/api/patient/nothing/', {});
            expect(nothing).toBeNull();
        });

        it('should list patients has matched reference, first/last name when search with query', function () {
            nativeLocalStorage.patient = {
                'some id': {'firstName': 'first fff name'},
                'second id': {'lastName': 'last fff'},
                'third id': {'reference': 'fffreference'},
                'fourth id': {'reference': 'nothing'}
            };
            var list = localStorage.read('/api/patient/search/', {query: 'fff'});
            expect(list).toEqual([{firstName: 'first fff name'}, {lastName: 'last fff'}, {reference: 'fffreference'}]);
        });

    });

    describe('write', function () {
        beforeEach(function () {
            nativeLocalStorage.patient = {
                'oneId': 'some value',
                'anotherId': 'some thing else'
            };
        });

        it('should update exist patient', function () {
            localStorage.write('/api/patient/patient/', {_id: 'oneId', firstName: 'fff', lastName: 'feng'});
            var list = localStorage.read('/api/patient/search/', {query: 'fff'});
            expect(list.length).toBe(1);
            expect(list[0].lastName).toBe('feng');
            expect(list[0]._dirty).toBeTruthy();
        });

        it('should create new patient with id start with "NEW_"', function () {
            localStorage.write('/api/patient/patient/', {firstName: 'fff', lastName: 'feng'});
            localStorage.write('/api/patient/patient/', {firstName: 'fff', lastName: 'feng2'});
            var list = localStorage.read('/api/patient/search/', {query: 'fff'});
            expect(list.length).toBe(2);
            expect(list[0]._id).toMatch(/NEW_\w+/);
            expect(list[0]._dirty).toBeTruthy();

            expect(list[1]._id).toMatch(/NEW_\w+/);
            expect(list[1]._dirty).toBeTruthy();

        });
    });

    describe('drop', function () {
        beforeEach(function () {
            nativeLocalStorage.patient = {
                'NEW_something': 'some value',
                'anotherId': 'some thing else'
            };
        });

        it('should return true if drop a local object', function () {
            var result = localStorage.drop('/api/patient/patient/', 'NEW_something');
            expect(result).toBeTruthy();
            expect(_.size(nativeLocalStorage.patient)).toBe(1);
            expect(nativeLocalStorage.patient.NEW_something).toBeUndefined();
        });

        it('should return false if drop a remote object', function () {
            var result = localStorage.drop('/api/patient/patient/', 'anotherId');
            expect(result).toBeFalsy();
            expect(_.size(nativeLocalStorage.patient)).toBe(1);
            expect(nativeLocalStorage.patient.anotherId).toBeUndefined();
        });

        it('should throw exception if drop something not exist', function () {
            var dropNone = function () {
                localStorage.drop('/api/patient/patient/', 'not_exist');
            };
            expect(dropNone).toThrowError('Unable to drop something is gone');
        });
    });

    describe('list dirty patient', function () {
        it('should list dirty patients only', function () {
            nativeLocalStorage.patient = {
                'this is id': {'some': 'thing'},
                'this  id': {'some': 'thing', _dirty: false},
                'this is another id': {'some': 'thing else', _dirty: true},
                'this is  id': {'some': 'thing else', _dirty: true}
            };
            var dirty = patientRule.listDirty();
            expect(dirty.length).toBe(2);
        });
    });
});
