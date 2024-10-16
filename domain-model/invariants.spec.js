const invariants = require('./invariants');

describe('the {{name}} invariants', () => {
  it('does nothing', () => {
    const modifiedEntity = { test: 2 };
    const ensuredEntity = invariants(modifiedEntity);
    expect(ensuredEntity).toEqual(modifiedEntity);
  });
});
