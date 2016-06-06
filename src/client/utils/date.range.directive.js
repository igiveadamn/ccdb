angular.module('ices.date.range.directive', ['ices.date.range.service'])

    .directive('icesDateRange', function (DateRangeService) {
        return {
            restrict: 'E',
            templateUrl: 'utils/date.range.html',

            link: function (scope) {
                scope.dateRangeService = DateRangeService;
            }
        };
    })
;
