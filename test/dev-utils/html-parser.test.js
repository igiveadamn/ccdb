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
    expect(tree.root.name).to.equal('html');
  });

  it('correctly lists child nodes', function () {
    var html = '<html><head></head></html>';
    var firstChild = parseXml(html).root.children[0];
    expect(firstChild.name).to.equal('head');
  });

  it('correctly lists multiple child nodes', function () {
    var html = '<html><head></head><body></body></html>';
    var firstChild = parseXml(html).root.children[0];
    var secondChild = parseXml(html).root.children[1];
    expect(firstChild.name).to.equal('head');
    expect(secondChild.name).to.equal('body');
  });

  it('parses attribute key value pairs correctly', function () {
    var node = '<lang name="Scala" lonely paradigm="functional"></lang>';
    var attributes = parseXml(node).root.attributes;
    expect(attributes).to.deep.equal([{ key: 'name', value: 'Scala' }, {
      key: 'lonely',
      value: null
    }, { key: 'paradigm', value: 'functional' }]);
  })
});
