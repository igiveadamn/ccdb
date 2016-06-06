angular.module('ices.history.directive', [])

    .directive('icesHistory', function () {
        return {
            restrict: 'E',
            templateUrl: 'history/history.html',
            scope: {
                history: '='
            }
        };
    })
;
