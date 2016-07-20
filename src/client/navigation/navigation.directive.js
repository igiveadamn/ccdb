angular.module('ccdb.navigation', ['ccdb.authentication.authentication', 'ccdb.authentication.user.authentication', 'ui.bootstrap'])

  .directive('navigation', function navigation($http, Authentication, UserAuthentication) {
    return {
      restrict: 'E',
      templateUrl: 'navigation/navigation.html',

      controller: function controller($rootScope) {
        $rootScope.isLoggedIn = Authentication.isLoggedIn;
        $rootScope.loggedInUser = Authentication.user;

        $rootScope.logout = function logout() {
          UserAuthentication.logout();
          $rootScope.isLoggedIn = Authentication.isLoggedIn;
          $rootScope.loggedInUser = null;
        };

        $rootScope.downloadPatient = function downloadPatient() {
          $http({ method: 'GET', url: '/downloads/csv/patients' })
            .success(function (data, status, headers, config) {
            var anchor = angular.element('<a/>');
            anchor.attr({
              href: 'data:attachment/csv;charset=utf-8,' + encodeURI(data),
              target: '_blank',
              download: 'patients-data.csv'
            })[0].click();

          });
          /*
           // TODO: error not handled, can we do anything meaningful?
           .
           error(function(data, status, headers, config) {
           // handle error
           });
           */
        };

        // $rootScope.downloadPatientScores = function downloadPatientScores() {
        //   $http({ method: 'GET', url: '/downloads/csv/scores' })
        //     .success(function (data, status, headers, config) {
        //       var anchor = angular.element('<a/>');
        //       anchor.attr({
        //         href: 'data:attachment/csv;charset=utf-8,' + encodeURI(data),
        //         target: '_blank',
        //         download: 'patients-data-scores.csv'
        //       })[0].click();
        //
        //     });
        // };
      }
    };
  });
