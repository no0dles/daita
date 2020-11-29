const subpackage = new RegExp('packages/([^/]+)');

module.exports = function customMappingFunction(explicit, implicit, path, reflection, context) {
  const package = subpackage.exec(implicit)[1];
  return `@daita/${package}`;
};
