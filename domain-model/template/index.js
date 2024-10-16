
const {{camelCase name}}Const = require('./{{name}}.const');
const properties = require('./properties');
const invariants = require('./invariants');
const indexExtras = require('./index.extras');

const createSearchStringQuery = require('./create-search-string-query');
// DO NOT WRITE ANYTHING HERE!!!
module.exports = {
  ...indexExtras,
  ensureInvariants: invariants,
  ...properties,
  createSearchStringQuery,
  ...{{camelCase name}}Const,
};
