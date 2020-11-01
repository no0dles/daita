import { getMigrationContext } from '../context/get-migration-context';
import { TransactionClient } from '../../relational/client/transaction-client';
import { RelationalSchema } from '../schema/relational-schema';

export async function migrate(client: TransactionClient<any>, schema: RelationalSchema) {
  const context = getMigrationContext(client, schema);
  await context.update();
}
