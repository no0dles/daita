import { collectDefaultMetrics, Registry } from 'prom-client';

export const metricRegister = new Registry();
collectDefaultMetrics({ register: metricRegister });
