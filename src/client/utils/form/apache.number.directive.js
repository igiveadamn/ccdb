angular.module('ccdb.utils.form.apache.number.directive', [])

    .directive('ccdbFormApacheNumber', function () {
        return {
            restrict: 'E',
            templateUrl: 'utils/form/apache.number.html',

            scope: {
                label: '@',
                placeholder: '@',
                field: '@',
                required: '='
            }
        };
    }
);
