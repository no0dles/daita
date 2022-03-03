import {
  createSchema,
  CreateSchemaOptions,
  generateRelationalMigrationSteps,
  MigrationPlan,
  MigrationStep,
  RelationalOrmAdapter,
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
  const steps = generateRelationalMigrationSteps(baseSchema, targetSchema);

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
      const plan: MigrationPlan = {
        targetSchema: baseSchema,
        direction: 'forward',
        migration: {
          id: 'base',
          steps: generateRelationalMigrationSteps(createSchema('test', {}), baseSchema),
        },
      };
      await ctx.applyMigration('test', plan);
    });

    it('should migrate target schema', async () => {
      const plan: MigrationPlan = {
        targetSchema: targetSchema,
        direction: 'forward',
        migration: {
          id: 'target',
          steps,
        },
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
