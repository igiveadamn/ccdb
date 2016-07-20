var stream = require('stream');
var schema = require('../models/schema');
var _ = require('lodash');

var DELIMITER = ',';
var IGNORED_FIELDS = ['_id', '__v', 'scores'];

var patientsHandler = function (dbConn) {
  return function (req, res) {
    var cursor = dbConn.collection('patients').find({}).stream({ transform: JSON.stringify });
    var columns = _.filter(_.keys(schema.patientSchema.paths), function (k) {
      return !contains(IGNORED_FIELDS, k);
    });
    var titleRow = buildTitleRow(columns);
    res.write(titleRow);
    return cursor.pipe(transform(jsonToCsv(columns))).pipe(res);
  };
};

// TODO: make this pull out score data...
// var scoresHandler = function (dbConn) {
//   return function (req, res) {
//     var cursor = dbConn.collection('patients').find({}).stream({ transform: JSON.stringify });
//     var columns = _.filter(_.keys(schema.patientSchema.paths.scores.schema.paths), function (k) {
//       return !contains(['_id', '__v'], k);
//     });
//     var titleRow = buildTitleRow(columns);
//     res.write(titleRow);
//     // return cursor.pipe(transform(_.identity)).pipe(res);
//     return cursor.pipe(transform(jsonToCsv(columns))).pipe(res);
//   };
// };

function csvEscape(delimiter) {
  return function (value) {
    // If it contains a quote, escape it with a quote
    var escapedValue = String(value).replace(/"/g, '""');

    // If it contains particular characters, it needs wrapping in quotes
    if (escapedValue.indexOf(delimiter) !== -1 || escapedValue.indexOf('"') !== -1 || escapedValue.indexOf('\n') !== -1) {
      escapedValue = '"' + escapedValue + '"';
    }
    return escapedValue;
  };
}

function concatIfArray(value) {
  if (value && value.constructor === Array) {
    var joinDelimiter = DELIMITER === ',' ? ';' : ',';
    return value.join(joinDelimiter);
  }
  return value;
}

function buildTitleRow(patientSchemaProperties) {
  return patientSchemaProperties.map(csvEscape(DELIMITER)).join(DELIMITER) + '\n';
}

function jsonToCsv(patientSchemaProperties) {
  return function (rawJson) {
    var json = JSON.parse(rawJson);
    var extractValue = function (property) {
      var value = '';
      if (property.indexOf('.') !== -1) {
        var properties = property.split('.');
        value = json[properties[0]] ? json[properties[0]][properties[1]] : '';
      } else {
        value = json[property];
      }
      return value ? value : '';
    };
    // TODO: change this to a pipe/flow
    return patientSchemaProperties
      .map(extractValue)
      .map(concatIfArray)
      .map(csvEscape(DELIMITER))
      .join(DELIMITER);
  };
}

function transform(transformer) {
  return new stream.Transform({
    transform: function (chunk, encoding, next) {
      // TODO: handles UTF-8 ?
      this.push(transformer(String(chunk)) + '\n');
      next();
    },
    flush: function (done) {
      done();
    }
  });
}

function contains(iterable, value) {
  return iterable.filter(function (v) {
      return v === value;
    }).length > 0;
}

module.exports = {
  patientsHandler: patientsHandler/*, scoresHandler: scoresHandler*/
};
