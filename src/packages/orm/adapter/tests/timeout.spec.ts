import { testContext } from '../../../../testing/relational/adapters';
import { createPerson, createPersonTable } from '../../../../testing/schema/test-schema';
import { Person } from '../../../../docs/example/models/person';
import { MigrationTree } from '../../migration/migration-tree';
import { TimeoutError } from '../../../relational/error/timeout-error';
import { allow } from '../../../relational/permission/function/allow';
import { sleep } from '../../../common/utils/sleep';
import { field } from '../../../relational/sql/keyword/field/field';
import { anonymous } from '../../../relational/permission/function/anonymous';
import { anything } from '../../../relational/permission/function/anything';
import { equal } from '../../../relational/sql/operands/comparison/equal/equal';
import { table } from '../../../relational/sql/keyword/table/table';
import { getRuleId } from '../../../relational/permission/rule-id';

describe('relational/adapter/relational-transaction-adapter/timeout', () => {
  const remoteClients = testContext(
    new MigrationTree('test', [
      {
        id: 'init',
        steps: [
          { kind: 'add_rule', rule: allow(anonymous(), anything()), ruleId: getRuleId(allow(anonymous(), anything())) },
        ],
      },
    ]),
    'http-sqlite',
  );
  describe.each(remoteClients)('%s', (client) => {
    beforeAll(async () => {
      await createPersonTable(client);
      await createPerson(client, { firstName: 'Foo', lastName: 'Bar', id: 'a' });
    });

    afterAll(() => client.close());

    it('should cancel transaction with timeout before changes', async (done) => {
      try {
        await client.transaction(async (trx) => {
          await sleep(2500);
          await trx.update({
            set: { birthday: new Date() },
            update: table(Person),
            where: equal(field(Person, 'id'), 'a'),
          });
        });
        done(new Error('should not be successfull'));
      } catch (e) {
        expect(e).toBeInstanceOf(TimeoutError);
        expect(e.message).toEqual('timeout');
      }
      const person = await client.selectFirst({
        select: { birthday: field(Person, 'birthday') },
        from: table(Person),
      });
      expect(person).not.toBeUndefined();
      expect(person).not.toBeNull();
      expect(person.birthday).toBeNull();
      done();
    });

    it('should cancel transaction with timeout after changes', async (done) => {
      try {
        await client.transaction(async (trx) => {
          await trx.update({
            set: { birthday: new Date() },
            update: table(Person),
            where: equal(field(Person, 'id'), 'a'),
          });
          await sleep(2500);
        });
        done(new Error('should not be successfull'));
      } catch (e) {
        expect(e).toBeInstanceOf(TimeoutError);
        expect(e.message).toEqual('timeout');
      }
      const person = await client.selectFirst({
        select: { birthday: field(Person, 'birthday') },
        from: table(Person),
      });
      expect(person).not.toBeUndefined();
      expect(person).not.toBeNull();
      expect(person.birthday).toBeNull();
      done();
    });
  });
});
