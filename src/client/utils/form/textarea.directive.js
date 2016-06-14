angular.module('ccdb.utils.form.textarea.directive', [])

    .directive('ccdbFormTextarea', function () {
        return {
            restrict: 'E',
            templateUrl: 'utils/form/textarea.html',

            scope: {
                label: '@',
                value: '='
            },

            link: function (scope, element, attrs) {
            },

            controller: function ($scope) {
            }
        };
    })
;
