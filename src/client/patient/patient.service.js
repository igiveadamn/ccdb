angular.module('ccdb.patient.service', [])

    .factory('PatientService', function ($http) {

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
            getSuggestions : function(value, text) {
                return go($http.get, '/api/patient/suggestions/', { params: { value: value, text: text } });
            },

            save: function (patient) {
                return go($http.post, '/api/patient/patient/', { patient: patient });
            },

            patient: function (patientId) {
                return go($http.get, '/api/patient/patient/', { params: { patientId: patientId } });
            },

            patients: function (filter, countOnly, range, rangeField) {
                var params = {
                    filter: encodeURIComponent(filter),
                    countOnly: countOnly
                };
                if (range && rangeField) {
                    params.range = range;
                    params.rangeField = rangeField;
                }
                return go($http.get, '/api/patient/patients/', { params: params });
            },

            search: function (query) {
                return go($http.get, '/api/patient/search/', { params: { query : query } });
            }
        };
    }
)
;
