angular.module('ccdb.score.form.directive', [])

    .directive('ccdbScoreForm', function () {
        return {
            restrict: 'E',
            templateUrl: 'score/score.form.html',
            scope: {
                score: '=',
                referral: '@',
                admission: '@',
                apache: '@'
            }
        };
    })
;
