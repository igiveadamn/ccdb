angular.module('ccdb.utils.form.text.directive', ['ccdb.patient.service', 'ui.bootstrap'])

    .directive('ccdbFormText', function (PatientService) {
        return {
            restrict: 'E',
            templateUrl: 'utils/form/text.html',

            scope: {
                label: '@',
                value: '=',
                noSuggestions: '@'
            },

            controller: function ($scope, $element, $attrs) {
                $scope.getSuggestions = function (text) {
                    if (!$scope.noSuggestions) {
                        return PatientService.getSuggestions($attrs.value.replace('patient.', ''), text)
                            .then(function (data) {
                                return data;
                            }
                        );
                    }
                };
            }
        };
    }
)
;
