angular.module('ices.utils.age.filter', [])

    .filter('ageFilter', function () {
        return function calculateAge(dateOfBirth) {
            var dob = new Date(dateOfBirth);
            var dateDiff = Date.now() - dob.getTime();
            var ageDate = new Date(dateDiff);
            return Math.abs(ageDate.getUTCFullYear() - 1970);
        };
    })
;
