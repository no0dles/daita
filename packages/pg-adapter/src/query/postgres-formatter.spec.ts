import { postgresFormatter } from './postgres-formatter';
import { CounterFormatContext } from '@daita/relational';

describe('postgres-formatter', () => {
  it('should format create schema', () => {
    const formatCtx = new CounterFormatContext('$');
    const result = postgresFormatter.format({createSchema: 'test', ifNotExists: true}, formatCtx);
    expect(result).toEqual('CREATE SCHEMA IF NOT EXISTS "test"');
  })
});
