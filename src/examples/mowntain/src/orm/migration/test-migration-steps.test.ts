import {
  createSchema,
  CreateSchemaOptions,
  emptySchema,
  generateRelationalMigrationSteps,
  getSchemaDescription,
  MigrationDescription,
  MigrationPlan,
  MigrationStep,
  NormalMapper,
  RelationalOrmAdapter,
  SchemaMapper,
} from '@daita/orm';
import { getTestAdapter } from '../../testing';
import { RelationalAdapter, Sql } from '@daita/relational';

export function testMigrationStepsTest(options: {
  base: CreateSchemaOptions;
  target: CreateSchemaOptions;
  expectedSteps: MigrationStep[];
  verifySqls: { sql: Sql<any>; success: boolean; expectedResult?: any }[];
}) {
  const baseSchema = createSchema('test', options.base);
  const targetSchema = createSchema('test', options.target);
  const baseSteps = generateRelationalMigrationSteps(createSchema('test', {}), baseSchema);
  const steps = generateRelationalMigrationSteps(baseSchema, targetSchema);
  const baseMigration: MigrationDescription = {
    id: 'base',
    steps: baseSteps,
  };
  const targetMigration: MigrationDescription = {
    id: 'target',
    steps,
  };

  describe.each([['pg'], ['sqlite']])('%s', (adapter) => {
    let ctx: RelationalOrmAdapter & RelationalAdapter<any>;

    beforeAll(async () => {
      ctx = await getTestAdapter(adapter as 'pg' | 'sqlite');
    });

    afterAll(async () => ctx.close());

    it('should generate steps', () => {
      expect(steps).toEqual(options.expectedSteps);
    });

    it('should not generate steps if nothing changes', () => {
      expect(generateRelationalMigrationSteps(targetSchema, targetSchema)).toEqual([]);
    });

    it('should migrate base schema', async () => {
      const description = getSchemaDescription(emptySchema('test'), new SchemaMapper(() => new NormalMapper()), [
        baseMigration,
      ]);
      const plan: MigrationPlan = {
        targetSchema: baseSchema,
        direction: 'forward',
        migration: baseMigration,
        steps: description.steps,
      };
      await ctx.applyMigration('test', plan);
    });

    it('should migrate target schema', async () => {
      const baseDescription = getSchemaDescription(emptySchema('test'), new SchemaMapper(() => new NormalMapper()), [
        baseMigration,
      ]);
      const targetDescription = getSchemaDescription(
        baseDescription.schema,
        new SchemaMapper(() => new NormalMapper()),
        [targetMigration],
      );
      const plan: MigrationPlan = {
        targetSchema: targetSchema,
        direction: 'forward',
        migration: targetMigration,
        steps: targetDescription.steps,
      };
      await ctx.applyMigration('test', plan);
    });

    it('verify schema', async () => {
      for (const sql of options.verifySqls) {
        try {
          const result = await ctx.exec(sql.sql);
          if (sql.expectedResult) {
            expect(result).toEqual(sql.expectedResult);
          }

          if (!sql.success) {
            console.log(sql.sql);
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
