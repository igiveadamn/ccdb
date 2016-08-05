// content
// attributes
// children
// name

// test cases
// Control characters in tags: <htm<l>hello</html>
// mismatched open/close

var parseXml = function (xml) {
  if (!xml) {
    return {};
  }

  var index = 0;
  var firstNode = true;
  var openTags = [];
  var char = xml[index];
  var inOpeningTag = false;
  var inClosingTag = false;
  var ignoreSpecialChars = false; //TODO: test this
  var tagName = '';
  var currentNode = { _parent: null, _openTags: [] };
  var tree = { root: currentNode };


  var nextChar = function () {
    return xml[index + 1];
  };
  var last = function (arr) {
    return arr[arr.length - 1];
  };
  var createContextMessage = function (index, nextClosing, lastOpened) {
    return 'Opened tag: ' + lastOpened + ', next closing tag: ' + nextClosing + ', at position: ' + String(index);
  };

  while (char) {
    if (!ignoreSpecialChars && char === '<') {
      if (nextChar() === '/') {
        inClosingTag = true;
      } else {
        if (!firstNode) {
          var newNode = { _parent: currentNode };
          currentNode.children = currentNode.children ? currentNode.children.concat(newNode) : [newNode];
          currentNode = newNode;
        } else {
          firstNode = false;
        }
        inOpeningTag = true;
      }
    } else if (!ignoreSpecialChars && inOpeningTag && char === '>') {
      inOpeningTag = false;
      currentNode.name = tagName;
      tagName = '';
    } else if (inClosingTag && char === '>') {
      inClosingTag = false;
      if ('/' + currentNode.name !== tagName) {
        throw new Error('Unbalanced tags: ' + createContextMessage(index, tagName, currentNode.name))
      }
      currentNode._successfullyClosed = true;
      currentNode = currentNode._parent;
      tagName = '';
    } else if (inOpeningTag || inClosingTag) {
      tagName += char;
    }

    char = xml[++index];
  }
  return tree;
};

module.exports = parseXml;