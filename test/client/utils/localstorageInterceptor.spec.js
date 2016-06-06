describe('Local storage Interceptor', function () {
    'use strict';

    beforeEach(module('ices.cache.localStorage.interceptor'));
    var nativeLocalStorage, localStorageInterceptor;

    beforeEach(inject(function ($localStorage, LocalStorageInterceptor) {
        localStorageInterceptor = LocalStorageInterceptor;
        nativeLocalStorage = $localStorage;
        nativeLocalStorage.$reset();
    }));

    describe('when request', function () {
        var testObj = {_id: '_test'};
        var anotherObj = {_id: '_another'};
        var newObj = {_id: 'NEW_some_new'};
        var patientRequestConfig;
        beforeEach(function () {
            patientRequestConfig = {method: "POST", data: {patient: {_id: '_test'}}, url: "/api/patient/patient/"};
            nativeLocalStorage.patient = {
                _test: testObj,
                _another: anotherObj,
                NEW_some_new: newObj
            };
        });
        it('should drop patient from storage if it is updating patient', function () {
            localStorageInterceptor.request(patientRequestConfig);
            expect(nativeLocalStorage.patient._test).toBeUndefined();
            expect(nativeLocalStorage.patient._another).toBe(anotherObj);
        });

        it('should set _id to null if it is creating totally new patient', function () {
            patientRequestConfig.data.patient = newObj;
            var requestConfig = localStorageInterceptor.request(patientRequestConfig);

            expect(nativeLocalStorage.patient.NEW_some_new).toBeUndefined();
            expect(requestConfig.data.patient._id).toBeNull();
        });

        it('should not touch patient if it is not updating', function () {
            patientRequestConfig.method = 'GET';
            var patientRequestConfigClone = angular.copy(patientRequestConfig);
            var requestConfig = localStorageInterceptor.request(patientRequestConfig);

            expect(nativeLocalStorage.patient._test).toEqual(testObj);
            expect(nativeLocalStorage.patient._another).toEqual(anotherObj);
            expect(requestConfig).toEqual(patientRequestConfigClone);
        });
    });

    describe('when response', function () {
        var some = {_id: 'some_patient'};
        var patientResponse = {
            config: {url: "/api/patient/patient/"},
            data: some
        };

        it('should replace patient if it is exist', function () {
            nativeLocalStorage.patient = {some_patient: {}};
            localStorageInterceptor.response(patientResponse);
            expect(nativeLocalStorage.patient.some_patient).toEqual(some);
        });

        it('should save patient if it is not exist', function () {
            expect(nativeLocalStorage.patient).toBeUndefined();
            localStorageInterceptor.response(patientResponse);
            expect(nativeLocalStorage.patient.some_patient).toEqual(some);
        });
    });

    describe('when response error', function () {
        it('should save patient if it is updating, and mark as dirty', function () {
            var patientRequestConfig = {method: "POST", data: {patient: {_id: '_test'}}, url: "/api/patient/patient/"};
            localStorageInterceptor.responseError({config: patientRequestConfig});

            expect(nativeLocalStorage.patient._test).toEqual({_id: '_test', _dirty: true});
        });

        it('should save patient with NEW id, if it is creating, and mark as dirty', function () {
            var patientRequestConfig = {
                method: "POST",
                data: {patient: {_id: null, value: 'some value'}},
                url: "/api/patient/patient/"
            };
            localStorageInterceptor.responseError({config: patientRequestConfig});

            var key = _.keys(nativeLocalStorage.patient)[0];
            expect(_.startsWith(key, 'NEW_')).toBeTruthy();
            expect(nativeLocalStorage.patient[key].value).toEqual('some value');
            expect(nativeLocalStorage.patient[key]._dirty).toBeTruthy();
        });

        it('should read from cache if failed to GET', function () {
            var patientSearchConfig = {
                method: "GET",
                params: {query: "d"},
                url: "/api/patient/search/"
            };
            nativeLocalStorage.patient = {
                1: {firstName: 'd some'},
                2: {lastName: 'some d'}
            };
            var responseError = localStorageInterceptor.responseError({config: patientSearchConfig, status: 0});
            expect(responseError.data).toEqual([{firstName: 'd some'}, {lastName: 'some d'}]);
        });
    });
});