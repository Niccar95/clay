/*

  HEADS UP! THIS IS A GENERATED FILE!

  Changes done in this file will be overwritten on next generation from the code generator.

*/


jest.mock('shared-service/dist/lib/guarded-action-call');
const { getServiceBrokerForTest } = require('shared-service/test');
const { callBrokerAsSuper } = require('shared-service/test');

const {
  guardedActionCall,
} = require('shared-service/dist/lib/guarded-action-call');
const {{camelCase clay_parent.name}}Service = require('./{{camelCase clay_parent.name}}-channels.service');
const { sequelize } = require('../dataaccess');

process.env.PRODUCTION = 'true';
describe('the {{camelCase clay_parent.name}} channel', () => {
  const broker = getServiceBrokerForTest({
    logLevel: 'error',
  });

  broker.createService({{camelCase clay_parent.name}}Service);

  beforeAll(async () => {
    await sequelize.sync({ force: true });
    await broker.start();
  });
  afterAll(() => broker.stop());

  beforeEach(() => {
    guardedActionCall.mockResolvedValueOnce({});
  });

  it('should call guarded action with correct params', async () => {
    await callBrokerAsSuper(broker, '{{camelCase clay_parent.name}}-channels.handleMessage', {
      header: {
        queuedAt: '2019-01-01T00:00:00.000Z',
        integrationOrigin: {
          integrationId: '1234',
          incomingId: '5678',
          fileName: 'somefile.txt',
        },
      },
      payload: {
        actionName: 'v1.article.update',
        actionParams: {
          action: 'v1.article.update',
          shortName: 'something new',
        },
        actionBrokerOptions: {
          test: 'test',
          meta: { requestOrigin: 'origin' },
        },
      },
    });

    expect(guardedActionCall).toHaveBeenCalledWith(
      expect.anything(),
      'v1.article.update',
      {
        action: 'v1.article.update',
        shortName: 'something new',
      },
      {
        test: 'test',
        meta: { requestOrigin: 'origin' },
      },
      {
        integrationId: '1234',
        incomingId: '5678',
        fileName: 'somefile.txt',
      },
    );
  });
});
