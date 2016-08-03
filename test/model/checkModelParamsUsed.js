var expect = require('chai').expect;
var schema = require('../../src/server/models/schema');
var _ = require('lodash');

var contains = function (iterable, item) { return _.filter(iterable, function (i) { return i === item; }).length > 0 };

describe('Model attributes', function () {
  it('uses all model attributes in html files', function () {
    var IGNORED_FIELDS = ['_id', '__v'];
    var columns = _.filter(_.keys(schema.patientSchema.paths), function (k) {
      return !contains(IGNORED_FIELDS, k);
    });
    // Load all html files and extract their form value/ng-model
    
    expect('test').to.equal('fail');
  });
});

