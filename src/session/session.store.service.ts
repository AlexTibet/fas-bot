import { injectable, inject } from 'inversify';
import { SessionStore } from 'telegraf';

import { IBotContext } from '../context/context.interface';

import CONFIG_TYPES from '../config/config.types';
import { IConfigService } from '../config/config.service.interface';

import { ISessionStoreService } from './session.store.service.interface';
import { MongoSessionStore } from './mongo.session.store';

@injectable()
export class SessionStoreService implements ISessionStoreService {
  constructor(
    @inject(CONFIG_TYPES.IConfigService)
    private readonly config: IConfigService,
  ) {}

  getStore(): SessionStore<IBotContext> {
    return new MongoSessionStore(this.config);
  }
}
