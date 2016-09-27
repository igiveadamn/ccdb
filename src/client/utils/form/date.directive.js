angular.module('ccdb.utils.form.date.directive', ['ccdb.utils.form.date.helper'])
    .directive('ccdbFormDate', function (dateHelper) {
        return {
            restrict: 'E',
            templateUrl: 'utils/form/date.html',
            require: 'ngModel',
            scope: {
                label: '@'
            },

            link: function (scope, element, attrs, ngModel) {
                ngModel.$render = dateHelper.dateRender(ngModel, scope);
                scope.modelChanged = dateHelper.dateModelChanged(ngModel, scope);

                scope.dates = dateHelper.dates;
                scope.months = dateHelper.months;
                scope.years = dateHelper.years;
            }
        };
    })
;
