angular.module('ccdb.utils.form.apache.select.directive', [])

    .directive('ccdbFormApacheSelect', function () {
        return {
            restrict: 'E',
            templateUrl: 'utils/form/apache.select.html',

            scope: {
                label: '@',
                options: '=',
                field: '@',
                optional: '=',
                required: '='
            }
        };
    });
