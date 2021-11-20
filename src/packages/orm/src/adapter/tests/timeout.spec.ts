import { testContext } from '@daita/relational';
import { createPerson, createPersonTable } from '../../../../testing/schema/test-schema';
import { Person } from '../../../../examples/mowntain/models/person';
import { MigrationTree } from '../../migration/migration-tree';
import { TimeoutError } from '@daita/relational';
import { allow } from '@daita/relational';
import { sleep } from '@daita/common';
import { field } from '@daita/relational';
import { anonymous } from '@daita/relational';
import { anything } from '@daita/relational';
import { equal } from '@daita/relational';
import { table } from '@daita/relational';
import { getRuleId } from '@daita/relational';

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
  describe.each([remoteClients])('%s', (client) => {
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
      expect(person!.birthday).toBeNull();
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
      expect(person!.birthday).toBeNull();
      done();
    });
  });
});
