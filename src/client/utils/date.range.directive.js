angular.module('ccdb.date.range.directive', ['ccdb.date.range.service'])

    .directive('ccdbDateRange', function (DateRangeService) {
        return {
            restrict: 'E',
            templateUrl: 'utils/date.range.html',

            link: function (scope) {
                scope.dateRangeService = DateRangeService;
            }
        };
    })
;
