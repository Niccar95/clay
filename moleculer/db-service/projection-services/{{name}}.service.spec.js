const { getServiceBrokerForTest } = require('shared-service/test');
const { callBrokerAsSuper } = require('shared-service/test');
const { sequelize } = require('../../dataaccess');
const {{camelCase name}}Service = require('../../services/{{name}}.service');
const { {{camelCase name}} } = require('../../dataaccess');

describe('the oms service', () => {
    const broker = getServiceBrokerForTest({
      logLevel: 'error',
    });
    broker.createService({{camelCase name}}Service);

    beforeEach(async () => {
      await sequelize.sync({ force: true });
      await broker.start();
    });

    afterAll(() => broker.stop());
    beforeEach(async () => {
    });
    describe('the {{name}} projection', () => {
      describe('when executing', () => {
        it('will ...', async () => {
          await callBrokerAsSuper(broker, 'v1.{{camelCase name}}.{{camelCase name}}', {
            id: '{{camelCase name}}_under_test_{{camelCase name}}',
            // modify for test here
          });
          const result = await {{camelCase name}}.get({
            where: { id: '{{name}}_under_test_{{name}}', },
          });
          expect(result).toEqual({});
        });
      });
    });
});
