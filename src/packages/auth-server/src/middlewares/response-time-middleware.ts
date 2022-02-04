import { RequestHandler } from 'express';
import { Histogram, Summary } from 'prom-client';
import { metricRegister } from '../metric';

export function responseTimeMetricMiddleware(prefix: string): RequestHandler {
  const responseTime = new Summary({
    name: `${prefix}_response_time`,
    help: 'response time',
    percentiles: [0.5, 0.75, 0.95, 0.98, 0.99, 0.999],
    registers: [metricRegister],
    labelNames: ['method', 'path'],
  });
  const statusCode = new Histogram({
    name: `${prefix}_status_code`,
    help: 'response status codes',
    buckets: [200, 400, 401, 404, 500],
    registers: [metricRegister],
  });

  return (req, res, next) => {
    const timer = responseTime.startTimer({
      path: req.path,
      method: req.method,
    });
    res.on('finish', () => {
      statusCode.observe(res.statusCode);
      timer();
    });
    next();
  };
}
