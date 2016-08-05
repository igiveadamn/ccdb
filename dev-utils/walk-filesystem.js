var fs = require('fs');

var recursionCount = 0;
var getPaths = function (startPath, paths, cb) {
  try {
    ++recursionCount;
    return fs.stat(startPath, function (err, stats) {
      if (err) return cb(err);

      if (stats.isDirectory()) {
        ++recursionCount;
        fs.readdir(startPath, function (err, files) {
          if (err) return cb(err);
          files.forEach(function (f) {
            return getPaths(startPath + '/' + f, paths, cb);
          });
          --recursionCount;
        });
      }

      if (stats.isFile()) {
        paths.push(startPath);
      }
      --recursionCount;
      if (recursionCount === 0) {
        return cb(null);
      }

    });
  } catch (e) {
    cb(e);
  }
};

var walk = {
  paths: function (startDir, cb) {
    var paths = [];
    getPaths(startDir, paths, function (err) {
      if (err) return cb(err);
      return cb(null, paths);
    });
  }
};

module.exports = walk;