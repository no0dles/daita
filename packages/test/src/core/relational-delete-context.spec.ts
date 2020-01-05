import {
  getSourceCodeSchema,
  MigrationDescription,
  RelationalSchema,
} from '@daita/core';
import {getRelationalMigrationSteps} from '@daita/cli/dist/migration/generation';
import {DatabaseSchema} from '@daita/core/dist/schema/database-schema';
import {setupAdapters, testCase} from './test-utils';
import {User} from '../test';
import {expect} from 'chai';

class DataTable {
  id!: string;

  bool!: boolean;
  boolUndefined?: boolean;
  boolUndefined2!: boolean | undefined;
  boolNull!: boolean | null;

  number!: number;
  numberUndefined?: number;
  numberUndefined2!: number | undefined;
  numberNull!: number | null;

  date!: Date;
  dateUndefined?: Date;
  dateUndefined2!: Date | undefined;
  dateNull!: Date | null;

  string!: string;
  stringUndefined?: string;
  stringUndefined2!: string | undefined;
  stringNull!: string | null;
}

class ReferenceTable {
  id!: string;

  reference!: ReferenceTable;
  referenceUndefined?: ReferenceTable;
  referenceUndefined2!: ReferenceTable | undefined;
  referenceNull!: ReferenceTable | null;

  referenceWithKeyId!: string;
  referenceWithKey!: ReferenceTable;

  referenceUndefinedWithKeyId?: string;
  referenceUndefinedWithKey?: ReferenceTable;

  referenceUndefined2WithKeyId!: string | undefined;
  referenceUndefined2WithKey!: ReferenceTable | undefined;

  referenceNullWithKeyId!: string | null;
  referenceNullWithKey!: ReferenceTable | null;
}

class MultiReferenceTable {
  id!: string;

  multiKeyReference!: MultiPrimaryKeyTable;
  multiKeyReferenceUndefined?: MultiPrimaryKeyTable;
  multiKeyReferenceUndefined2!: MultiPrimaryKeyTable | undefined;
  multiKeyReferenceNull!: MultiPrimaryKeyTable | null;

  multiKeyReferenceWithKeyId!: string;
  multiKeyReferenceWithKeyOrder!: number;
  multiKeyReferenceWithKey!: MultiPrimaryKeyTable;

  multiKeyReferenceUndefinedWithKeyId?: string;
  multiKeyReferenceUndefinedWithKeyOrder?: number;
  multiKeyReferenceUndefinedWithKey?: MultiPrimaryKeyTable;

  multiKeyReferenceUndefined2WithKeyId!: string | undefined;
  multiKeyReferenceUndefined2WithKeyOrder!: number | undefined;
  multiKeyReferenceUndefined2WithKey!: MultiPrimaryKeyTable | undefined;

  multiKeyReferenceNullWithKeyId!: string | null;
  multiKeyReferenceNullWithKeyOrder!: number | null;
  multiKeyReferenceNullWithKey!: MultiPrimaryKeyTable | null;
}

class MultiPrimaryKeyTable {
  id!: string;
  order!: number;
}

const schema = new RelationalSchema();
schema.table(DataTable);
schema.table(ReferenceTable);
schema.table(MultiReferenceTable);
schema.table(MultiPrimaryKeyTable, {key: ['id', 'order']});

// class Migration implements MigrationDescription {
//   id = 'inital';
//   steps = getRelationalMigrationSteps(new DatabaseSchema(), schema);
// }
//getSourceCodeSchema()
//schema.migration(Migration);
// getSourceCodeSchema()
// getRelationalMigrationSteps(new DatabaseSchema(), )

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

describe('relational-delete-context', () => {
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

  describe('should execute delete(User).where(id: b)', () => testCase(async (adapterTest) => {
    const result = await adapterTest.context
      .delete(User)
      .where({id: 'b'})
      .exec();
    expect(result).to.be.deep.eq({affectedRows: 1});
    const serverUsers = await adapterTest.context.select(User).exec();
    expect(serverUsers).to.be.deep.eq([userA]);
  }));
});
