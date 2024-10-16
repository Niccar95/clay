const fs = require('fs');

function getFileContent(fileName) {
  return fs.readFileSync(fileName, 'utf8');
}

const mixin = entity => {
  Object.entries(entity).forEach(([key, value]) => {
    if (key === 'import_field') {
      console.log(value.fileName);
      entity[value.fieldName] = getFileContent(value.fileName);
      delete entity.key;
    }
    if (typeof value === 'object') {
      mixin(value);
    }
  });
};

module.exports = {
  type: 'function',
  name: 'import_field',
  function: mixin,
};
