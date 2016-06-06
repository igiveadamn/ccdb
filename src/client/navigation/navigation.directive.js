angular
  .module('ices.navigation', ['ices.authentication.authentication', 'ices.authentication.user.authentication'])

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
