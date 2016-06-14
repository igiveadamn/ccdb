angular.module('ccdb.utils.form.multiselect.directive', ['checklist-model'])

    .directive('ccdbFormMultiselect', function () {
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
