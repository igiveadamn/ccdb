angular.module('ccdb.scores.directive', ['ccdb.patient', 'ccdb.score.directive'])

    .directive('ccdbScores', function () {
        return {
            restrict: 'E',
            templateUrl: 'score/scores.html',
            scope: false
        };
    })
;
