angular.module('ccdb.patient.list.directive', ['ccdb.patient.service', 'ccdb.utils.age.filter'])

    .directive('ccdbPatientList', function () {
        return {
            restrict: 'E',
            templateUrl: 'patient/patient.list.html',

            scope: {
                title: '@',
                filter: '@',
                buttons: '@',
                query: '='
            },

            link: function (scope) {
                scope.btns = scope.buttons ? scope.buttons.split(',') : [];
            },

            controller: function ($scope, $location, PatientService, $attrs) {

                if ($attrs.filter) {
                    PatientService.patients($scope.filter).then(function (patients) {
                        $scope.patients = patients;
                        $scope.count = patients.length;
                    });
                }

                if ($attrs.query) {
                    $scope.$watch('query', function () {
                        PatientService.search($scope.query).then(function (patients) {
                            $scope.patients = patients;
                        });
                    });
                }

                $scope.act = function (task, patient) {
                    if (task === 'View') {
                        $location.path('/patient/' + patient._id);
                    } else if (task === 'Referral' || task === 'Outcome') {
                        return $location.path('/referral/' + patient._id);
                    } else if (task === 'Admit' || task === 'Admission') {
                        return $location.path('/admitPatient/' + patient._id);
                    } else if (task === 'Score') {
                        return $location.path('/scorePatient/' + patient._id);
                    } else if (task === 'Discharge') {
                        return $location.path('/dischargePatient/' + patient._id);
                    }
                };
            }
        };
    })
;
