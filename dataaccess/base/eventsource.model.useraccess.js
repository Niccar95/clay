/* 

  HEADS UP! THIS IS A GENERATED FILE!
  
  Changes done in this file will be overwritten on next generation from the code generator.

*/
const { MoleculerClientError } = require('moleculer').Errors;
const { isSuper, isSupplier, isStandAloneSupplier } =
  require('shared-service').accessRules;

function userListAccessFilter(sessionUser) {
  if (isSuper(sessionUser) || isSupplier(sessionUser)) {
    return { includesForUserAccess: [], whereForUserAccess: {} };
  }
  throw new MoleculerClientError('FORBIDDEN', 403);
}

function verifyReadAccess(existing, sessionUser) {
  if (isSuper(sessionUser) || isStandAloneSupplier(sessionUser)) {
    return { includesForUserAccess: [], whereForUserAccess: {} };
  }
  throw new MoleculerClientError('FORBIDDEN', 403);
}

module.exports = { userListAccessFilter, verifyReadAccess };
