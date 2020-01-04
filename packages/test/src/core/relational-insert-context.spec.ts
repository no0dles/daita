import {User} from '../test';
import {expect} from 'chai';
import {AdapterTest, setupAdapters, testCase} from './test-utils';

describe('relational-insert-context', () => {
  setupAdapters({
    cleanup: async (setup) => {
      await setup.context.delete(User).exec();
    },
  });

  describe('should execute insert(User).value(id: a, name: foo, count: 2, admin: true)', () => testCase(async (adapterTest) => {
    await testInsert(adapterTest, {id: 'a', name: 'foo', count: 2, admin: true});
  }));

  describe('should execute insert(User).value(id: a, name: foo, count: null, admin: true)', () => testCase(async (adapterTest) => {
    await testInsert(adapterTest, {id: 'a', name: 'foo', count: null, admin: true});
  }));

  describe('should not execute insert(User).value(id: a, name: null, count: null, admin: false)', () => testCase(async (adapterTest) => {
    await testFailInsert(adapterTest,
      {
        id: 'a',
        name: null,
        count: null,
        admin: false,
      },
      Error,
      'name is required',
    );
  }));

  async function testInsert(adapterTest: AdapterTest, user: any) {
    await adapterTest.context
      .insert(User)
      .value(user)
      .exec();
  }

  async function testFailInsert(adapterTest: AdapterTest, user: any, err: any, message: string) {
    try {
      await testInsert(adapterTest, user);
      expect.fail('expecting error');
    } catch (e) {
      expect(e).to.be.instanceof(err);
      expect(e.message).to.be.eq(message);
    }
  }
});
