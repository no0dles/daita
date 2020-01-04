import {setupAdapters, testCase} from './test-utils';
import {User} from '../test';
import {expect} from 'chai';

const userA = {
  id: 'a',
  name: 'foo',
  count: 2,
  admin: true,
  parentId: null,
};
const userB = {
  id: 'b',
  name: 'bar',
  count: 14,
  admin: false,
  parentId: 'a',
};

describe('relational-update-context', () => {
  setupAdapters({
    seedOnce: async (setup) => {
      await setup.context
        .insert(User)
        .value(userA)
        .exec();
      await setup.context
        .insert(User)
        .value(userB)
        .exec();
    },
    cleanupOnce: async (setup) => {
      await setup.context.delete(User);
    },
  });


  describe('should update(User).set(name: bar).where(id: a)', () => testCase(async (adapterTest) => {
    const result = await adapterTest.context
      .update(User)
      .set({name: 'bar'})
      .where({id: 'a'})
      .exec();
    expect(result).to.be.deep.eq({affectedRows: 1});
    const serverUsers = await adapterTest.context
      .select(User)
      .orderBy(s => s.id)
      .exec();
    expect(serverUsers).to.be.deep.eq([
      { ...userA, name: 'bar' },
      userB,
    ]);
  }));

});