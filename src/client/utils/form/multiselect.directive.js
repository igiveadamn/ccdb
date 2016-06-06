angular.module('ices.utils.form.multiselect.directive', ['checklist-model'])

    .directive('icesFormMultiselect', function () {
        return {
            restrict: 'E',
            templateUrl: 'utils/form/multiselect.html',

            scope: {
                label: '@',
                options: '=',
                value: '='
            }
        };
    })
;
