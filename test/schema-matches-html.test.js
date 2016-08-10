var fsWalker = require('../dev-utils/walk-filesystem');
var _ = require('lodash');
var schema = require('../src/server/models/schema');
var xml2js = require('xml2js');
var xmlParse = new xml2js.Parser({ strict: false }).parseString;
var fs = require('fs');
var async = require('async');
var expect = require('chai').expect;

describe('Application consistency', function () {
  it('uses every property in the schema somewhere in the application', function (done) {
    fsWalker.paths(__dirname + '/../src/client', function (err, filepaths) {
      if (err) return done(err);
      var htmlFiles = _.filter(filepaths, isHtmlFile);
      var schemaPaths = getSchemaPaths();
      async.map(htmlFiles, fs.readFile, function (err, listFileContents) {
        if (err) return done(err);
        async.map(listFileContents, xmlParse, function (err, listOfHtmlAsJson) {
          var attributePaths = _.flatten(_.map(listOfHtmlAsJson, extractAttributePaths))
            .map(function (p) {
              var prefix = 'patient.';
              if (p.indexOf(prefix) === 0) {
                return p.substr(prefix.length, p.length);
              }
              return p;
            });
          // make a set of paths and a set of attribute paths
          var attPathSet = createSet(attributePaths);
          var schemaPathSet = createSet(schemaPaths);
          expect(attPathSet).to.deep.equal(schemaPathSet);
          done();
        });
      });
    });
  });
});

function createSet(xs) {
  var set = {};
  _.forEach(xs, function (p) {
    var v = {};
    v[p] = true;
    _.merge(set, v);
  });
  return set;
}

function extractAttributePaths(htmlAsJson) {
  var attributePaths = [];

  function iter(node) {
    _.forEach(node, function (value, key) {
      if (!key || key.constructor !== String) {
        return;
      }

      var cxForm = 'CCDB-FORM';
      if (key.substr(0, cxForm.length) === cxForm) {
        if (value.constructor === Array) {
          _.forEach(value, function (formElement) {
            if (formElement.$.VALUE) {
              attributePaths.push(formElement.$.VALUE);
            } else if (formElement.$['NG-MODEL']) {
              attributePaths.push(formElement.$['NG-MODEL']);
            }
          })
        } else {
          throw new Error('Did not expect ccdb-form-xxx to not be an array');
        }
      }

      value.constructor === Array ? _.forEach(value, function (v) {
        iter(v)
      }) : iter(value);
    })
  }

  iter(htmlAsJson);
  return attributePaths;
}

function contains(iterable, value) {
  return iterable.filter(function (v) {
      return v === value;
    }).length > 0;
}

function isHtmlFile(filepath) {
  var suffix = '.html';
  return filepath.substr(filepath.length - suffix.length, filepath.length - 1) === suffix;
}

function getSchemaPaths() {
  var IGNORED_FIELDS = ['_id', '__v'];
  return _.filter(_.keys(schema.patientSchema.paths), function (k) {
    return !contains(IGNORED_FIELDS, k);
  });
}