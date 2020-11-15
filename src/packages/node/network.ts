import { Defer } from '../common';
import net from 'net';
import { getRandomTestPort } from './random-port';

export function waitForPort(port: number) {
  const defer = new Defer<void>();
  const client = net.createConnection({ port }, () => {
    console.log('port is open');
    defer.resolve();
    client.end();
  });
  client.on('error', (e) => {
    console.log(e);
    defer.reject(e);
  });
  return defer.promise;
}

export async function getFreeTestPort() {
  let port = getRandomTestPort();
  while (await isPortInUse(port)) {
    port = getRandomTestPort();
  }
  return port;
}

export function isPortInUse(port: number) {
  const defer = new Defer<boolean>();
  const server = net.createServer((socket) => {
    socket.write('Echo server\r\n');
    socket.pipe(socket);
  });

  server.listen(port, '127.0.0.1');
  server.on('error', () => {
    defer.resolve(true);
  });
  server.on('listening', () => {
    server.close();
    defer.resolve(false);
  });
  return defer.promise;
}
