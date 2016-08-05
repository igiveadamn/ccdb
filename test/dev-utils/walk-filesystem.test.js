var expect = require('chai').expect;
var walk = require('../../dev-utils/walk-filesystem');

describe('Walk filesystem', function () {
  it('returns a list of all filepaths', function (done) {
    var startDir = __dirname + '/test-data';
     walk.paths(startDir, function (err, paths) {
       if (err) return done(err);
       var exepectedPaths = ['something.html', 'test-data-dir/not-html.txt', 'test-data-dir/something-else.html'].map(
         function (subPath) { return __dirname + '/test-data/' + subPath; }
       );
       expect(paths).to.deep.equal(exepectedPaths);
       done();
     })
  });
});
