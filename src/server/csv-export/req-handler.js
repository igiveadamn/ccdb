var stream = require('stream');
var schema = require('../models/schema');
var _ = require('lodash');

module.exports = function (dbConn) {
  return function (req, res) {
    var cursor = dbConn.collection('patients').find({}).stream({ transform: JSON.stringify });
    var columns = _.keys(schema.patientSchema.paths);
    var titleRow = buildTitleRow(columns);
    res.write(titleRow);
    // return cursor.pipe(transform(_.identity)).pipe(res);
    return cursor.pipe(transform(jsonToCsv(columns))).pipe(res);
  };
};

// TODO: Implement this
function csvEscape(v) {
  return v;
}

function buildTitleRow(patientSchemaProperties) {
  return patientSchemaProperties.map(csvEscape).join(',') + '\n';
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
      return value ? JSON.stringify(value) : '';
    };
    return patientSchemaProperties.map(extractValue).map(csvEscape).join(',');
  };
}

function transform(transformer) {
  return new stream.Transform({
    transform: function (chunk, encoding, next) {
      // TODO: handles UTF-8 ?
      this.push(transformer(String(chunk)));
      next();
    },
    flush: function (done) {
      done();
    }
  });
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
