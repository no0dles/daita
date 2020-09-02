import { RelationalSchema } from '../schema';
import { getMigrationContext } from '../context';
import { TransactionClient } from '../../relational/client';

export async function migrate(
  client: TransactionClient<any>,
  schema: RelationalSchema,
) {
  const context = getMigrationContext(client, schema);
  await context.update();
}
