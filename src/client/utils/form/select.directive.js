angular.module('ccdb.utils.form.select.directive', [])

    .directive('ccdbFormSelect', function () {
        return {
            restrict: 'E',
            templateUrl: 'utils/form/select.html',

            scope: {
                label: '@',
                options: '=',
                value: '='
            }
        };
    })
;
