import {PostgresDataAdapter} from '@daita/core/dist/postgres';
import {dropDatabase} from '@daita/core/dist/postgres/postgres.util';
import {RelationalContext} from '@daita/core';
import {testConnectionString, testSchema, User} from './test';
import {expect} from 'chai';


describe('relational-insert-context', () => {
  let dataAdapter: PostgresDataAdapter;
  let context: RelationalContext;

  beforeEach(async () => {
    await dropDatabase(testConnectionString);
    dataAdapter = new PostgresDataAdapter(testConnectionString);
    context = testSchema.context(dataAdapter);
    await context.migration().apply();
  });

  afterEach(async () => {
    await context.delete(User).exec();
    if (dataAdapter) {
      await dataAdapter.close();
    }
  });

  it('should execute insert(User).value(id: a, name: foo, count: 2)', async () => {
    await testInsert({id: 'a', name: 'foo', count: 2});
  });

  it('should execute insert(User).value(id: a, name: foo, count: null)', async () => {
    await testInsert({id: 'a', name: 'foo', count: null});
  });

  it('should not execute insert(User).value(id: a, name: null, count: null)', async () => {
    await testFailInsert({
      id: 'a',
      name: null,
      count: null,
    }, Error, 'name is required');
  });

  async function testInsert(user: any) {
    await context.insert(User).value(user).exec();
  }

  async function testFailInsert(user: any, err: any, message: string) {
    try {
      await testInsert(user);
      expect.fail('expecting error');
    } catch (e) {
      expect(e).to.be.instanceof(err);
      expect(e.message).to.be.eq(message);
    }
  }
});