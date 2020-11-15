import { sendPost } from '../../utils/https';
import { getGlobalConfig } from '../../utils/config';
import { cli } from 'cli-ux';

export async function listDatabases() {
  const config = getGlobalConfig();
  if (!config || !config.auth || !config.auth.token) {
    throw new Error('please log in first');
  }

  const sql = {
    select: { all: { table: { table: 'DatabaseList' } } },
    from: { table: 'DatabaseList' },
    where: {
      and: [
        {
          equal: {
            left: { field: { key: 'projectOwnerUsername', table: { table: 'DatabaseList' } } },
            right: 'daita|pascal',
          },
        },
        { equal: { left: { field: { key: 'projectName', table: { table: 'DatabaseList' } } }, right: 'test' } },
      ],
    },
  };

  const result = await sendPost<{ rowCount: number; rows: any[] }>(
    'api.daita.ch',
    '/api/relational/exec',
    { sql },
    { Authorization: `Token ${config.auth.token}` },
  );

  cli.table(result.rows, { name: {}, sizeName: {}, status: {}, regionName: {} });
}
