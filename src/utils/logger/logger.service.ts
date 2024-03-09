import {
  transports,
  Logger,
  format,
  createLogger,
  LoggerOptions,
} from 'winston';
import { injectable } from 'inversify';

import container from '../../inversify/inversify.config';

import { IConfigService } from '../../config/config.service.interface';
import CONFIG_TYPES from '../../config/config.types';

import { ILogger } from './logger.interface';

@injectable()
export class LoggerService implements ILogger {
  private readonly _logger: Logger;
  private readonly _config: IConfigService;

  constructor() {
    this._config = container.get<IConfigService>(CONFIG_TYPES.IConfigService);
    const options = this._createLoggerOptions();

    this._logger = createLogger(options);
  }

  private _createLoggerOptions(): LoggerOptions {
    const options: LoggerOptions = {
      level: this._config.get('LOGGING_LEVEL'),
    };

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
    if (meta) message += JSON.stringify(meta);

    this._logger.log('debug', message);
  }

  info(message: string, meta?: object): void {
    if (meta) message += JSON.stringify(meta);

    this._logger.log('info', message);
  }

  warn(message: string, meta: object): void {
    this._logger.log('warn', `${message} - ${JSON.stringify(meta)}`);
  }

  error(message: string, meta: object): void {
    this._logger.log('error', `${message} - ${JSON.stringify(meta)}`);
  }
}
