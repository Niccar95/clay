/*

  HEADS UP! THIS IS A GENERATED FILE!

  Changes done in this file will be overwritten on next generation from the code generator.

*/
const { getServiceBrokerForTest } = require('shared-service/test');
const {
  callBrokerAsSuper,
  callBrokerAsSupplierWithSupplierNumbers,
  callBrokerAsStandAloneSupplier,
  createMockMailService,
} = require('shared-service/test');
const { sequelize } = require('../dataaccess');

const events = require('../events');

const {{camelCase clay_parent.name}}EventsourceService = require('./{{camelCase clay_parent.name}}Eventsource.service');

    // get first event from events object
    const firstEvent = Object.keys(events)[0];
    // get the second event from events object
    const secondEvent = Object.keys(events)[1];

    // get the first model from the events object
    const firstModel = Object.keys(sequelize.models).filter(x=>x !== 'eventsource')[0];
    const testField =  Object.keys(sequelize.models[firstModel].rawAttributes)[1];

describe('the {{camelCase clay_parent.name}}Eventsource service', () => {
  const broker = getServiceBrokerForTest({
    logLevel: 'error',
  });
  broker.createService({{camelCase clay_parent.name}}EventsourceService);
  broker.createService(createMockMailService());

  beforeAll(async () => {



    await sequelize.sync({ force: true });
    await broker.start();
    await sequelize.models.eventsource.create({

      eventName: 'test',
      eventParams: {
        data: 'test',
        'password': 'password',
        'token': 'token',
        'resetTokenExpires': 'resetTokenExpires',
        'verificationToken': 'verificationToken',
        'forgotPasswordToken': 'forgotPasswordToken',
    }
    });

    await sequelize.models.eventsource.create({
      entityId: '123',
      entityModel: firstModel,
      eventName: firstEvent,
      eventParams: {
        'id': '123',
        [testField]: 'test',
    }
    });
    await sequelize.models.eventsource.create({
      entityId: '123',
      entityModel: firstModel,
      eventName: secondEvent,
      eventParams: {
        [testField]: 'test23',
    }
    });
    await sequelize.models.eventsource.create({
      entityId: '123',
      entityModel: firstModel,
      eventName: firstEvent,
      eventParams: {
        [testField]: 'test34',
    }
    });
  });

  afterAll(() => broker.stop());

  beforeEach(async () => {});
  describe('when listing', () => {
    describe('as a superuser', () => {
      it('should be able to get list of {{camelCase clay_parent.name}}Eventsources', async () => {
        const result = await callBrokerAsSuper(
          broker,
          'v1.{{camelCase clay_parent.name}}Eventsource.list',
          {},
        );
        expect(result.rows.length).toBe(4);
        expect(result.rows[0]).toMatchObject({
          eventName: "test",
          createdAt: expect.any(Date)
        });
        expect(result.rows[0].eventParams).toEqual(undefined);
      });
    });
    describe('as a standalone supplier', () => {
      it('should be able to get list of {{camelCase clay_parent.name}}Eventsources', async () => {
        const result = await callBrokerAsStandAloneSupplier(
          broker,
          'v1.{{camelCase clay_parent.name}}Eventsource.list',
          {},
          [],
        );
        expect(result.rows.length).toBe(4);
        expect(result.rows[0]).toMatchObject({
          eventName: 'test',
          createdAt: expect.any(Date),
        });
        expect(result.rows[0].eventParams).toEqual(undefined);
      });
    });
    describe('as supplier', () => {
      it('should not be able to get list of {{camelCase clay_parent.name}}Eventsources', async () => {
        const result = await callBrokerAsSupplierWithSupplierNumbers(
            broker,
            'v1.{{camelCase clay_parent.name}}Eventsource.list',
            {},
            [],
          );
          expect(result.rows.length).toBe(4);
          expect(result.rows[0]).toMatchObject({
            eventName: 'test',
            createdAt: expect.any(Date),
          });
          expect(result.rows[0].eventParams).toEqual(undefined);
      });
    });
  });
  describe('the undoEvent action', () => {
    it('should replay all events until this event and publish the previous eventname with the combined output', async () => {

      await callBrokerAsSuper(
        broker,
        'v1.{{camelCase clay_parent.name}}Eventsource.undoEvent',
        {id: 4},
      );

      const result = await sequelize.models.eventsource.findAll({
        sort: '-id',
      });
      expect(result.length).toBe(5);
      expect(result[4]).toMatchObject({
        entityId: '123',
        id: 5,
        metadata: null,
        eventParams: {
          [testField]: 'test23',
          id: '123',
        },
        requestOrigin: 'test',
        sessionUser: {
          id: 'internalService',
          internalService: false,
          organization: {
            gatewaySuppliers: [],
          },
          roles: ['super'],
        },
        userId: 'internalService',
      });
    });
  });
  describe('the cleanUpOldEvents action', () => {
    it('should remove all events not matching policy', async () => {
      await callBrokerAsSuper(
        broker,
        'v1.{{camelCase clay_parent.name}}Eventsource.cleanUpOldEvents',
        {},
      );
      const result = await sequelize.models.eventsource.findAll();
      expect(result.length).toBe(5);
    });
  });
});
