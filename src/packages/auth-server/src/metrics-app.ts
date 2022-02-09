import express from 'express';
import { RequestListener } from 'http';
import { metricRegister } from './metric';

export function createMetricsApp(): RequestListener {
  const app = express();

  app.get('', async (req, res) => {
    res.status(200).set('Content-Type', 'text/plain');
    res.end(await metricRegister.metrics());
  });

  return app;
}
