import { getSha1 } from './hash';
import * as https from 'https';

export function getLeakedCount(password: string) {
  const shaHash = getSha1(password);
  const shaSuffix = shaHash.substr(5).toUpperCase();
  return new Promise<number>((resolve, reject) => {
    https
      .get(`https://api.pwnedpasswords.com/range/${shaHash.substr(0, 5)}`, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
          data += chunk;
        });

        resp.on('end', () => {
          const lines = data.split('\r\n');
          for (const line of lines) {
            const [hash, count] = line.split(':');
            if (hash === shaSuffix) {
              return resolve(parseInt(count));
            }
          }
          resolve(0);
        });
      })
      .on('error', (err) => {
        reject(err);
      })
      .end();
  });
}
