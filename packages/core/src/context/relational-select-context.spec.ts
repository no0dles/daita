import { RelationalAddTableMigrationStep } from '../migration/steps/relation-add-table.migration-step';
import { RelationalAddTableFieldMigrationStep } from '../migration/steps/relational-add-table-field.migration-step';
import { PostgresDataAdapter } from '../postgres';
import { dropDatabase } from '../postgres/postgres.util';
import { RelationalContext } from './relational-context';
import { expect } from 'chai';
import {MigrationDescription} from "../migration";
import {RelationalSchema} from '../schema';

class User {
  id!: string;
  name!: string;
  count!: number;
}

class Migration implements MigrationDescription {
  id = 'test';
  steps = [
    new RelationalAddTableMigrationStep('User'),
    new RelationalAddTableFieldMigrationStep('User', 'id', 'string'),
    new RelationalAddTableFieldMigrationStep('User', 'name', 'string'),
    new RelationalAddTableFieldMigrationStep('User', 'count', 'number'),
  ]
}

describe('relational-select-context', () => {
  const connectionString = 'postgres://postgres:postgres@localhost/daita-test';
  const schema = new RelationalSchema();
  schema.table(User);
  schema.migration(Migration);

  const userA = { id: 'a', name: 'foo', count: 2 };
  const userB = { id: 'b', name: 'bar', count: 14 };

  let dataAdapter: PostgresDataAdapter;
  let context: RelationalContext;

  beforeEach(async () => {
    await dropDatabase(connectionString);
    dataAdapter = new PostgresDataAdapter(connectionString);
    context = schema.context(dataAdapter);
    await context.migration().apply();
    await context
      .insert(User)
      .value(userA)
      .exec();
    await context
      .insert(User)
      .value(userB)
      .exec();
  });

  afterEach(async () => {
    if(dataAdapter) {
      await dataAdapter.close();
    }
  });

  it('should execute select(User)', async () => {
    const users = await context.select(User).exec();
    expect(users).to.deep.eq([userA, userB]);
  });

  it('should execute first select(User)', async () => {
    const user = await context.select(User).execFirst();
    expect(user).to.deep.eq(userA);
  });

  it('should execute select(User).where({name: foo})', async () => {
    const users = await context
      .select(User)
      .where({ name: 'foo' })
      .exec();
    expect(users).to.deep.eq([userA]);
  });

  it('should execute select(User).where({$or: [{name: foo}, {name: bar}])', async () => {
    const users = await context
      .select(User)
      .where({ $or: [{ name: 'foo' }, { name: 'bar' }] })
      .exec();
    expect(users).to.deep.eq([userA, userB]);
  });

  it('should execute select(User).where({$and: [{name: foo}, {name: bar}])', async () => {
    const users = await context
      .select(User)
      .where({ $and: [{ name: 'foo' }, { name: 'bar' }] })
      .exec();
    expect(users).to.deep.eq([]);
  });

  it('should execute select(User).where({name: {$eq: foo}})', async () => {
    const users = await context
      .select(User)
      .where({ name: { $eq: 'foo' } })
      .exec();
    expect(users).to.deep.eq([userA]);
  });

  it('should execute select(User).where({name: {$like: fo%}})', async () => {
    const users = await context
      .select(User)
      .where({ name: { $like: 'fo%' } })
      .exec();
    expect(users).to.deep.eq([userA]);
  });

  it('should execute select(User).where({count: {$gt: 2}})', async () => {
    const users = await context
      .select(User)
      .where({ count: { $gt: 2 } })
      .exec();
    expect(users).to.deep.eq([userB]);
  });

  it('should execute select(User).where({count: {$gte: 2}})', async () => {
    const users = await context
      .select(User)
      .where({ count: { $gte: 2 } })
      .exec();
    expect(users).to.deep.eq([userA, userB]);
  });

  it('should execute select(User).where({count: {$lt: 2}})', async () => {
    const users = await context
      .select(User)
      .where({ count: { $lt: 2 } })
      .exec();
    expect(users).to.deep.eq([]);
  });

  it('should execute select(User).where({count: {$lte: 2}})', async () => {
    const users = await context
      .select(User)
      .where({ count: { $lte: 2 } })
      .exec();
    expect(users).to.deep.eq([userA]);
  });

  it('should execute select(User).where({name: {$in: [foo, bar]}})', async () => {
    const users = await context
      .select(User)
      .where({ name: { $in: ['foo', 'bar'] } })
      .exec();
    expect(users).to.deep.eq([userA, userB]);
  });

  it('should execute select(User).where({name: {$nin: [foo, bar]}})', async () => {
    const users = await context
      .select(User)
      .where({ name: { $nin: ['foo', 'bar'] } })
      .exec();
    expect(users).to.deep.eq([]);
  });

  it('should execute select(User).where({name: {$ne: foo}})', async () => {
    const users = await context
      .select(User)
      .where({ name: { $ne: 'foo' } })
      .exec();
    expect(users).to.deep.eq([
      userB
    ]);
  });

  it('should execute count(User)', async () => {
    const count = await context.select(User).execCount();
    expect(count).to.eq(2);
  });
});
