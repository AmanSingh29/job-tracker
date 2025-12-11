const { XMLParser } = require("fast-xml-parser");

function parseXmlString(xmlString, options = {}) {
  const parser = new XMLParser(options);
  return parser.parse(xmlString);
}

module.exports = { parseXmlString };
