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
  var char = xml[index];
  var inOpeningTag = false;
  var inClosingTag = false;
  var inAttributes = false;
  var inAttributeKey = false;
  var inAttributeValue = false;
  var attributeKey = '';
  var attributeValue = '';
  var ignoreSpecialChars = false; //TODO: test this
  var tagName = '';
  var currentNode = { _parent: null, _openTags: [] };
  var tree = { root: currentNode };


  var nextChar = function () {
    return xml[index + 1];
  };
  var previousChar = function () {
    return xml[index - 1];
  };
  var last = function (arr) {
    return arr[arr.length - 1];
  };
  var addAttributeToNode = function (node, attribute) {
    node.attributes = node.attributes ? node.attributes.concat(attribute) : [attribute];
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
      inAttributes = false;
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
      if (!inAttributeValue && char === ' ') {
        if (attributeKey) { // valueless attribute
          addAttributeToNode(currentNode, { key: attributeKey, value: null });
          attributeKey = '';
          attributeValue = '';
        }
        inAttributes = true;
        inAttributeKey = true;
      } else if (inAttributes) {
        if (char === '=') {
          inAttributeKey = false;
          if (nextChar() !== '"') {
            throw new Error('Not allowed spaces between "=" and attribute value: ' + xml.substr(index - 10, index + 10))
          }
        } else if (char === '"') {
          if (previousChar() != '\\') {
            if (inAttributeValue) {
              addAttributeToNode(currentNode, { key: attributeKey, value: attributeValue });
              attributeKey = '';
              attributeValue = '';
            }
            inAttributeValue = !inAttributeValue;
          } else {
            if (inAttributeValue) { // should only be here for value, no back slashes allowed in key
              attributeValue += char; // Add the escaped quote
            }
          }
        } else {
          if (inAttributeKey) {
            attributeKey += char; // TODO: check only valid chars
          } else if (inAttributeValue) {
            attributeValue += char;
          }
        }
      } else {
        tagName += char;
      }
    }

    char = xml[++index];
  }
  return tree;
};

module.exports = parseXml;