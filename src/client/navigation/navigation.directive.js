angular.module('ccdb.navigation', ['ccdb.authentication.authentication', 'ccdb.authentication.user.authentication', 'ui.bootstrap'])

  .directive('navigation', function navigation(Authentication, UserAuthentication) {
    return {
      restrict: 'E',
      templateUrl: 'navigation/navigation.html',

      controller: function controller($rootScope) {
        $rootScope.isLoggedIn = Authentication.isLoggedIn;
        $rootScope.logout = function logout() {
          UserAuthentication.logout();
          $rootScope.isLoggedIn = Authentication.isLoggedIn;
        };
      }
    };
  });
