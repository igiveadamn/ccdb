angular.module('ices.score.directive', [])

    .directive('icesScore', function () {
        return {
            restrict: 'E',
            templateUrl: 'score/score.html',
            scope: {
                score: '='
            }
        };
    })
;
