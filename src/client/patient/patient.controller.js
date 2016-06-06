angular.module('ices.patient.controller', ['ngRoute', 'ices.patient.service', 'ices.utils.form'])

    .config(function ($routeProvider) {
        $routeProvider.when(
            '/patient/:patientId',
            {
                templateUrl: 'patient/patient.html',
                controller: 'PatientController',
                access: {
                    requiredLogin: true
                }
            }
        );
        $routeProvider.when(
            '/editPatient/:patientId',
            {
                templateUrl: 'patient/patient.form.html',
                controller: 'PatientController',
                access: {
                    requiredLogin: true
                }
            }
        );
    })

    .controller('PatientController', function ($scope, $location, $routeParams, $filter, $anchorScroll, $timeout, PatientService) {

        var patientId = $routeParams.patientId;

        $timeout(function () {
            $anchorScroll();
            $(document).foundation();
        });

        var score = function(patient) {
          patient.newScore = [];
          patient.addScore = function () {
            patient.newScore.push({
              score: score.newScore
            });
          };
        };

        function initialisePatient(patient) {
            patient.referral = patient.referral || {};
            patient.admission = patient.admission || {};
            patient.scores = patient.scores || [{ notes: 'Referral Score' }, { notes: 'Admission Score' }];
            patient.discharge = patient.discharge || {};
            return patient;
        }

        if (patientId === 'new') {
            $scope.patient = initialisePatient({});
        } else {
            PatientService.patient(patientId)
                .then(function (patient) {
                    $scope.patient = initialisePatient(patient);
                })
                .catch(function (error) {
                    console.log('error'.error);
                }
            );
        }

        $scope.edit = function () {
            return $location.path('/editPatient/' + $scope.patient._id).hash('Patient details');
        };

        $scope.save = function () {
            PatientService.save($scope.patient)
                .then(function (patient) {
                    $location.path('/dashboard');
                })
                .catch(function (error) {
                    console.log('error'.error);
                }
            );
        };

        // common
        $scope.yesNo = ['Yes', 'No'];
        $scope.outcomes = ['Admitted', 'Not Admitted'];
        $scope.operativeStatuses = ['Pre-', 'Intra-', 'Post-', 'Non-'];

        // patient details
        $scope.genders = ['Male', 'Female'];
        $scope.races = ['Black African', 'Coloured', 'Indian or other Asian', 'White'];

        // referral
        $scope.finalOutcomeNote = ['Admitted', 'Not admitted'];
        $scope.motorResponse = ['1', '2' , '3', '4', '5', '6'];
        $scope.verbalResponse = ['1', '2', '3', '4', '5'];
        $scope.levelOfCareRequired = ['ICU', 'High Care'];
        $scope.sCCM = ['1', '2', '3', '4a', '4b'];
        $scope.sccmScore = ['1', '2', '3'];
        $scope.revisedScccm = ['1', '2', '3', '4a', '4b'];
        $scope.operativeStatusAtTimeOfReferral = ['Pre-op', 'Post-op', 'Intra-op', 'Not for surgery'];
        $scope.referralToICU = ['Sepsis', 'Airway', 'Respiratory', 'Cardiac', 'Renal', 'Metabolic', 'Neurological', 'Bleeding', 'Polytrauma', 'Pain', 'Perioperative physiological support'];
        $scope.roots = ['Emergency', 'Elective'];
        $scope.baseDisciplines = ['Anaesthetics', 'Orthodontics', 'Paediatrics', 'Obstetrics'];
        $scope.comorbidities = ['None', 'Unknown', 'Chronic cardiovascular disease', 'Chronic respiratory disease', 'Diabetes Mellitus', 'HIV positive', 'HIV positive on HAART', 'Chronic renal failure/haemodialysis', 'Hepatic failure', 'Cirrhosis', 'Lymphoma', 'Metastatic cancer', 'Leukaemia/Multiple myeloma', 'Immunosupression', 'Neurological', 'Other'];
        $scope.diagnosisTypes = ['Infectious', 'Non-communicable', 'Trauma'];
        $scope.diagnosis = ['Cardiovascular', 'Respiratory', 'Neurological', 'Gastrointestinal', 'Metabolic', 'Haematological', 'Genitourinary', 'Musculoskeletal', 'Skin'];
        $scope.diagnosisDetails = ['Describe diagnosis details'];
        $scope.complications = ['Operation',  'Anaesthesia '];
        $scope.levelsOfCare = ['ICU', 'High Care'];
        $scope.decision = ['Admit', 'Do not admit', 'Can not make decision now'];
        $scope.patientLocation = ['Ward', 'Emergency unit', 'Theatre', 'Others'];
        $scope.reasonOfReferralToICU = ['Sepsis', 'Airway', 'Respiratory', 'Cardiac', 'Renal', 'Metabolic', 'Neurological', 'Bleeding', 'Polytrauma', 'Pain', 'Perioperative physiological support'];
        $scope.referralForComplicationOf = ['Surgical procedure', 'Anaesthesia', 'Underlying comorbidities', 'Acute pathology'];
        $scope.CurrentPatientLocation = ['Emergency department', 'Ward', 'theatre', 'Another hospital'];
        // admission
        $scope.eyeOpening = ['1', '2', '3', '4'];
        $scope.delayReasons = ['No bed', 'No staff', 'Decision making'];
        $scope.admissionFailureReasons = ['Became too well', 'Became too sick', 'Transferred to another unit', 'Died', 'Referral withdrawn'];

        // discharge
        $scope.dischargeStatuses = ['Alive', 'Deceased'];
        // operative
        $scope.operativeDetails = ['Pre-op', 'Post-op', 'Non-operative'];
    });
