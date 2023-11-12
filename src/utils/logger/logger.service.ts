import {
  transports,
  Logger,
  format,
  createLogger,
  LoggerOptions,
} from 'winston';

import { ILogger } from './logger.interface';
import { injectable } from 'inversify';

@injectable()
export class LoggerService implements ILogger {
  private readonly _logger: Logger;

  constructor() {
    const options = this._createLoggerOptions();

    this._logger = createLogger(options);
  }

  private _createLoggerOptions(): LoggerOptions {
    const options: LoggerOptions = {};

    options.format = format.combine(
      format.colorize({ all: true }),
      format.label({ label: 'App' }),
      format.timestamp(),
      format.printf(({ level, message, label, timestamp }) => {
        return `${timestamp} [${label}] ${level}: ${message}`;
      }),
    );

    const consoleTransport = new transports.Console();
    const fileTransport = new transports.File({
      filename: 'fas-bot.log',
    });
    const errorFileTransport = new transports.File({
      filename: 'error.log',
      level: 'error',
    });

    options.transports = [consoleTransport, fileTransport, errorFileTransport];

    return options;
  }

  log(message: string, meta?: object): void {
    this._logger.log('debug', message, meta);
  }

  info(message: string, meta?: object): void {
    this._logger.log('info', message, meta);
  }

  warn(message: string, meta?: object): void {
    this._logger.log('warn', message, meta);
  }

  error(message: string, meta?: object): void {
    this._logger.log('error', message, meta);
  }
}
