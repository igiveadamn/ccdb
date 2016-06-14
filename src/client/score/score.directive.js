angular.module('ccdb.score.directive', [])

    .directive('ccdbScore', function () {
        return {
            restrict: 'E',
            templateUrl: 'score/score.html',
            scope: {
                score: '='
            }
        };
    })
;
