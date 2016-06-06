angular.module('ices.scores.directive', ['ices.patient', 'ices.score.directive'])

    .directive('icesScores', function () {
        return {
            restrict: 'E',
            templateUrl: 'score/scores.html',
            scope: false
        };
    })
;
