import { getSha1 } from './hash';
import * as https from 'https';
import { Defer } from '../../common/utils';

export function getLeakedCount(password: string) {
  const shaHash = getSha1(password);
  const shaSuffix = shaHash.substr(5).toUpperCase();
  const defer = new Defer<number>();
  https
    .get(
      `https://api.pwnedpasswords.com/range/${shaHash.substr(0, 5)}`,
      (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk;
        });

        resp.on('end', () => {
          const lines = data.split('\r\n');
          for (const line of lines) {
            const [hash, count] = line.split(':');
            if (hash === shaSuffix) {
              return defer.resolve(parseInt(count));
            }
          }
          defer.resolve(0);
        });
      },
    )
    .on('error', (err) => {
      defer.reject(err);
    });
  return defer.promise;
}
