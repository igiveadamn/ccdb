angular.module('ccdb.patient.controller', ['ngRoute', 'ccdb.patient.service', 'ccdb.utils.form'])

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
            '/newReferral/:type',
            {
                templateUrl: 'referral/referral.form.html',
                controller: 'PatientController',
                access: {
                    requiredLogin: true
                }
            }
        );
        $routeProvider.when(
            '/admitPatient/:patientId',
            {
                templateUrl: 'admission/admission.form.html',
                controller: 'PatientController',
                access: {
                    requiredLogin: true
                }
            }
        );
        $routeProvider.when(
            '/scorePatient/:patientId',
            {
                templateUrl: 'score/score.html',
                controller: 'PatientController',
                access: {
                    requiredLogin: true
                }
            }
        );
        $routeProvider.when(
            '/dischargePatient/:patientId',
            {
                templateUrl: 'discharge/discharge.form.html',
                controller: 'PatientController',
                access: {
                    requiredLogin: true
                }
            }
        );
    })

    .controller('PatientController', function ($scope, $location, $routeParams, $filter, $anchorScroll, $timeout, PatientService) {

      var patientId = $routeParams.patientId || 'new';
      var referralType = $routeParams.type;

      function initialiseScores() {
        // referral (subset of values)
        // admission (subset of values)
        // 2 scores together after 24 hours (for an APACHE score)
        return [
          {notes: 'Referral Score'},
          {notes: 'Admission Score'},
          {notes: 'Apache Score Low'},
          {notes: 'Apache Score High'}
        ];
      }

      function initialisePatient(patient) {
            patient.referral = patient.referral || {};
            patient.admission = patient.admission || {};
            patient.scores = patient.scores || initialiseScores();
            patient.discharge = patient.discharge || {};
            return patient;
        }

        if (patientId === 'new') {
            $scope.patient = initialisePatient({});
            $scope.patient.referral.emergencyVsElective = referralType;
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

        // TODO: this is sample data from the schema and should not be stored here
        var admission = {
          admissionDateAndTime: 'Admission date and time',
          surgeryDateAndTime: 'Surgery date and time',
          operativeDetails: 'Operative details',
          operativeFindings: 'Operative findings',
          operationPerformed: 'Operation performed',
          operativePlan: 'Operative plan',
          admissionSummaryNotes:'Admission summary notes',
          admittingConsultant: 'Admitting consultant',
        };

        // TODO: save only currently works for admission. Work required to wire it up for the other form types
        $scope.save = function () {
           function missingData() {
             function dataNotProvided(field) {
               return providedData.indexOf(field) < 0;
             }
             function mapToDisplayName(field) {
               return admission[field];
             }
             var requiredData = Object.keys(admission);
             var providedData = Object.keys($scope.patient.admission);

             return requiredData.filter(dataNotProvided).map(mapToDisplayName);
           }

            if (missingData().length > 0) {
              $scope.missingFields = missingData();
              $location.path('/admitPatient/' + patientId);
            } else {
              PatientService.save($scope.patient)
                  .then(function () {
                      $location.path('/dashboard');
                  })
                  .catch(function (error) {
                      console.log('error'.error);
                  }
              );
            }
        };

        // common
        $scope.yesNo = ['Yes', 'No'];

        // patient details
        $scope.genders = ['Male', 'Female'];
        $scope.races = ['Black African', 'Coloured', 'Indian or other Asian', 'White'];

        // referral
        $scope.operativeStatusAtTimeOfReferral = ['Pre-op', 'Post-op', 'Intra-op', 'Not for surgery'];
        $scope.patientLocation = ['Ward', 'Emergency Unit', 'Theatre', 'Another Hospital', 'Other'];
        $scope.levelsOfCare = ['ICU', 'High Care'];
        $scope.reasonOfReferralToICU = ['Sepsis', 'Airway', 'Respiratory', 'Cardiac', 'Renal', 'Metabolic', 'Neurological', 'Bleeding', 'Polytrauma', 'Pain', 'Perioperative physiological support'];
        $scope.diagnosisTypes = ['Infectious', 'Non-communicable', 'Trauma'];
        $scope.diagnosis = ['Cardiovascular', 'Respiratory', 'Neurological', 'Gastrointestinal', 'Metabolic', 'Haematological', 'Genitourinary', 'Musculoskeletal', 'Skin'];
        $scope.comorbidities = ['None', 'Unknown', 'Chronic cardiovascular disease', 'Chronic respiratory disease', 'Diabetes Mellitus', 'HIV positive', 'HIV positive on HAART', 'Chronic renal failure/haemodialysis', 'Hepatic failure', 'Cirrhosis', 'Lymphoma', 'Metastatic cancer', 'Leukaemia/Multiple myeloma', 'Immunosupression', 'Neurological', 'Other'];
        $scope.referralForComplicationOf = ['Surgical procedure', 'Anaesthesia', 'Underlying comorbidities', 'Acute pathology'];
        $scope.sCCM = ['1', '2', '3', '4a', '4b'];
        $scope.decision = ['Admit', 'Do not admit', 'Can not make decision now'];
        $scope.revisedScccm = ['1', '2', '3', '4a', '4b'];
        $scope.delayReasons = ['No bed', 'No staff', 'Decision making'];
        $scope.finalOutcome = ['Admitted', 'Not admitted'];
        $scope.admissionFailureReasons = ['Became too well', 'Became too sick', 'Transferred to another unit', 'Died', 'Referral withdrawn']; // if patient is decision:admit but not admitted

        $scope.referralToICU = ['Sepsis', 'Airway', 'Respiratory', 'Cardiac', 'Renal', 'Metabolic', 'Neurological', 'Bleeding', 'Polytrauma', 'Pain', 'Perioperative physiological support'];
        $scope.baseDisciplines = ['Anaesthetics', 'Orthodontics', 'Paediatrics', 'Obstetrics'];
        $scope.complications = ['Operation',  'Anaesthesia '];

        // admission
        $scope.operativeDetails = ['Pre-op', 'Post-op', 'Non-operative'];

        //scores
        $scope.eyeOpening = ['1', '2', '3', '4'];
        $scope.verbalResponse = ['1', '2', '3', '4', '5'];
        $scope.motorResponse = ['1', '2' , '3', '4', '5', '6'];
        $scope.airway = ['Own', 'OPA', 'NPA', 'ETT', 'Tracheostomy'];

        // discharge
        $scope.dischargeStatuses = ['Alive', 'Deceased'];
    });
