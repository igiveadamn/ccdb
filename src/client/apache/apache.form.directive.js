angular.module('ccdb.apache.form.directive', [])

  .directive('ccdbApacheForm', function () {
    return {
      restrict: 'E',
      templateUrl: 'apache/apache.form.html',
      scope: {
        patient: '='
      }
    };
  })
;
