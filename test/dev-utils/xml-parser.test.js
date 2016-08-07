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
  });

  it('handles tags that close themselves <selfcloser/>');
  it('throws an error when there is a space between attribute key = "value"');
  it('handles the top lines <? xml > <!DOCTYPE> etc...');
  it('adds content to nodes that have it <p>something</p>');
  it('throws an error when given garbage <blah <someth><hhh></hhh>');
  it.skip('correctly parses a large document', function () {
    var doc = [
      '<!DOCTYPE html>',
      '<html>',
      '<body>',
      '<p>Hello, World!</p>',
      '<div class="classy"><p>What a fine day</div>',
      '<body>',
      '</html>'
    ].join('\n');

    var expectedTree = {
      root: {
        name: 'html',
        children: [{
          name: 'body',
          children: [{
            name: 'p',
            content: 'Hello, World!'
          }, {
            name: 'div',
            attributes: [{ key: 'class', value: 'classy' }],
            children: [{
              name: 'p',
              content: 'What a fine day'
            }]
          }]
        }]
      }
    };

    expect(parseXml(doc)).to.deep.equal(expectedTree);
  });
});
