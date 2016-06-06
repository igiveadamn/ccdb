angular.module('ices.patient.count.directive', ['ices.date.range.service', 'ices.patient.service'])

    .directive('icesPatientCount', function (DateRangeService, PatientService) {
        return {
            restrict: 'E',
            templateUrl: 'patient/patient.count.html',
            scope: {
                title: '@',
                filter: '@',
                rangeField: '@'
            },

            link: function (scope) {
                var update = function (dateRange) {
                    console.log('patient count being update with new dateRange :: ' + dateRange);

                    PatientService.patients(scope.filter, true, dateRange, scope.rangeField).then(function (count) {
                        scope.count = count;
                    });
                };

                DateRangeService.addListener(update);

                update(DateRangeService.dateRange);
            }
        };
    })
;
