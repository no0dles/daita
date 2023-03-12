import {
  createSchema,
  CreateSchemaOptions,
  generateMigration,
  migrate,
  MigrationTree,
  OrmSql,
  RelationalOrmAdapter,
} from '@daita/orm';
import { getTestAdapter } from '../../testing';
import { RelationalAdapter, Sql } from '@daita/relational';

export function testMigrationStepsTest(options: {
  base: CreateSchemaOptions;
  target: CreateSchemaOptions;
  expectedUp: OrmSql[];
  expectedDown: OrmSql[];
  verifySqls: { sql: Sql<any>; success: boolean; expectedResult?: any }[];
}) {
  const baseSchema = createSchema('test', options.base);
  const targetSchema = createSchema('test', options.target);
  const baseMigration = generateMigration(createSchema('test', {}), baseSchema, { id: 'base' });
  const targetMigration = generateMigration(baseSchema, targetSchema, { id: 'target', after: 'base' });

  it('should generate up migration', () => {
    expect(targetMigration.upMigration).toEqual(options.expectedUp);
  });

  it('should generate down migration', () => {
    expect(targetMigration.downMigration).toEqual(options.expectedDown);
  });

  it('should not generate another migration if nothing changes', () => {
    const nextMigration = generateMigration(targetSchema, targetSchema, { id: 'empty', after: 'target' });
    expect(nextMigration.upMigration).toEqual([]);
    expect(nextMigration.downMigration).toEqual([]);
  });

  describe.each([['pg'], ['sqlite']])('%s', (adapter) => {
    let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

    beforeAll(async () => {
      ctx = await getTestAdapter(adapter as 'pg' | 'sqlite');
    });

    afterAll(async () => ctx.close());

    it('should migrate base schema', async () => {
      const migrationTree = new MigrationTree<OrmSql>('test', [baseMigration]);
      await migrate(ctx, migrationTree);
    });

    it('should migrate target schema', async () => {
      const migrationTree = new MigrationTree<OrmSql>('test', [baseMigration, targetMigration]);
      await migrate(ctx, migrationTree);
    });

    it('verify schema', async () => {
      for (const sql of options.verifySqls) {
        try {
          const result = await ctx.exec(sql.sql);
          if (sql.expectedResult) {
            expect(result).toEqual(sql.expectedResult);
          }

          if (!sql.success) {
            expect(true).toBe(sql.success);
          }
        } catch (e) {
          if (sql.success) {
            expect(e).toBe(null);
          }
        }
      }
    });
  });
}
