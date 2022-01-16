import { adapter as sqliteAdapter } from '@daita/sqlite-adapter';
import { schema } from './schema';
import { field, table } from '@daita/relational';
import { Mountain } from './models/mountain';
import { migrate } from '@daita/orm';

async function main() {
  const ctx = sqliteAdapter.getRelationalAdapter({ memory: true });

  await migrate(ctx, schema);

  await ctx.insert({
    into: table(Mountain),
    insert: { name: 'Zermatt', id: 'zermatt', prominence: 1000, cantonShortname: 'VS', elevation: 10 },
  });

  const result = await ctx.select({
    select: {
      name: field(Mountain, 'name'),
      prominence: field(Mountain, 'prominence'),
    },
    from: table(Mountain),
  });

  console.log(result);

  await ctx.close();
}

main();
