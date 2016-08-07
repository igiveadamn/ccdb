angular.module('ccdb.utils.form.number.directive', ['ccdb.patient.service', 'ui.bootstrap'])

    .directive('ccdbFormNumber', function () {
        return {
            restrict: 'E',
            templateUrl: 'utils/form/number.html',

            scope: {
                label: '@',
                placeholder: '@',
                value: '=',
                noSuggestions: '@'
            }
        };
    }
);
