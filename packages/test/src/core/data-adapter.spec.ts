import {expect} from 'chai';
import {setupAdapters, testCase} from './test-utils';

describe('data-adapter', () => {
  setupAdapters({});

  describe('should raw', () => testCase(async (adapterTest) => {
    const date = await adapterTest.dataAdapter.raw('SELECT now() as date', []);
    expect(date.rowCount).to.be.eq(1);
    expect(date.rows[0].date).to.not.be.eq(null);
    expect(date.rows[0].date).to.not.be.eq(undefined);
  }));

  describe('should return raw error', () => testCase(async (adapterTest) => {
    try {
      await adapterTest.dataAdapter.raw('SELECT foo as date', []);
    } catch (e) {
      expect(e.message).to.be.eq('column "foo" does not exist');
    }
  }));
})