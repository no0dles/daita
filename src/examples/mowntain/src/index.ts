import { getContext } from '@daita/orm';
import { adapter as sqliteAdapter } from '@daita/sqlite-adapter';
import { schema } from './schema';
import { field, table } from '@daita/relational';
import { Mountain } from './models/mountain';

async function main() {
  const ctx = getContext(sqliteAdapter, { schema, memory: true });

  await ctx.migrate();

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
