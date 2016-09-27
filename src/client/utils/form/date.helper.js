angular.module('ccdb.utils.form.date.helper', [])
.factory('dateHelper', function () {

  function zeroPad(n, l) {
    if (l) {
      return ('00' + n).slice(-l);
    }
    return n;
  }

  function range(a, z, l) {
    var list = [];
    for (; a <= z; a++) {
      list.push(zeroPad(a, l));
    }
    return list;
  }

  function dateModelChanged(ngModel, scope) {
    return function (value) {
      if (value) {
        ngModel.$setViewValue(moment());
        ngModel.$render();
      } else {
        ngModel.$setViewValue(moment().date(scope.date).month(scope.month).year(scope.year).format());
      }
    };
  }

  function dateRender(ngModel, scope) {
    return function () {
      var modelValue = ngModel.$modelValue;
      if (modelValue) {
        scope.date = zeroPad(moment(modelValue).date(), 2);
        scope.month = moment(modelValue).month();
        scope.year = moment(modelValue).year();
      }
    };
  }

  function dateTimeModelChanged(ngModel, scope) {
    return function (value) {
      if (value) {
        ngModel.$setViewValue(moment());
        ngModel.$render();
      } else {
        ngModel.$setViewValue(moment().date(scope.date).month(scope.month).year(scope.year).hour(scope.hour).minute(scope.minute).format());
      }
    };
  }

  function dateTimeRender(ngModel, scope) {
    return function () {
      var modelValue = ngModel.$modelValue;
      if (modelValue) {
        scope.date = zeroPad(moment(modelValue).date(), 2);
        scope.month = moment(modelValue).month();
        scope.year = moment(modelValue).year();
        scope.hour = zeroPad(moment(modelValue).hour(), 2);
        scope.minute = zeroPad(moment(modelValue).minute(), 2);
      }
    };
  }

  return {
    dates: range(1, 31, 2),
    months: [
      {key: 0, value: 'January'},
      {key: 1, value: 'February'},
      {key: 2, value: 'March'},
      {key: 3, value: 'April'},
      {key: 4, value: 'May'},
      {key: 5, value: 'June'},
      {key: 6, value: 'July'},
      {key: 7, value: 'August'},
      {key: 8, value: 'September'},
      {key: 9, value: 'October'},
      {key: 10, value: 'November'},
      {key: 11, value: 'December'}
    ],
    years: range(1910, 2020),
    hours: range(0, 23, 2),
    minutes: range(0, 59, 2),
    dateModelChanged: dateModelChanged,
    dateRender: dateRender,
    dateTimeModelChanged: dateTimeModelChanged,
    dateTimeRender: dateTimeRender
  };
});
