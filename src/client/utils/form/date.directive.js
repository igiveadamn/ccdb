angular.module('ccdb.utils.form.date.directive', [])

    .directive('ccdbFormDate', function () {

        function range(a, z) {
            var list = [];
            for (; a <= z; a++) {
                list.push(a);
            }
            return list;
        }

        return {
            restrict: 'E',
            templateUrl: 'utils/form/date.html',
            require: 'ngModel',
            scope: {
                label: '@'
            },

            link: function (scope, element, attrs, ngModel) {

                // also need a directive that will set a related date field when another field gets a first value
                // e.g. first admitted date.

                ngModel.$render = function () {
                    var modelValue = ngModel.$modelValue;
                    if (modelValue) {
                        scope.date = moment(modelValue).date();
                        scope.month = moment(modelValue).month();
                        scope.year = moment(modelValue).year();
                    }
                };

                scope.modelChanged = function (value) {
                    if (value) {
                        value = moment();
                        ngModel.$setViewValue(value);
                        ngModel.$render();
                    } else {
                        ngModel.$setViewValue(moment().date(scope.date).month(scope.month).year(scope.year).format());
                    }
                };

                scope.dates = range(1, 31);

                scope.months = [
                    {key: 0, value: 'January'},
                    {key: 1, value: 'February'},
                    {key: 2, value: 'March'},
                    {key: 3, value: 'April'},
                    {key: 4, value: 'May'},
                    {key: 5, value: 'June'},
                    {key: 6, value: 'July'},
                    {key: 7, value: 'August'},
                    {key: 8, value: 'September'},
                    {key: 9, value: 'October'},
                    {key: 10, value: 'November'},
                    {key: 11, value: 'December'}
                ];

                scope.years = range(1910, 2020);
            }
        };
    })
;
