import { getBoolEnvironmentVariable, getEnvironmentVariable, getOptionEnvironmentVariable } from './environment';
import { failNever } from './fail-never';

export interface Logger {
  trace(err: Error | string, props?: { [key: string]: any }): void;
  debug(message: string, props?: { [key: string]: any }): void;
  info(message: string, props?: { [key: string]: any }): void;
  warn(message: string, props?: { [key: string]: any }): void;
  error(message: string, props?: { [key: string]: any }): void;
  error(err: Error | unknown, props?: { [key: string]: any }): void;
}

export function createLogger(props?: { [key: string]: any }): Logger {
  return new LoggerImpl(props || {});
}

export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error';
export type LogFormat = 'plain' | 'json' | 'pretty';

export interface LogFormatter {
  log(msg: LogMessage): void;
}

export interface LogMessage {
  time: Date;
  level: LogLevel;
  message: string;
  props: { [key: string]: any };
}

const jsonFormatter: LogFormatter = {
  log(msg: LogMessage) {
    console.log(JSON.stringify(msg));
  },
};
const plainFormatter: LogFormatter = {
  log(msg: LogMessage) {
    const propsMessage = Object.keys(msg.props)
      .map((key) => `props.${key}=${msg.props[key]}`)
      .join(' ');
    const consoleMessage = `level=${msg.level} message=${msg.message} time=${msg.time}${
      propsMessage.length > 0 ? ' ' : ''
    }${propsMessage}`;
    if (msg.level === 'error') {
      console.error(consoleMessage);
    } else if (msg.level === 'warn') {
      console.warn(consoleMessage);
    } else if (msg.level === 'info') {
      console.info(consoleMessage);
    } else if (msg.level === 'debug') {
      console.debug(consoleMessage);
    } else if (msg.level === 'trace') {
      console.trace(consoleMessage);
    } else {
      failNever(msg.level, 'unknown log level');
    }
  },
};

function padLeft(val: number, length = 2) {
  return val.toString().padStart(length, '0');
}
const prettyFormatter: LogFormatter = {
  log(msg: LogMessage) {
    console.log(
      `[${padLeft(msg.time.getDay())}.${padLeft(msg.time.getMonth())}.${msg.time.getFullYear()} ${padLeft(
        msg.time.getHours(),
      )}:${padLeft(msg.time.getMinutes())}:${padLeft(msg.time.getSeconds())}.${padLeft(
        msg.time.getMilliseconds(),
        3,
      )}] [${Object.keys(msg.props)
        .map((k) => `${k}=${msg.props[k]}`)
        .join(', ')}] ${msg.level}: ${msg.message}`,
    );
  },
};

class LoggerImpl implements Logger {
  private readonly enabled: boolean;
  private readonly level: LogLevel;
  private readonly format: LogFormat;
  private readonly formatter: LogFormatter;

  constructor(private props: { [key: string]: any }) {
    this.enabled = getBoolEnvironmentVariable('LOGGER_ENABLED', getEnvironmentVariable('JEST_WORKER_ID') === null);
    this.format = getOptionEnvironmentVariable('LOGGER_FORMAT', ['plain', 'json', 'pretty'], 'pretty');
    this.level = getOptionEnvironmentVariable('LOGGER_LEVEL', ['trace', 'debug', 'info', 'warn', 'error'], 'info');
    switch (this.format) {
      case 'json':
        this.formatter = jsonFormatter;
        break;
      case 'plain':
        this.formatter = plainFormatter;
        break;
      case 'pretty':
        this.formatter = prettyFormatter;
        break;
    }
  }

  private shouldEmit(level: LogLevel): boolean {
    switch (this.level) {
      case 'trace':
        return true;
      case 'debug':
        return level === 'debug' || level === 'info' || level === 'warn' || level === 'error';
      case 'info':
        return level === 'info' || level === 'warn' || level === 'error';
      case 'warn':
        return level === 'warn' || level === 'error';
      case 'error':
        return level === 'error';
    }
  }

  private log(level: LogLevel, message: string, props?: { [p: string]: any }) {
    if (!this.enabled) {
      return;
    }

    if (!this.shouldEmit(level)) {
      return;
    }

    this.formatter.log({ time: new Date(), level, message, props: { ...this.props, ...(props || {}) } });
  }

  debug(message: string, props?: { [p: string]: any }): void {
    this.log('debug', message, props);
  }

  error(message: string, props?: { [p: string]: any }): void;
  error(err: Error, props?: { [p: string]: any }): void;
  error(message: string | Error, props?: { [p: string]: any }): void {
    if (typeof message === 'string') {
      this.log('error', message, props);
    } else {
      this.log('error', message.message, { ...props, error: message });
    }
  }

  info(message: string, props?: { [p: string]: any }): void {
    this.log('info', message, props);
  }

  warn(message: string, props?: { [p: string]: any }): void {
    this.log('warn', message, props);
  }

  trace(message: Error | string, props?: { [p: string]: any }): void {
    if (typeof message === 'string') {
      this.log('trace', message, props);
    } else {
      this.log('trace', message.message, { ...props, error: message });
    }
  }
}
