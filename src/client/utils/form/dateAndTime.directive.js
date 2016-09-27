angular.module('ccdb.utils.form.dateAndTime.directive', ['ccdb.utils.form.date.helper'])
    .directive('ccdbFormDateAndTime', function (dateHelper) {
        return {
            restrict: 'E',
            templateUrl: 'utils/form/dateAndTime.html',
            require: 'ngModel',
            scope: {
                label: '@'
            },

            link: function (scope, element, attrs, ngModel) {
              ngModel.$render = dateHelper.dateTimeRender(ngModel, scope);
              scope.modelChanged = dateHelper.dateTimeModelChanged(ngModel, scope);

              scope.dates = dateHelper.dates;
              scope.months = dateHelper.months;
              scope.years = dateHelper.years;
              scope.hours = dateHelper.hours;
              scope.minutes = dateHelper.minutes;
            }
        };
    })
;
