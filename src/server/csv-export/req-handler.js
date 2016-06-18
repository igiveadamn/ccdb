var stream = require('stream');

module.exports = function (dbConn) {
  return function (req, res) {
    var cursor = dbConn.collection('patients').find({}).stream({transform: JSON.stringify});
    return cursor.pipe(transform(jsonToCsv)).pipe(res);
  };
};

function jsonToCsv (json) { return json; }

function transform (transformer) {
  return new stream.Transform({
    transform: function (chunk, encoding, next) {
      this.push(transformer(chunk));
      next();
    },
    flush: function (done) {
      done();
    }
  });
}
 