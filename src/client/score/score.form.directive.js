angular.module('ices.score.form.directive', [])

    .directive('icesScoreForm', function () {
        return {
            restrict: 'E',
            templateUrl: 'score/score.form.html',
            scope: {
                score: '=',
                referral: '@',
                admission: '@'
            }
        };
    })
;
