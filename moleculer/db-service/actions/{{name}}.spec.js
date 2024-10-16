const { getServiceBrokerForTest } = require('shared-service/test');
const { callBrokerAsSuper } = require('shared-service/test');
const { sequelize } = require('../../dataaccess');
const {{camelCase clay_parent.clay_parent.name}}Service = require('../../services/{{clay_parent.clay_parent.name}}.service');
const { {{camelCase clay_parent.clay_parent.name}} } = require('../../dataaccess');

describe('the oms service', () => {
    const broker = getServiceBrokerForTest({
      logLevel: 'error',
    });
    broker.createService({{camelCase clay_parent.clay_parent.name}}Service);

    beforeEach(async () => {
      await sequelize.sync({ force: true });
      await broker.start();
    });

    afterAll(() => broker.stop());
    beforeEach(async () => {
      await callBrokerAsSuper(broker, 'v1.{{clay_parent.clay_parent.name}}.upsert', {
        id: '{{camelCase clay_parent.clay_parent.name}}_under_test_{{name}}',
        // test data goes here
        {{#each parameters}}
        {{#if required}}
        {{#switch type}}
        {{#case 'string' 'email' 'password' 'S3image' 'croppedS3image'}}
          {{@key}}: 'test-string',
        {{/case}}
        {{#case 'number'}}
          {{@key}}: 0,
        {{/case}}
        {{#case 'date'}}
        {{@key}}: '2020-02-02',
        {{/case}}
        {{#case 'enum'}}
          {{@key}}: '{{values.0.key}}',
        {{/case}}
        {{/switch}}
        {{/if}}
        {{/each}}
      });
    });
    describe('the {{name}} action', () => {
      describe('when executing', () => {
        it('will ...', async () => {
          await callBrokerAsSuper(broker, 'v1.{{camelCase clay_parent.clay_parent.name}}.{{name}}', {
            id: '{{camelCase clay_parent.clay_parent.name}}_under_test_{{name}}',
            // modify for test here
          });
          const result = await {{camelCase clay_parent.clay_parent.name}}.get({
            where: { id: '{{camelCase clay_parent.clay_parent.name}}_under_test_{{name}}', },
          });
          expect(result).toEqual({});
        });
      });
    });
});
