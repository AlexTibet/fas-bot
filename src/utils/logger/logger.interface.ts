export interface ILogger {
  log(message: string): void;
  info(message: string): void;
  warn(message: string, meta: object): void;
  error(message: string, meta: object): void;
}
