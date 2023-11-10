import 'reflect-metadata';
import { injectable } from 'inversify';
import { DotenvParseOutput, config } from 'dotenv';

import { IConfigService } from './config.service.interface';
import CONFIG_ERRORS from './config.errors';

@injectable()
export class ConfigService implements IConfigService {
  private readonly config: DotenvParseOutput;

  constructor() {
    const { error, parsed } = config();

    if (error) {
      throw new Error(CONFIG_ERRORS.envNotFound);
    }

    if (!parsed) {
      throw new Error(CONFIG_ERRORS.envIsEmpty);
    }

    this.config = parsed;
  }

  get(key: string): string {
    const value = this.config[key];

    if (!value) {
      throw new Error(CONFIG_ERRORS.keyNotFound);
    }

    return value;
  }
}
