angular.module('ices.utils.form.select.directive', [])

    .directive('icesFormSelect', function () {
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
