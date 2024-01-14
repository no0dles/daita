import net from 'net';
import { getRandomTestPort } from './random-port';

export function waitForPort(port: number) {
  return new Promise<void>((resolve, reject) => {
    const client = net.createConnection({ port }, () => {
      resolve();
      client.end();
    });
    client.on('error', (e) => {
      reject(e);
    });
  });
}

export async function getFreeTestPort() {
  let port = getRandomTestPort();
  while (await isPortInUse(port)) {
    port = getRandomTestPort();
  }
  return port;
}

export function isPortInUse(port: number) {
  return new Promise<boolean>((resolve, reject) => {
    const server = net.createServer((socket) => {
      socket.write('Echo server\r\n');
      socket.pipe(socket);
    });

    server.listen(port, '127.0.0.1');
    server.on('error', () => {
      resolve(true);
    });
    server.on('listening', () => {
      server.close();
      resolve(false);
    });
  });
}
