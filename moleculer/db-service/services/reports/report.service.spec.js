/*

  HEADS UP! THIS IS A GENERATED FILE!

  Changes done in this file will be overwritten on next generation from the code generator.

*/
const { getServiceBrokerForTest } = require('shared-service/test');

const { sequelize } = require('../../dataaccess');
const reportService = require('./report.service');

describe('the report service', () => {
  const broker = getServiceBrokerForTest({
    logLevel: 'error',
  });
  broker.createService(reportService);

  beforeEach(async () => {
    await sequelize.sync({ force: true });
    await broker.start();
  });

  afterAll(() => broker.stop());
  describe('the remove dangerous chars method', () => {
    it('should remove dangerous chars', () => {
      const result = reportService.methods.removeDangerousChars({
        sort: '\'";  drop table all',
      });
      expect(result).toMatchObject({ sort: '  drop table all' });
    });
    it('should remove dangerous chars in array', () => {
      const result = reportService.methods.removeDangerousChars({
        sort: ['\'";  drop table all'],
      });
      expect(result).toMatchObject({ sort: ['  drop table all'] });
    });
    it('should remove dangerous chars in object', () => {
      const result = reportService.methods.removeDangerousChars({
        range: { between: [';;;2012-03-03', ';2012-03-04'] },
      });
      expect(result).toMatchObject({
        range: { between: ['2012-03-03', '2012-03-04'] },
      });
    });
  });
});
