angular.module('ccdb.patient.list.directive', ['ccdb.patient.service', 'ccdb.utils.age.filter'])

    .directive('ccdbPatientList', function () {
        return {
            restrict: 'E',
            templateUrl: 'patient/patient.list.html',

            scope: {
                title: '@',
                filter: '@',
                buttons: '@',
                query: '=',
                listLength: '@'
            },

            link: function (scope) {
                scope.btns = ['View'].concat(scope.buttons? scope.buttons.split(','): []);
            },

            controller: function ($scope, $location, PatientService, $attrs) {

                if ($attrs.filter) {
                    if($attrs.listLength) {
                        PatientService.patients($scope.filter, $scope.listLength).then(function (patients) {
                            $scope.patients = patients;
                            $scope.count = patients.length;
                        });
                    } else {
                        PatientService.patients($scope.filter).then(function (patients) {
                            $scope.patients = patients;
                            $scope.count = patients.length;
                        });
                    }
                }

                if ($attrs.query) {
                    $scope.$watch('query', function () {
                        PatientService.search($scope.query, $scope.listLength).then(function (patients) {
                            $scope.patients = patients;
                        });
                    });
                }

                $scope.act = function (task, patient) {
                    if (task === 'View') {
                        $location.path('/patient/' + patient._id);
                    } else if (task === 'Edit') {
                        return $location.path('/editPatient/' + patient._id).hash('Patient details');
                    } else if (task === 'Admit') {
                        return $location.path('/editPatient/' + patient._id).hash('Admission details');
                    } else if (task === 'Discharge') {
                        return $location.path('/editPatient/' + patient._id).hash('Discharge');
                    }
                };
            }
        };
    })
;
