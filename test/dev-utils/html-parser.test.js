var expect = require('chai').expect;
var parseXml = require('../../dev-utils/xml-parser');

// { name: 'html', attributes: [], children: [] || [not an attribute], content: '' || 'something' || [not a key] }

describe('HTML Parser', function () {
  it('returns an empty object for empty html', function () {
    var html = '';
    expect(parseXml(html)).to.deep.equal({});
  });

  it('returns the correct name for a node one level deep', function () {
    var html = '<html></html>';
    var tree = parseXml(html);
    console.log('tree', tree);
    expect(tree.root.name).to.equal('html');
  });

  it('correctly lists child nodes', function () {
    var html = '<html><head></head></html>';
    var firstChild = parseXml(html).root.children[0];
    expect(firstChild.name).to.equal('head');
  });
});