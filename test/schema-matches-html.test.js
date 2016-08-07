var fsWalker = require('../dev-utils/walk-filesystem');
var _ = require('lodash');
var schema = require('../src/server/models/schema');
var xml2js = require('xml2js');
var xmlParse = new xml2js.Parser({ strict: false }).parseString;
var fs = require('fs');
var async = require('async');

describe('Application consistency', function () {
  it('uses every property in the schema somewhere in the application', function (done) {
    fsWalker.paths(__dirname + '/../src/client', function (err, filepaths) {
      if (err) return done(err);
      var htmlFiles = _.filter(filepaths, isHtmlFile);
      var paths = getSchemaPaths();
      async.map(htmlFiles, fs.readFile, function (err, listFileContents) {
        if (err) return done(err);
        console.log('listOfFileContents[i]', String(listFileContents[3]));
        async.map([listFileContents[3]], xmlParse, function (err, listOfHtmlAsJson) {
          var attributePaths = _.flatten(_.map(listOfHtmlAsJson, extractAttributePaths));
          console.log('Attribute Paths: ', attributePaths);
          done();
        });
      });
    });
  });
});

function extractAttributePaths(htmlAsJson) {
  var attributePaths = [];

  // depth first search
  function extractAttributePathsIter(node) {

    // TODO: can't simply map the object because sometimes it's a list of objects sometimes it's an object
    // depending on if it has any children or not...
    _.map(node, function (v, k) {
      if (k === 'DIV') console.log('v: ', v);
      var cxForm = 'ccdb-form';
      if (k && k.constructor === String && k.substr(0, cxForm.length) === cxForm.toUpperCase()) {
        if(v[0] && v[0].$) {
          if (v[0].$['NG-MODEL']) {
            attributePaths.push(v[0].$['NG-MODEL'])
          } else if (v[0].$.VALUE) {
            attributePaths.push(v[0].$.VALUE)
          }
        }
      }
      if (k && k.constructor === String && k !== '$') {
        console.log('Key recursing on: ', k);
        extractAttributePathsIter(v);
      }
    });
  }

  extractAttributePathsIter(htmlAsJson);
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
  var paths = _.filter(_.keys(schema.patientSchema.paths), function (k) {
    return !contains(IGNORED_FIELDS, k);
  });
  return paths;
}