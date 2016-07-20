var stream = require('stream');
var schema = require('../models/schema');
var _ = require('lodash');

var DELIMITER = ',';
var IGNORED_FIELDS = ['_id', '__v', 'scores'];

module.exports = function (dbConn) {
  return function (req, res) {
    var cursor = dbConn.collection('patients').find({}).stream({ transform: JSON.stringify });
    var columns = _.filter(_.keys(schema.patientSchema.paths), function (k) {
      return !contains(IGNORED_FIELDS, k);
    });
    var titleRow = buildTitleRow(columns);
    res.write(titleRow);
    // return cursor.pipe(transform(_.identity)).pipe(res);
    return cursor.pipe(transform(jsonToCsv(columns))).pipe(res);
  };
};

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
  if (value) console.log(value, value.constructor);
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
/* 
 Andy Duncan
 How about everything except scores in one report.	11:16 AM
 And then only scores in another. Multiple rows per patient who has multiple scores?	11:16 AM
 Then csv is doable.	11:17 AM
 And you can use the scheme to get columns.	11:17 AM
 Maybe flatten, with concatenation of fields like 'admission - blah blah' whatever the fields are (sorry not at my desk)	11:18 AM
 Then you don't need the whole database in memory to get column headers.	11:18 AM
 Schema.	11:18 AM
 What do you think?	11:19 AM

 Jake Howard
 Sounds like a plan. Comorbidities and scores in separate files. Just like RDBMS mapping tables.	11:22 AM
 (On a train) (bad signal)	11:22 AM

 Andy Duncan
 Mmmmm	11:22 AM
 No. Just concatenate comorbidities	11:23 AM
 In the main csv
 */

// This end point does the main chunk of the data
// Call a separate end point to get the other file (look into downloading two files from one call later)
