import { request } from 'https';

export function sendPost<T>(
  host: string,
  path: string,
  body: any,
  headers: { [key: string]: string } = {},
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const req = request(
      {
        hostname: host,
        port: 443,
        path: path,
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
      },
      (res) => {
        let data = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          if (res.statusCode !== 200) {
            console.log(data, res.statusCode);
            return reject(new Error(data));
          }
          const responseData = JSON.parse(data);
          resolve(responseData);
        });
      },
    ).on('error', (err) => {
      reject(err);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}
