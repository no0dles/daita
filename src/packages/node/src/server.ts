import { createServer, RequestListener, Server } from 'http';

export function getServer(listener: RequestListener, port?: number) {
  const server = createServer(listener);
  return new Promise<{ server: Server; address: string }>((resolve) => {
    server.listen(port ?? 0, () => {
      const address = server.address();
      if (address) {
        if (typeof address === 'string') {
          resolve({ server, address });
        } else {
          resolve({ server, address: `http://localhost:${address.port}` });
        }
      } else {
        resolve({ server, address: '' });
      }
    });
  });
}
