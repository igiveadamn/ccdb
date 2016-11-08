angular.module('ccdb.utils.form.number.directive', [])

    .directive('ccdbFormNumber', function () {
        return {
            restrict: 'E',
            templateUrl: 'utils/form/number.html',

            scope: {
                label: '@',
                placeholder: '@',
                value: '=',
                required: '='
            }
        };
    }
);
