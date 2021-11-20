import express from 'express';
import { Server } from 'http';
import { createLogger } from '@daita/common/utils/logger';
import { metricRegister } from './metric';

export function createMetricsApp(port: number) {
  const app = express();
  const logger = createLogger({ package: 'auth-server', app: 'metric' });

  app.get('', async (req, res) => {
    res.status(200).set('Content-Type', 'text/plain');
    res.end(await metricRegister.metrics());
  });

  return new Promise<Server>((resolve) => {
    const server = app.listen(port, () => {
      resolve(server);
      logger.info(`metric server is running on http://localhost:${port}`);
    });
  });
}
